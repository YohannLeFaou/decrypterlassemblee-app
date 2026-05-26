# Architecture — nos-deputes-app

Application Next.js permettant d'interroger les données parlementaires de l'Assemblée nationale via un agent IA générant et exécutant du code Python.

_Dernière mise à jour : mai 2026 — migration vers l'architecture code agent._

---

## Vue d'ensemble

```
Utilisateur (navigateur)
    │
    │  HTTPS (Caddy → reverse proxy)
    ▼
┌──────────────────────────────────────────────────────┐
│  Next.js App (Docker, port 3000 interne)             │
│                                                      │
│  app/api/chat/route.ts                               │
│   └── Boucle agentique (max 12 rounds, SSE stream)  │
│         │                                            │
│         ├── LLM Provider (DeepSeek par défaut)       │
│         │    lib/providers/deepseek.ts               │
│         │    lib/providers/anthropic.ts              │
│         │    lib/providers/mistral.ts                │
│         │                                            │
│         └── executePython()  ←  lib/sandbox.ts       │
│                  │  HTTP POST /execute               │
│                  ▼                                   │
│  Sandbox Flask (Docker, réseau interne uniquement)   │
│   sandbox/server.py                                  │
│    └── sandbox/executor.py                           │
│          ├── exec(code_python)                       │
│          ├── conn + query() disponibles              │
│          └── an.db (monté read-only)                 │
└──────────────────────────────────────────────────────┘
    │
    │  Quotidien (cron 3h du matin)
    ▼
┌──────────────────────────────────────────────────────┐
│  ETL Python (Docker, on-demand)                      │
│  nos-deputes-data — an-etl CLI                       │
│   └── an.db (monté read-write)                       │
└──────────────────────────────────────────────────────┘
```

---

## Flux d'une question utilisateur

1. `Chat.tsx` envoie `POST /api/chat` avec `{ question, history }`
2. `/api/chat/route.ts` démarre une **réponse SSE** et entre dans la boucle agentique :
   - Appel LLM avec les outils disponibles → le LLM génère du texte et/ou un tool call `execute_python`
   - Si tool call → `executePython(code)` → HTTP POST vers le sandbox → retour `{ stdout, stderr, error }`
   - Le résultat est injecté dans l'historique et l'on retourne au LLM
   - On recommence jusqu'à `stopReason === "end_turn"` ou 12 rounds maximum
3. `Chat.tsx` reçoit les events SSE et met à jour l'UI en temps réel

**Événements SSE émis :**
```
{ type: "text",        text: "..." }         ← texte partiel du LLM
{ type: "tool_call",   name: "execute_python" }  ← LLM lance un outil
{ type: "tool_result", name: "execute_python" }  ← résultat reçu
{ type: "error",       message: "..." }      ← erreur catchée
{ type: "done" }                             ← fin du stream
```

---

## LLM Provider — abstraction multi-provider

### Interface

`lib/llm-provider.ts` définit les types neutres et la factory :

```typescript
export type NeutralMessage =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string | null; toolCalls?: ToolCall[]; reasoning_content?: string }
  | { role: "tool_result"; toolResults: ToolResult[] };

export interface LLMResponse {
  text: string | null;
  toolCalls: ToolCall[];
  stopReason: "tool_use" | "end_turn";
  reasoning_content?: string;  // DeepSeek thinking mode
}

export interface LLMProvider {
  chat(messages: NeutralMessage[], tools: NeutralTool[], system: string): Promise<LLMResponse>;
}
```

La variable d'env `LLM_PROVIDER` sélectionne le provider au runtime :

```
LLM_PROVIDER=deepseek   →  lib/providers/deepseek.ts   (défaut)
LLM_PROVIDER=anthropic  →  lib/providers/anthropic.ts
LLM_PROVIDER=mistral    →  lib/providers/mistral.ts
```

### Pourquoi un fichier par provider (pas une lib générique) ?

Chaque provider a ses spécificités d'API. Utiliser un SDK universel (LiteLLM) introduirait une dépendance lourde et masquerait les comportements spéciaux (ex. `reasoning_content` de DeepSeek). Un fichier par provider est explicite, lisible, et facile à déboguer.

### Provider DeepSeek (`lib/providers/deepseek.ts`)

API OpenAI-compatible (`https://api.deepseek.com/v1/chat/completions`).

**Point critique — `reasoning_content` :** DeepSeek V4 Flash fonctionne en mode thinking par défaut. Il retourne un champ `reasoning_content` dans chaque réponse assistant. L'API exige qu'il soit retransmis dans les messages suivants, sinon erreur 400 `"The reasoning_content in the thinking mode must be passed back to the API"`. Géré transparentement dans le provider : extrait de la réponse, stocké dans `NeutralMessage`, réinjecté à la prochaine requête.

Variables d'env : `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL` (défaut : `deepseek-v4-flash`).

### Pourquoi DeepSeek par défaut ?

Benchmark interne (repo `nos-deputes-mcp`) sur 26 questions : 92 % de réussite pour DeepSeek V4 Flash, résultats comparables à Anthropic Claude Haiku pour un coût ~6× moindre. Le caching est automatique côté serveur DeepSeek (pas de code à écrire).

---

## Outil unique : `execute_python`

`lib/tools.ts` définit un seul outil :

```typescript
{
  name: "execute_python",
  description: "Exécute du code Python dans un sandbox sécurisé...",
  input_schema: { type: "object", properties: { code: { type: "string" } }, required: ["code"] }
}
```

**Pourquoi un seul outil générique plutôt que 7 outils SQL prédéfinis ?**

L'ancienne architecture avait 7 outils SQL (search_depute, get_votes_depute, get_scrutin, etc.). Ils limitaient les analyses complexes : pas de jointures arbitraires, pas de calculs ad-hoc, pas d'agrégations sur plusieurs législatures. Le code agent permet au LLM d'écrire exactement la requête dont il a besoin.

---

## Sandbox Python (`sandbox/`)

### Pourquoi HTTP (Flask) plutôt que stdin/stdout ?

Le repo `nos-deputes-mcp` utilise stdin/stdout (Docker long-running). Pour la prod, HTTP est préférable :
- Docker Compose gère le cycle de vie du service (restart, healthcheck)
- L'app Next.js (TypeScript) fait un simple `fetch()`, pas besoin de gérer un processus fils
- Le healthcheck Docker natif (`GET /health`) garantit que le sandbox est prêt avant l'app

### `sandbox/executor.py`

```python
DB_PATH = os.environ.get("DB_PATH", "/data/an.db")

def execute(code: str, timeout: int = 30) -> dict:
    conn = sqlite3.connect(f"file:{DB_PATH}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row

    def query(sql, params=()):
        return [dict(r) for r in conn.execute(sql, params).fetchall()]

    globs = {"conn": conn, "query": query}

    def _handler(signum, frame):
        raise TimeoutError(f"Timeout après {timeout}s")

    signal.signal(signal.SIGALRM, _handler)
    signal.alarm(timeout)
    try:
        with io.StringIO() as buf:
            with contextlib.redirect_stdout(buf):
                exec(code, globs)
            return {"stdout": buf.getvalue(), "stderr": "", "error": None}
    except Exception as e:
        return {"stdout": "", "stderr": "", "error": str(e)}
    finally:
        signal.alarm(0)
        conn.close()
```

Points clés :
- **DB read-only** : URI SQLite `?mode=ro` — impossible d'écrire, même accidentellement
- **Timeout via `signal.SIGALRM`** : 30s max par exécution. SIGALRM est POSIX (Linux uniquement, compatible avec l'image Docker `python:3.11-slim`)
- **Globals injectés** : `conn` et `query()` disponibles directement sans import dans le code généré par le LLM
- **stdout capturé** : `contextlib.redirect_stdout` — le LLM utilise `print()` pour retourner ses résultats
- **Connexion éphémère** : nouvelle connexion SQLite par appel (safe pour le single-worker gunicorn)

### `sandbox/server.py`

```python
@app.post("/execute")
def execute_route():
    data = request.get_json()
    result = execute(data["code"], data.get("timeout", 30))
    return jsonify(result)

@app.get("/health")
def health():
    return "ok"
```

### `sandbox/Dockerfile`

```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir flask gunicorn
COPY executor.py server.py ./
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:5000", "--timeout", "60", "server:app"]
```

**Un seul worker gunicorn** : SQLite est thread-safe en lecture, mais un seul worker évite toute complication de concurrence. Suffisant pour la beta (rate limit : 10 questions/jour/IP).

**Timeout gunicorn 60s** : 30s sandbox + 30s marge pour le overhead Flask/réseau.

### `lib/sandbox.ts` — client côté app

```typescript
const SANDBOX_URL = process.env.SANDBOX_URL ?? "http://sandbox:5000";

export async function executePython(code: string): Promise<SandboxResult> {
  const res = await fetch(`${SANDBOX_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, timeout: 30 }),
    signal: AbortSignal.timeout(35_000),  // 30s sandbox + 5s réseau
  });
  if (!res.ok) throw new Error(`Sandbox HTTP ${res.status}`);
  return res.json();
}
```

**`AbortSignal.timeout(35_000)`** : double protection côté client. Si le sandbox plante sans répondre, l'app ne reste pas bloquée indéfiniment.

---

## Sécurité du sandbox

### Isolation réseau

Le sandbox est sur le réseau `sandbox_net` (Docker Compose `internal: true`). Il ne peut pas initier de connexion vers internet — même si du code malveillant tente `import urllib; urllib.request.urlopen(...)`, la connexion TCP est refusée au niveau réseau.

### Limites de ressources (docker-compose.yml)

```yaml
sandbox:
  deploy:
    resources:
      limits:
        memory: 256M
        cpus: "1"
```

### Risques résiduels acceptés pour la beta

- Le sandbox peut appeler l'app Next.js via le réseau `sandbox_net` (les deux partagent ce réseau). Pour bloquer ça : `iptables` ou séparer sur deux réseaux distincts.
- `exec()` Python peut importer des modules système (`os`, `sys`, `subprocess`). Pas de profil seccomp en place. Atténué : le réseau interne empêche l'exfiltration.
- Un code malveillant pourrait consommer 256 MB de RAM ou 100 % d'un CPU pendant 30s.

### Hardening post-beta (non implémenté)

- `cap_drop: [ALL]` dans docker-compose.yml
- `read_only: true` sur le filesystem du container sandbox
- Profil seccomp custom (bloquer `socket`, `execve`, etc.)
- Réseau sandbox isolé de l'app (deux réseaux séparés)

---

## Docker Compose — déploiement prod (`deploy/docker-compose.yml`)

4 services :

| Service | Image | Rôle | Réseaux |
|---------|-------|------|---------|
| `app` | build local (Dockerfile racine) | Next.js 3000 | frontend + sandbox_net |
| `sandbox` | build local (sandbox/Dockerfile) | Flask 5000 | sandbox_net uniquement |
| `caddy` | caddy:2-alpine | Reverse proxy + TLS | frontend |
| `etl` | build local (deploy/etl/Dockerfile) | ETL on-demand | default |

**Réseaux :**
- `frontend` : caddy ↔ app
- `sandbox_net` (`internal: true`) : app ↔ sandbox, pas d'accès internet

**Volume `an.db` :**
- Sandbox : monté `./data/an.db:/data/an.db:ro` (read-only)
- ETL : monté `./data/an.db:/data/an.db:rw` (read-write)

**Concurrence ETL / sandbox :** SQLite en mode WAL — le sandbox lit les anciennes données pendant que l'ETL écrit, puis voit les nouvelles après le commit. Aucun verrou bloquant.

---

## Dockerfile de l'app (build multi-stage)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build        # génère .next/standalone

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**`output: "standalone"` dans `next.config.ts`** : Next.js génère un serveur Node.js autonome avec uniquement les dépendances nécessaires. Pas de `node_modules` complet dans l'image finale — image plus légère.

**Pas de `better-sqlite3`** : depuis la migration code agent, l'app Next.js n'accède plus à SQLite directement. Plus de module natif à compiler → build Docker simplifié.

---

## ETL quotidien

`deploy/etl/Dockerfile` embarque le package Python `nos-deputes-data` (CLI `an-etl`).

Cron sur le VPS :
```
0 3 * * * root cd /opt/nos-deputes/nos-deputes-app/deploy && docker compose run --rm etl >> /var/log/nos-deputes-etl.log 2>&1
```

L'ETL s'exécute en container éphémère (`--rm`). Il écrit dans `an.db`, le sandbox le lit en read-only. Pas de downtime pendant la mise à jour (WAL mode).

---

## Caddy — HTTPS automatique

```
decrypterlassemblee.fr {
    reverse_proxy app:3000
}
```

Caddy provisionne automatiquement les certificats Let's Encrypt via ACME (HTTP-01 challenge). Aucune configuration TLS manuelle.

---

## Rate limiting

`lib/rate-limit.ts` — compteur in-memory par IP, reset quotidien :

```typescript
const MAX_QUESTIONS = 10;  // par IP par jour
```

Implémentation simpliste (Map en mémoire) : suffisant pour la beta, redémarrage app = reset des compteurs. Pour la prod : Redis ou compteur persistant.

---

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `app/api/chat/route.ts` | Boucle agentique principale, SSE stream |
| `lib/llm-provider.ts` | Interface `LLMProvider` + types neutres + factory |
| `lib/providers/deepseek.ts` | Provider DeepSeek (défaut) — gère `reasoning_content` |
| `lib/providers/anthropic.ts` | Provider Anthropic Claude |
| `lib/providers/mistral.ts` | Provider Mistral |
| `lib/tools.ts` | Outil `execute_python` + system prompt détaillé |
| `lib/sandbox.ts` | Client HTTP vers le sandbox Flask |
| `lib/rate-limit.ts` | Rate limit in-memory (10 questions/jour/IP) |
| `lib/investigations.ts` | Investigations pré-calculées (données réelles DB) |
| `components/Chat.tsx` | UI chat React + parsing SSE + investigations |
| `sandbox/executor.py` | Exécution Python sécurisée + accès SQLite |
| `sandbox/server.py` | Flask wrapper + `/execute` + `/health` |
| `sandbox/Dockerfile` | Image sandbox (python:3.11-slim + flask + gunicorn) |
| `Dockerfile` | Image app Next.js (node:20-alpine, multi-stage) |
| `deploy/docker-compose.yml` | Orchestration 4 services |
| `deploy/Caddyfile` | Reverse proxy + HTTPS auto |
| `deploy/etl/Dockerfile` | Image ETL Python |
| `deploy/deploy.sh` | Script de déploiement (rsync + docker compose up --build) |
| `next.config.ts` | `output: "standalone"` pour le build Docker |

---

## Variables d'environnement

| Variable | Description | Défaut |
|---|---|---|
| `LLM_PROVIDER` | Provider LLM actif | `anthropic` |
| `DEEPSEEK_API_KEY` | Clé API DeepSeek | — |
| `DEEPSEEK_MODEL` | Modèle DeepSeek | `deepseek-v4-flash` |
| `ANTHROPIC_API_KEY` | Clé API Anthropic | — |
| `ANTHROPIC_MODEL` | Modèle Anthropic | `claude-haiku-4-5-20251001` |
| `MISTRAL_API_KEY` | Clé API Mistral | — |
| `MISTRAL_MODEL` | Modèle Mistral | `mistral-small-latest` |
| `SANDBOX_URL` | URL du sandbox Flask | `http://sandbox:5000` |

---

## Hébergement

**VPS Hetzner CX22** (Falkenstein, Allemagne) :
- 2 vCPU AMD, 4 GB RAM, 40 GB SSD
- ~4 €/mois
- OS : Ubuntu 24.04

**Choix Hetzner vs OVH/Scaleway :** prix imbattable pour la beta. Pas 100 % souverain français (Allemagne), mais suffisant. OVH (11,50 €/mois) et Scaleway (19,70 €/mois) sont les alternatives si la souveraineté devient un critère.

---

## Historique des architectures

### Avant mai 2026 — 7 outils SQL

L'app utilisait 7 outils SQL prédéfinis (search_depute, get_votes_depute, get_scrutin…) exécutés directement via `better-sqlite3` dans le process Next.js. L'outil `/app/api/tool/route.ts` dispatchait les appels.

**Limites :** analyses complexes impossibles (jointures multi-tables, agrégations arbitraires, comparaisons inter-législatures).

### Mai 2026 — Migration code agent

Migration vers un unique outil `execute_python` + sandbox Docker Flask. Le LLM génère du Python libre, exécuté dans un container isolé (réseau interne, DB read-only, timeout 30s). Suppression de `better-sqlite3`, `lib/db.ts`, `lib/tools-sql.ts`, `app/api/tool/route.ts`.

Fichiers supprimés : `lib/tools-sql.ts`, `lib/tool-executor.ts`, `lib/db.ts`, `app/api/tool/route.ts`.

### Génération des investigations

Les données des investigations (`lib/investigations.ts`) sont calculées directement par requêtes SQL sur `an.db` (via Bash + Python), puis analysées et rédigées par le LLM (Claude Code / Sonnet). Pas de pipeline automatisé — mise à jour manuelle quand les données changent significativement.

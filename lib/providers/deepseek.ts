import type { LLMProvider, NeutralMessage, LLMResponse } from "@/lib/llm-provider";
import type { NeutralTool } from "@/lib/tools";

interface DeepSeekToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

interface DeepSeekMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  reasoning_content?: string;
  tool_calls?: DeepSeekToolCall[];
  tool_call_id?: string;
}

interface DeepSeekResponse {
  choices: {
    message: { role: string; content: string | null; reasoning_content?: string; tool_calls?: DeepSeekToolCall[] };
    finish_reason: string;
  }[];
}

/** Erreurs réseau transitoires côté fournisseur : la requête n'a pas abouti, un retry a du sens. */
function isTransient(err: unknown): boolean {
  const msg = err instanceof Error ? `${err.message} ${String(err.cause ?? "")}` : String(err);
  return /fetch failed|other side closed|ECONNRESET|ETIMEDOUT|EPIPE|socket hang up|terminated/i.test(msg);
}

const RETRY_DELAYS_MS = [500, 1500];

export class DeepSeekProvider implements LLMProvider {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY ?? "";
    // "deepseek-v4-flash" n'existe plus : l'API redirige silencieusement vers
    // "deepseek-flash". On nomme le modèle réel pour ne pas dépendre de ça.
    this.model = process.env.DEEPSEEK_MODEL ?? "deepseek-flash";
    this.baseUrl = "https://api.deepseek.com";
  }

  async chat(messages: NeutralMessage[], tools: NeutralTool[], system: string): Promise<LLMResponse> {
    const expanded: DeepSeekMessage[] = [{ role: "system", content: system }];

    for (const m of messages) {
      if (m.role === "tool_result" && m.toolResults) {
        for (const r of m.toolResults) {
          expanded.push({ role: "tool", content: r.content, tool_call_id: r.id });
        }
      } else if (m.role === "assistant" && m.toolCalls?.length) {
        expanded.push({
          role: "assistant",
          content: m.text ?? null,
          ...(m.reasoning_content ? { reasoning_content: m.reasoning_content } : {}),
          tool_calls: m.toolCalls.map((tc) => ({
            id: tc.id,
            type: "function" as const,
            function: { name: tc.name, arguments: JSON.stringify(tc.input) },
          })),
        });
      } else if (m.role === "user" || m.role === "assistant") {
        expanded.push({ role: m.role, content: m.text ?? "" });
      }
    }

    // Le mode "thinking" est actif par défaut chez DeepSeek. Il double la latence
    // et les tokens de sortie, renvoie souvent un content vide, et ne produit pas
    // de meilleures requêtes ici : on le désactive.
    //
    // tools vide => on n'envoie pas le champ, ce qui force le modèle à rédiger
    // sa réponse au lieu d'appeler un outil (voir la conclusion forcée côté route).
    const body = {
      model: this.model,
      max_tokens: 4096,
      thinking: { type: "disabled" as const },
      messages: expanded,
      ...(tools.length > 0
        ? {
            tools: tools.map((t) => ({
              type: "function" as const,
              function: {
                name: t.name,
                description: t.description,
                parameters: t.input_schema,
              },
            })),
            tool_choice: "auto" as const,
          }
        : {}),
    };

    // DeepSeek coupe parfois la connexion en cours de requête (SocketError), et
    // renvoie parfois des arguments de tool_call tronqués (JSON invalide). Dans les
    // deux cas la requête est perdue sans avoir rien produit : on réessaie.
    let lastErr: unknown;
    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
      try {
        return await this.attempt(body);
      } catch (err) {
        lastErr = err;
        const retryable = isTransient(err) || err instanceof SyntaxError;
        if (!retryable || attempt === RETRY_DELAYS_MS.length) break;
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
      }
    }
    throw lastErr;
  }

  private async attempt(body: unknown): Promise<LLMResponse> {
    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DeepSeek API error ${res.status}: ${err}`);
    }

    const data: DeepSeekResponse = await res.json();
    const choice = data.choices?.[0];
    if (!choice) throw new Error("DeepSeek: réponse sans choices");
    const msg = choice.message;

    const toolCalls = (msg.tool_calls ?? []).map((tc) => ({
      id: tc.id,
      name: tc.function.name,
      input: JSON.parse(tc.function.arguments) as Record<string, unknown>,
    }));

    return {
      text: msg.content ?? null,
      toolCalls,
      stopReason: choice.finish_reason === "tool_calls" ? "tool_use" : "end_turn",
      ...(msg.reasoning_content ? { reasoning_content: msg.reasoning_content } : {}),
    };
  }
}

import { NextRequest } from "next/server";
import { getProvider } from "@/lib/llm-provider";
import type { NeutralMessage, ToolResult } from "@/lib/llm-provider";
import { MCP_TOOLS, SYSTEM_PROMPT } from "@/lib/tools";
import { executePython } from "@/lib/sandbox";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_TOOL_ROUNDS = 12;

import { createHash } from "crypto";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 12);
}

function logRequest(fields: Record<string, unknown>) {
  process.stdout.write(JSON.stringify({ ts: new Date().toISOString(), ...fields }) + "\n");
}

export async function POST(req: NextRequest) {
  const { question, history } = await req.json();
  const startMs = Date.now();

  if (!question?.trim()) {
    return new Response("Question vide", { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";
  const whitelist = (process.env.RATE_LIMIT_WHITELIST ?? "").split(",").map(s => s.trim()).filter(Boolean);
  const { allowed, remaining } = whitelist.includes(ip)
    ? { allowed: true, remaining: 999 }
    : checkRateLimit(ip);

  if (!allowed) {
    logRequest({ event: "rate_limited", ip_hash: hashIp(ip), user_agent: userAgent });
    return new Response(JSON.stringify({ error: "Limite journalière atteinte (10 questions/jour par IP). Réessayez demain." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const provider = getProvider();
  const encoder = new TextEncoder();
  const isFollowUp = Array.isArray(history) && history.length > 0;

  // Métriques accumulées pendant le traitement
  const metrics = {
    rounds: 0,
    python_calls: 0,
    python_errors: 0,
    status: "ok" as
      | "ok"
      | "error"
      | "crash"
      | "client_disconnected"
      | "provider_timeout"
      | "max_rounds"
      | "no_answer_empty"
      | "no_answer",
  };

  const stream = new ReadableStream({
    async start(controller) {
      // clientGone : le client s'est vraiment déconnecté (signal d'abort).
      // sendFailed : un enqueue a échoué pour une autre raison — on arrête
      // d'écrire, mais sans conclure à un abandon utilisateur.
      let clientGone = false;
      let sendFailed = false;

      req.signal.addEventListener("abort", () => {
        clientGone = true;
      });

      const send = (data: object) => {
        if (clientGone || sendFailed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          sendFailed = true;
        }
      };

      try {
        const messages: NeutralMessage[] = [
          ...(history ?? []),
          { role: "user", text: question },
        ];

        // La boucle peut se terminer sans qu'aucun texte n'ait été envoyé :
        // soit le budget de rounds est épuisé, soit le modèle conclut son tour
        // avec un contenu vide. Dans les deux cas l'utilisateur ne voit rien,
        // et il faut lui faire rédiger une réponse.
        let anyText = false;
        // Distingue les deux causes : budget de rounds épuisé, ou modèle qui
        // termine son tour sans rien rédiger.
        let ranOutOfRounds = false;

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          // Inutile d'appeler le LLM ou le sandbox si personne n'attend la réponse.
          if (clientGone) break;
          metrics.rounds = round + 1;
          const response = await provider.chat(messages, MCP_TOOLS, SYSTEM_PROMPT);

          if (response.text) {
            const prefix = anyText ? "\n\n" : "";
            send({ type: "text", text: prefix + response.text });
            anyText = true;
          }
          for (const tc of response.toolCalls) {
            send({ type: "tool_call", name: tc.name });
          }

          if (response.stopReason !== "tool_use" || response.toolCalls.length === 0) break;

          messages.push({
            role: "assistant",
            text: response.text,
            toolCalls: response.toolCalls,
            ...(response.reasoning_content ? { reasoning_content: response.reasoning_content } : {}),
          });

          const toolResults: ToolResult[] = [];
          for (const tc of response.toolCalls) {
            metrics.python_calls++;
            const code = tc.input.code as string;
            const result = await executePython(code);
            if (result.error) metrics.python_errors++;
            send({ type: "tool_result", name: tc.name });
            toolResults.push({ id: tc.id, content: JSON.stringify(result) });
          }

          messages.push({ role: "tool_result", toolResults });

          // Dernier tour consommé alors que le modèle voulait continuer :
          // c'est le budget qui a manqué, pas le modèle qui a renoncé.
          if (round === MAX_TOOL_ROUNDS - 1) ranOutOfRounds = true;
        }

        // Sans ce rattrapage, la boucle sortait en silence et l'utilisateur
        // n'obtenait aucune réponse malgré les données déjà collectées.
        if (!anyText && !clientGone && metrics.python_calls > 0) {
          metrics.status = ranOutOfRounds ? "max_rounds" : "no_answer_empty";
          messages.push({
            role: "user",
            text:
              "Rédige maintenant ta réponse finale à partir des seules données déjà " +
              "collectées, sans nouvelle analyse. Si elles ne suffisent pas à répondre " +
              "complètement, expose ce que tu as trouvé et indique clairement ce qui manque.",
          });
          // Appel sans outils : le modèle ne peut que rédiger.
          const final = await provider.chat(messages, [], SYSTEM_PROMPT);
          if (final.text) {
            send({ type: "text", text: final.text });
            anyText = true;
          }
        }

        // Le rattrapage lui-même peut échouer : ne jamais terminer sur un écran vide.
        if (!anyText && !clientGone) {
          metrics.status = "no_answer";
          send({
            type: "text",
            text: "Je n'ai pas réussi à formuler une réponse à cette question. Reformulez-la ou posez-la en plusieurs fois.",
          });
        }

        send({ type: "done" });
      } catch (err) {
        // Un abandon utilisateur n'est pas un bug applicatif : ne pas le compter
        // comme un crash, sinon les métriques mélangent les deux.
        if (clientGone) {
          metrics.status = "client_disconnected";
        } else if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
          // Le fournisseur n'a rien renvoyé dans le délai imparti : ce n'est pas
          // un bug du site, et le visiteur mérite mieux qu'une erreur brute.
          metrics.status = "provider_timeout";
          console.error(`[chat] TIMEOUT fournisseur:`, err);
          send({
            type: "text",
            text: "Le service d'analyse ne répond pas pour le moment. Réessayez dans quelques minutes.",
          });
        } else {
          metrics.status = "crash";
          console.error(`[chat] CRASH:`, err);
          send({ type: "error", message: String(err) });
        }
      } finally {
        // Ne pas masquer une cause déjà identifiée : un crash ou un timeout
        // fournisseur reste la vraie raison, même si le visiteur est parti entre-temps.
        if (clientGone && metrics.status !== "crash" && metrics.status !== "provider_timeout") {
          metrics.status = "client_disconnected";
        }
        logRequest({
          event: "chat",
          ip_hash: hashIp(ip),
          user_agent: userAgent,
          provider: process.env.LLM_PROVIDER ?? "deepseek",
          follow_up: isFollowUp,
          remaining_quota: remaining,
          rounds: metrics.rounds,
          python_calls: metrics.python_calls,
          python_errors: metrics.python_errors,
          status: metrics.status,
          duration_ms: Date.now() - startMs,
        });
        try {
          controller.close();
        } catch {
          // déjà fermé côté client
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

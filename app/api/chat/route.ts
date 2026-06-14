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
    status: "ok" as "ok" | "error" | "crash",
  };

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const messages: NeutralMessage[] = [
          ...(history ?? []),
          { role: "user", text: question },
        ];

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          metrics.rounds = round + 1;
          const response = await provider.chat(messages, MCP_TOOLS, SYSTEM_PROMPT);

          if (response.text) {
            const prefix = round > 0 ? "\n\n" : "";
            send({ type: "text", text: prefix + response.text });
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
        }

        send({ type: "done" });
      } catch (err) {
        metrics.status = "crash";
        console.error(`[chat] CRASH:`, err);
        send({ type: "error", message: String(err) });
      } finally {
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
        controller.close();
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

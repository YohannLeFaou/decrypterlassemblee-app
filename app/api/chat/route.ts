import { NextRequest } from "next/server";
import { getProvider } from "@/lib/llm-provider";
import type { NeutralMessage, ToolResult } from "@/lib/llm-provider";
import { MCP_TOOLS, SYSTEM_PROMPT } from "@/lib/tools";
import { executePython } from "@/lib/sandbox";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_TOOL_ROUNDS = 12;

export async function POST(req: NextRequest) {
  const { question, history } = await req.json();

  if (!question?.trim()) {
    return new Response("Question vide", { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";
  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Limite journalière atteinte (10 questions/jour par IP). Réessayez demain." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }
  const isFollowUp = Array.isArray(history) && history.length > 0;
  console.log(`[chat] ip=${ip} remaining=${remaining} follow_up=${isFollowUp} question=${JSON.stringify(question.slice(0, 200))}`);

  const provider = getProvider();
  const encoder = new TextEncoder();

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
          console.log(`[chat] round ${round} — calling ${process.env.LLM_PROVIDER ?? "anthropic"}`);
          const response = await provider.chat(messages, MCP_TOOLS, SYSTEM_PROMPT);
          console.log(`[chat] round ${round} — stop_reason=${response.stopReason} tool_calls=${response.toolCalls.length}`);

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
            console.log(`[chat] execute_python start`);
            const code = tc.input.code as string;
            const result = await executePython(code);
            console.log(`[chat] execute_python done stdout_len=${result.stdout.length} error=${result.error ?? "none"}`);
            send({ type: "tool_result", name: tc.name });
            toolResults.push({ id: tc.id, content: JSON.stringify(result) });
          }

          messages.push({ role: "tool_result", toolResults });
        }

        console.log(`[chat] done`);
        send({ type: "done" });
      } catch (err) {
        console.error(`[chat] CRASH:`, err);
        send({ type: "error", message: String(err) });
      } finally {
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

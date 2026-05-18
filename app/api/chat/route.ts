import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MCP_TOOLS, SYSTEM_PROMPT } from "@/lib/mcp-tools";
import { checkRateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_TOOL_ROUNDS = 12;
const MAX_PARALLEL_TOOLS = 3;

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
  console.log(`[chat] ip=${ip} remaining=${remaining}`);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const messages: Anthropic.MessageParam[] = [
          ...(history ?? []),
          { role: "user", content: question },
        ];

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          console.log(`[chat] round ${round} — calling Anthropic`);
          const response = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            tools: MCP_TOOLS,
            messages,
          });
          console.log(`[chat] round ${round} — stop_reason=${response.stop_reason} blocks=${response.content.length}`);

          // Stream text blocks as they arrive
          for (const block of response.content) {
            if (block.type === "text" && block.text) {
              const prefix = round > 0 ? "\n\n" : "";
              send({ type: "text", text: prefix + block.text });
            }
            if (block.type === "tool_use") {
              send({ type: "tool_call", name: block.name });
            }
          }

          // If no tool calls, we're done
          if (response.stop_reason !== "tool_use") break;

          // Execute tool calls
          const toolUseBlocks = response.content.filter(
            (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
          );
          console.log(`[chat] round ${round} — executing ${toolUseBlocks.length} tools: ${toolUseBlocks.map(b => b.name).join(", ")}`);

          const toolResults: Anthropic.ToolResultBlockParam[] = [];
          for (let i = 0; i < toolUseBlocks.length; i += MAX_PARALLEL_TOOLS) {
            const batch = toolUseBlocks.slice(i, i + MAX_PARALLEL_TOOLS);
            const batchResults = await Promise.all(
              batch.map(async (block) => {
                console.log(`[chat] tool start: ${block.name}`, block.input);
                const toolRes = await fetch(
                  new URL("/api/tool", req.url).toString(),
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: block.name, input: block.input }),
                  }
                );
                console.log(`[chat] tool done: ${block.name} status=${toolRes.status}`);
                const content = await toolRes.text();
                send({ type: "tool_result", name: block.name });
                return {
                  type: "tool_result" as const,
                  tool_use_id: block.id,
                  content,
                };
              })
            );
            toolResults.push(...batchResults);
          }

          messages.push({ role: "assistant", content: response.content });
          messages.push({ role: "user", content: toolResults });
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

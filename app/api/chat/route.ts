import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { MCP_TOOLS, SYSTEM_PROMPT } from "@/lib/mcp-tools";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_TOOL_ROUNDS = 8;

export async function POST(req: NextRequest) {
  const { question } = await req.json();

  if (!question?.trim()) {
    return new Response("Question vide", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const messages: Anthropic.MessageParam[] = [
          { role: "user", content: question },
        ];

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          const response = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            tools: MCP_TOOLS,
            messages,
          });

          // Stream text blocks as they arrive
          for (const block of response.content) {
            if (block.type === "text" && block.text) {
              send({ type: "text", text: block.text });
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

          const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
            toolUseBlocks.map(async (block) => {
              const toolRes = await fetch(
                new URL("/api/tool", req.url).toString(),
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: block.name, input: block.input }),
                }
              );
              const content = await toolRes.text();
              send({ type: "tool_result", name: block.name });
              return {
                type: "tool_result" as const,
                tool_use_id: block.id,
                content,
              };
            })
          );

          messages.push({ role: "assistant", content: response.content });
          messages.push({ role: "user", content: toolResults });
        }

        send({ type: "done" });
      } catch (err) {
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

import Anthropic from "@anthropic-ai/sdk";
import type { LLMProvider, NeutralMessage, LLMResponse } from "@/lib/llm-provider";
import type { NeutralTool } from "@/lib/tools";

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;
  private model: string;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    this.model = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001";
  }

  async chat(messages: NeutralMessage[], tools: NeutralTool[], system: string): Promise<LLMResponse> {
    const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => {
      if (m.role === "tool_result") {
        return {
          role: "user" as const,
          content: m.toolResults!.map((r) => ({
            type: "tool_result" as const,
            tool_use_id: r.id,
            content: r.content,
          })),
        };
      }
      if (m.role === "assistant" && m.toolCalls) {
        return {
          role: "assistant" as const,
          content: [
            ...(m.text ? [{ type: "text" as const, text: m.text }] : []),
            ...m.toolCalls.map((tc) => ({
              type: "tool_use" as const,
              id: tc.id,
              name: tc.name,
              input: tc.input,
            })),
          ],
        };
      }
      return { role: m.role as "user" | "assistant", content: m.text ?? "" };
    });

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system,
      tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.input_schema,
      })),
      messages: anthropicMessages,
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    const toolUseBlocks = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");

    return {
      text: textBlock?.text ?? null,
      toolCalls: toolUseBlocks.map((b) => ({
        id: b.id,
        name: b.name,
        input: b.input as Record<string, unknown>,
      })),
      stopReason: response.stop_reason === "tool_use" ? "tool_use" : "end_turn",
    };
  }
}

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

export class DeepSeekProvider implements LLMProvider {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY ?? "";
    this.model = process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash";
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

    const body = {
      model: this.model,
      max_tokens: 4096,
      messages: expanded,
      tools: tools.map((t) => ({
        type: "function" as const,
        function: {
          name: t.name,
          description: t.description,
          parameters: t.input_schema,
        },
      })),
      tool_choice: "auto",
    };

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
    const choice = data.choices[0];
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

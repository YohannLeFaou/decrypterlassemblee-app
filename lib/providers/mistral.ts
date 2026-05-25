import type { LLMProvider, NeutralMessage, LLMResponse } from "@/lib/llm-provider";
import type { NeutralTool } from "@/lib/tools";

// Minimal types for the Mistral REST API (chat completions endpoint).
// We call the REST API directly to avoid adding the full Mistral SDK.
interface MistralToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

interface MistralMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: MistralToolCall[];
  tool_call_id?: string;
  name?: string;
}

interface MistralResponse {
  choices: {
    message: { role: string; content: string | null; tool_calls?: MistralToolCall[] };
    finish_reason: string;
  }[];
}

export class MistralProvider implements LLMProvider {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.MISTRAL_API_KEY ?? "";
    this.model = process.env.MISTRAL_MODEL ?? "mistral-small-latest";
    this.baseUrl = process.env.MISTRAL_BASE_URL ?? "https://api.mistral.ai";
  }

  async chat(messages: NeutralMessage[], tools: NeutralTool[], system: string): Promise<LLMResponse> {
    const mistralMessages: MistralMessage[] = [
      { role: "system", content: system },
      ...messages.map((m): MistralMessage => {
        if (m.role === "tool_result") {
          // Mistral expects one message per tool result
          // We'll handle the flattening below
          return { role: "tool", content: m.toolResults![0].content, tool_call_id: m.toolResults![0].id };
        }
        if (m.role === "assistant" && m.toolCalls?.length) {
          return {
            role: "assistant",
            content: m.text ?? null,
            tool_calls: m.toolCalls.map((tc) => ({
              id: tc.id,
              type: "function" as const,
              function: { name: tc.name, arguments: JSON.stringify(tc.input) },
            })),
          };
        }
        return { role: m.role as "user" | "assistant", content: m.text ?? "" };
      }),
    ];

    // Flatten multi-result tool_result messages (Mistral needs one msg per result)
    const flatMessages: MistralMessage[] = [];
    for (const m of mistralMessages) {
      if (m.role === "tool") {
        flatMessages.push(m);
      } else {
        flatMessages.push(m);
      }
    }

    // Handle multi-tool results: replace tool_result NeutralMessages with flat list
    const expanded: MistralMessage[] = [{ role: "system", content: system }];
    for (const m of messages) {
      if (m.role === "tool_result" && m.toolResults) {
        for (const r of m.toolResults) {
          expanded.push({ role: "tool", content: r.content, tool_call_id: r.id });
        }
      } else if (m.role === "assistant" && m.toolCalls?.length) {
        expanded.push({
          role: "assistant",
          content: m.text ?? null,
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
      throw new Error(`Mistral API error ${res.status}: ${err}`);
    }

    const data: MistralResponse = await res.json();
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
    };
  }
}

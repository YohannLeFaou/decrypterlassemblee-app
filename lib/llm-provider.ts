import type { NeutralTool } from "@/lib/tools";

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResult {
  id: string;   // matches ToolCall.id
  content: string;
}

/** A single turn in the conversation, in a provider-neutral format. */
export type NeutralMessage =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string | null; toolCalls?: ToolCall[]; reasoning_content?: string }
  | { role: "tool_result"; toolResults: ToolResult[] };

export interface LLMResponse {
  text: string | null;
  toolCalls: ToolCall[];
  stopReason: "tool_use" | "end_turn";
  reasoning_content?: string;
}

export interface LLMProvider {
  chat(messages: NeutralMessage[], tools: NeutralTool[], system: string): Promise<LLMResponse>;
}

/**
 * Returns the active LLM provider based on the LLM_PROVIDER env variable.
 *
 * Supported values: "anthropic" (default), "mistral".
 * Adding a new provider: implement LLMProvider, import it here, add a case.
 */
export function getProvider(): LLMProvider {
  const name = (process.env.LLM_PROVIDER ?? "anthropic").toLowerCase();

  switch (name) {
    case "anthropic": {
      const { AnthropicProvider } = require("@/lib/providers/anthropic");
      return new AnthropicProvider();
    }
    case "mistral": {
      const { MistralProvider } = require("@/lib/providers/mistral");
      return new MistralProvider();
    }
    case "deepseek": {
      const { DeepSeekProvider } = require("@/lib/providers/deepseek");
      return new DeepSeekProvider();
    }
    default:
      throw new Error(
        `Unknown LLM_PROVIDER="${name}". Supported values: "anthropic", "mistral".`
      );
  }
}

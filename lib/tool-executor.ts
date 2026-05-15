// Executes MCP tool calls by importing the Python logic via a local HTTP bridge.
// In dev: the Python MCP server is called directly via subprocess through /api/tool.
// Each tool call is dispatched here and returns a JSON string result.

export async function executeTool(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  const res = await fetch("http://localhost:3000/api/tool", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, input }),
  });
  if (!res.ok) {
    return JSON.stringify({ error: `Tool execution failed: ${res.status}` });
  }
  return res.text();
}

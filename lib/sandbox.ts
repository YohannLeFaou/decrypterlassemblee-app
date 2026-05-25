const SANDBOX_URL = process.env.SANDBOX_URL ?? "http://sandbox:5000";

export interface SandboxResult {
  stdout: string;
  stderr: string;
  error: string | null;
}

export async function executePython(code: string): Promise<SandboxResult> {
  const res = await fetch(`${SANDBOX_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, timeout: 30 }),
    signal: AbortSignal.timeout(35_000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sandbox error ${res.status}: ${text}`);
  }

  return res.json();
}

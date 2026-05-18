import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

const MCP_DIR = path.resolve(process.env.MCP_DIR || "../nos-deputes-mcp");
const UV_BIN = process.env.UV_BIN || "uv";

// Python script that calls a single MCP tool and prints the JSON result
const PYTHON_SCRIPT = `
import asyncio, json, sys
sys.path.insert(0, "src")
from nos_deputes_mcp.server import (
    search_depute, get_depute, get_votes_depute, get_synthese_depute,
    get_scrutin, list_groupes, get_membres_groupe, search_interventions, suggest_slug,
)

TOOLS = {
    "search_depute": search_depute,
    "get_depute": get_depute,
    "get_votes_depute": get_votes_depute,
    "get_synthese_depute": get_synthese_depute,
    "get_scrutin": get_scrutin,
    "list_groupes": list_groupes,
    "get_membres_groupe": get_membres_groupe,
    "search_interventions": search_interventions,
    "suggest_slug": suggest_slug,
}

name = sys.argv[1]
input_data = json.loads(sys.argv[2])
fn = TOOLS[name]
result = asyncio.run(fn(**input_data))
print(result)
`;

export async function POST(req: NextRequest) {
  const { name, input } = await req.json();

  try {
    const { stdout, stderr } = await execFileAsync(
      UV_BIN,
      ["run", "python", "-c", PYTHON_SCRIPT, name, JSON.stringify(input)],
      { cwd: MCP_DIR, timeout: 45000 }
    );

    if (stderr) {
      console.error(`[tool/${name}] stderr:`, stderr);
    }

    return new NextResponse(stdout.trim(), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`[tool/${name}] error:`, err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

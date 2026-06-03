"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ToolCall = { name: string; done: boolean };

type Message = {
  role: "user" | "assistant";
  text: string;
  toolCalls?: ToolCall[];
};

const SUGGESTED_QUESTIONS = [
  "Comment peux-tu m'aider ?",
  "Quels groupes siègent à l'Assemblée nationale ?",
  "Qui a le plus voté pour en 2023 ?",
];

// Haiku sometimes emits a Markdown table as a single line — split it back into rows.
function normalizeMarkdown(text: string): string {
  return text.replace(/(\|[^\n]+\|)(\s*\|[-| :]+\|)(\s*(?:\|[^\n]+\|)+)/g, (match) => {
    // Detect inline table: pipe-separated segments without newlines between rows
    const rowPattern = /\|[^\n|](?:[^|\n]*\|)+/g;
    const rows = match.match(rowPattern);
    if (!rows || rows.length < 2) return match;
    return rows.join("\n");
  });
}

const TOOL_LABELS: Record<string, string> = {
  execute_python: "Interrogation de la base",
};

const SESSION_KEY = "chat_messages";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  async function sendQuestion() {
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setLoading(true);

    const userMessage: Message = { role: "user", text: question };
    const assistantMessage: Message = { role: "assistant", text: "", toolCalls: [] };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const history = messages
        .filter((m) => m.text)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
        signal: abort.signal,
      });

      if (res.status === 429) {
        const { error } = await res.json();
        setMessages((prev) => {
          const msgs = [...prev];
          msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], text: error };
          return msgs;
        });
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = JSON.parse(line.slice(6));

          setMessages((prev) => {
            const msgs = [...prev];
            const last = { ...msgs[msgs.length - 1] };

            if (data.type === "text") {
              last.text += data.text;
            } else if (data.type === "tool_call") {
              last.toolCalls = [...(last.toolCalls ?? []), { name: data.name, done: false }];
            } else if (data.type === "tool_result") {
              const tools = [...(last.toolCalls ?? [])];
              const idx = tools.findLastIndex((t) => t.name === data.name && !t.done);
              if (idx !== -1) tools[idx] = { ...tools[idx], done: true };
              last.toolCalls = tools;
            } else if (data.type === "error") {
              last.text = last.text || "Une erreur est survenue lors de la récupération des données. Réessayez.";
            }

            msgs[msgs.length - 1] = last;
            return msgs;
          });
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => {
          const msgs = [...prev];
          msgs[msgs.length - 1] = {
            ...msgs[msgs.length - 1],
            text: "Une erreur est survenue. Réessayez.",
          };
          return msgs;
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Historique */}
      {messages.length > 0 && (
        <div className="mb-6 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div
                    className="px-4 py-3 rounded-sm max-w-lg text-sm"
                    style={{ background: "#4a4a4a", color: "#f5f0e8", fontFamily: "Arial, sans-serif" }}
                  >
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div>
                  {/* Indicateur de réflexion */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && i === messages.length - 1 && loading && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="animate-pulse inline-block text-sm" style={{ color: "#aaa" }}>●</span>
                      <span className="text-xs" style={{ color: "#999", fontFamily: "Arial, sans-serif" }}>
                        {(() => {
                          const active = [...msg.toolCalls].reverse().find((t) => !t.done);
                          const last = [...msg.toolCalls].reverse().find((t) => t.done);
                          const current = active ?? last;
                          return current ? (TOOL_LABELS[current.name] ?? current.name) + "..." : "Réflexion en cours...";
                        })()}
                      </span>
                    </div>
                  )}
                  {/* Réponse */}
                  {msg.text && (
                    <div
                      className="text-sm leading-relaxed prose prose-sm max-w-none"
                      style={{ color: "#4a4a4a", fontFamily: "Georgia, serif" }}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#8b1a1a", textDecoration: "underline" }}>
                              {children}
                            </a>
                          ),
                          strong: ({ children }) => (
                            <strong style={{ fontWeight: 700, color: "#4a4a4a" }}>{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em style={{ fontStyle: "italic" }}>{children}</em>
                          ),
                          table: ({ children }) => (
                            <div style={{ overflowX: "auto", width: "100%" }}>
                              <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.8em", fontFamily: "Arial, sans-serif", whiteSpace: "nowrap" }}>{children}</table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th style={{ borderBottom: "2px solid #d4c9b0", padding: "4px 8px", textAlign: "left", fontWeight: 700 }}>{children}</th>
                          ),
                          td: ({ children }) => (
                            <td style={{ borderBottom: "1px solid #e8e0d0", padding: "4px 8px" }}>{children}</td>
                          ),
                          p: ({ children }) => (
                            <p style={{ marginBottom: "0.5em" }}>{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul style={{ paddingLeft: "1.2em", marginBottom: "0.5em", listStyleType: "disc" }}>{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol style={{ paddingLeft: "1.2em", marginBottom: "0.5em", listStyleType: "decimal" }}>{children}</ol>
                          ),
                        }}
                      >
                        {normalizeMarkdown(msg.text)}
                      </ReactMarkdown>
                      {loading && i === messages.length - 1 && (
                        <span className="animate-pulse">▌</span>
                      )}
                    </div>
                  )}
                  {!msg.text && (!msg.toolCalls || msg.toolCalls.length === 0) && loading && i === messages.length - 1 && (
                    <span className="text-sm animate-pulse" style={{ color: "#888" }}>
                      Réflexion en cours...
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Questions suggérées */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="text-xs px-3 py-2 rounded-sm hover:opacity-80 transition-opacity"
              style={{
                border: "1px solid #e0dbd0",
                background: "#eeebe4",
                color: "#777",
                fontFamily: "Arial, sans-serif",
                cursor: "pointer",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendQuestion();
            }
          }}
          placeholder="Ex : Combien y a-t-il de groupes différents à l'Assemblée ?"
          disabled={loading}
          rows={1}
          className="flex-1 px-4 py-3 text-sm rounded-sm resize-none overflow-hidden"
          style={{
            border: "1px solid #d4c9b0",
            background: loading ? "#f5f0e8" : "#faf7f2",
            fontFamily: "Arial, sans-serif",
            outline: "none",
            opacity: loading ? 0.7 : 1,
            lineHeight: "1.5",
          }}
        />
        <button
          onClick={sendQuestion}
          disabled={loading || !input.trim()}
          className="px-5 py-3 text-sm font-bold rounded-sm"
          style={{
            background: "#4a4a4a",
            color: "#f5f0e8",
            fontFamily: "Arial, sans-serif",
            opacity: loading || !input.trim() ? 0.4 : 1,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "..." : "Envoyer"}
        </button>
      </div>
      <p className="text-xs mt-2" style={{ color: "#999", fontFamily: "Arial, sans-serif" }}>
        Limité à 10 questions par jour · Données : 16e et 17e législature
      </p>
    </div>
  );
}

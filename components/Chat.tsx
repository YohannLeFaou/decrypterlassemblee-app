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
      {/* Intro */}
      {messages.length === 0 && (
        <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: 20, lineHeight: 1.6 }}>
          Interrogez directement la base de données des scrutins. L&apos;IA écrit et exécute les requêtes pour vous, et formule une réponse compréhensible.
        </p>
      )}

      {/* Historique */}
      {messages.length > 0 && (
        <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ padding: "10px 16px", borderRadius: 2, maxWidth: 520, fontSize: "0.85rem", background: "#1a3a5c", color: "#fff" }}>
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div>
                  {/* Indicateur outil */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && i === messages.length - 1 && loading && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span className="animate-pulse" style={{ color: "#bbb", fontSize: "0.8rem" }}>●</span>
                      <span style={{ fontSize: "0.75rem", color: "#aaa" }}>
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
                      className="prose prose-sm max-w-none"
                      style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "#111" }}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#1a3a5c", textDecoration: "underline" }}>
                              {children}
                            </a>
                          ),
                          strong: ({ children }) => (
                            <strong style={{ fontWeight: 700, color: "#111" }}>{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em style={{ fontStyle: "italic" }}>{children}</em>
                          ),
                          table: ({ children }) => (
                            <div style={{ overflowX: "auto", width: "100%" }}>
                              <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.8em", whiteSpace: "nowrap" }}>{children}</table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th style={{ borderBottom: "2px solid #e0e0e0", padding: "4px 8px", textAlign: "left", fontWeight: 700 }}>{children}</th>
                          ),
                          td: ({ children }) => (
                            <td style={{ borderBottom: "1px solid #ebebeb", padding: "4px 8px" }}>{children}</td>
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
                    <span style={{ fontSize: "0.85rem", color: "#aaa" }} className="animate-pulse">
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              style={{
                fontSize: "0.73rem", padding: "7px 14px", borderRadius: 2,
                border: "1px solid #cdd4e0", background: "#fff", color: "#555",
                cursor: "pointer",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
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
          style={{
            flex: 1, padding: "14px 18px", fontSize: "0.85rem",
            border: "1.5px solid #cdd4e0", borderRadius: 2,
            background: loading ? "#f0f0f0" : "#fff",
            resize: "none", outline: "none", lineHeight: 1.5,
            color: "#111", opacity: loading ? 0.7 : 1,
          }}
        />
        <button
          onClick={sendQuestion}
          disabled={loading || !input.trim()}
          style={{
            padding: "14px 28px", fontSize: "0.82rem", fontWeight: 800,
            border: "none", borderRadius: 2, background: "#1a3a5c", color: "#fff",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            letterSpacing: "0.04em", textTransform: "uppercase",
            opacity: loading || !input.trim() ? 0.4 : 1,
          }}
        >
          {loading ? "..." : "Envoyer"}
        </button>
      </div>
      <p style={{ fontSize: "0.68rem", color: "#bbb", marginTop: 8 }}>
        Limité à 10 questions par jour · Données : 16e et 17e législature
      </p>
    </div>
  );
}

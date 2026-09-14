"use client";

import { useRef, useState } from "react";
import Chat, { type ChatHandle } from "@/components/Chat";

export default function ChatWithReset() {
  const chatRef = useRef<ChatHandle>(null);
  const [hasHistory, setHasHistory] = useState(false);

  return (
    <>
      <div className="chat-box" style={{ background: "#f7f8fc", border: "1px solid #dce3ef", borderTop: "3px solid #1a3a5c", padding: 36, borderRadius: 2 }}>
        <Chat ref={chatRef} onHistoryChange={setHasHistory} />
      </div>

      {hasHistory && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <button
            onClick={() => chatRef.current?.reset()}
            style={{
              fontSize: "0.78rem", fontWeight: 800, padding: "9px 18px", borderRadius: 2,
              border: "none", background: "#1a3a5c", color: "#fff",
              letterSpacing: "0.03em", cursor: "pointer",
            }}
          >
            Nouvelle conversation
          </button>
        </div>
      )}
    </>
  );
}

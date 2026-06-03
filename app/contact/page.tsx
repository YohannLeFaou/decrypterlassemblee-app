"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mrevgzwe", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#fafaf8" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 40px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.01em", color: "#111" }}>
              Décrypter l&apos;Assemblée
            </div>
            <div style={{ fontSize: "0.62rem", color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
              16e &amp; 17e législature · 2022–aujourd&apos;hui
            </div>
          </a>
          <a href="/" style={{ fontSize: "0.78rem", fontWeight: 600, textDecoration: "none", color: "#555", letterSpacing: "0.03em" }}>
            ← Retour à l&apos;accueil
          </a>
        </div>
      </header>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 40px", width: "100%" }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#1a3a5c", marginBottom: 16 }}>
            Contact
          </div>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.04em", color: "#111", marginBottom: 16, maxWidth: 640 }}>
            Nous contacter
          </h1>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#555", maxWidth: 540 }}>
            Une erreur à signaler, une suggestion, une question ? Écrivez-nous.
          </p>
        </div>

        <div style={{ maxWidth: 560 }}>
          {status === "success" ? (
            <div style={{ background: "#eaf3ea", border: "1px solid #b8d8b8", borderRadius: 2, padding: "24px 28px" }}>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#2a6a2a", marginBottom: 6 }}>Message envoyé ✓</div>
              <div style={{ fontSize: "0.85rem", color: "#3a7a3a", lineHeight: 1.6 }}>
                Merci pour votre message. Nous vous répondrons dans les meilleurs délais.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#444", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Votre nom"
                  style={{ width: "100%", padding: "12px 16px", fontSize: "0.9rem", border: "1.5px solid #dde2e8", borderRadius: 2, background: "#fff", outline: "none", color: "#111" }}
                  onFocus={(e) => e.target.style.borderColor = "#1a3a5c"}
                  onBlur={(e) => e.target.style.borderColor = "#dde2e8"}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#444", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="votre@email.fr"
                  style={{ width: "100%", padding: "12px 16px", fontSize: "0.9rem", border: "1.5px solid #dde2e8", borderRadius: 2, background: "#fff", outline: "none", color: "#111" }}
                  onFocus={(e) => e.target.style.borderColor = "#1a3a5c"}
                  onBlur={(e) => e.target.style.borderColor = "#dde2e8"}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#444", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  placeholder="Votre message..."
                  rows={6}
                  style={{ width: "100%", padding: "12px 16px", fontSize: "0.9rem", border: "1.5px solid #dde2e8", borderRadius: 2, background: "#fff", outline: "none", color: "#111", resize: "vertical", lineHeight: 1.6 }}
                  onFocus={(e) => e.target.style.borderColor = "#1a3a5c"}
                  onBlur={(e) => e.target.style.borderColor = "#dde2e8"}
                />
              </div>

              {status === "error" && (
                <div style={{ fontSize: "0.85rem", color: "#c1121f", background: "#fdf0f0", border: "1px solid #f0b8b8", borderRadius: 2, padding: "10px 14px" }}>
                  Une erreur est survenue. Veuillez réessayer.
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{ padding: "13px 28px", fontSize: "0.85rem", fontWeight: 800, border: "none", borderRadius: 2, background: "#1a3a5c", color: "#fff", cursor: status === "sending" ? "not-allowed" : "pointer", letterSpacing: "0.04em", textTransform: "uppercase", opacity: status === "sending" ? 0.6 : 1 }}
                >
                  {status === "sending" ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </form>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e0e0e0", padding: "24px 40px", color: "#bbb", fontSize: "0.72rem", marginTop: 64, display: "flex", justifyContent: "space-between", maxWidth: 1120, margin: "64px auto 0", width: "100%" }}>
        <span>Données : <a href="https://data.assemblee-nationale.fr" style={{ color: "#999" }}>Assemblée nationale open data</a> · Licence Ouverte v2.0</span>
        <span><a href="/faq" style={{ color: "#999" }}>FAQ</a> · <a href="/contact" style={{ color: "#999" }}>Contact</a></span>
      </footer>
    </div>
  );
}

import { investigations } from "@/lib/investigations";
import Chat from "@/components/Chat";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#fafaf8" }}>
      <Header variant="home" />

      {/* Bandeau données */}
      <div style={{ background: "#f7f7f7", borderBottom: "1px solid #e8e8e8", fontSize: "0.68rem", textAlign: "center", padding: "6px 16px", color: "#999", letterSpacing: "0.04em" }}>
        Données mises à jour quotidiennement · 16e et 17e législature · Assemblée nationale open data · Licence Ouverte v2.0
      </div>

      <main className="page-main">

        {/* Hero */}
        <section style={{ marginBottom: 80 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#1a3a5c", marginBottom: 16 }}>
            Analyse des votes · Assemblée nationale
          </div>
          <h1 className="hero-title">
            Vos députés votent.<br />
            <span style={{ color: "#1a3a5c" }}>Maintenant vous pouvez comprendre.</span>
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#555", maxWidth: 540 }}>
            Les scrutins publics de l&apos;Assemblée nationale, décryptés par l&apos;IA.
            Posez n&apos;importe quelle question sur les votes, les groupes, les absences, les clivages.
          </p>
          <div className="hero-ctas">
            <a
              href="#investigations"
              style={{ padding: "12px 24px", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", borderRadius: 2, background: "#1a3a5c", color: "#fff" }}
            >
              Explorer les investigations
            </a>
            <a
              href="#chat"
              style={{ padding: "12px 24px", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", borderRadius: 2, border: "1.5px solid #ccc", color: "#444" }}
            >
              Poser une question
            </a>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { num: "577", label: "Députés suivis" },
            { num: "2", label: "Législatures" },
            { num: "5 000+", label: "Scrutins indexés" },
            { num: "Quotidien", label: "Mise à jour" },
          ].map((s, i, arr) => (
            <div key={s.label} className="stats-cell" style={{ borderRight: i < arr.length - 1 ? "1px solid #e0e0e0" : "none" }}>
              <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "#1a3a5c", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Investigations */}
        <section id="investigations" style={{ marginBottom: 80 }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#bbb", marginBottom: 24 }}>
            Investigations réalisées par l&apos;IA
          </div>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #111" }}>
            {investigations.map((inv, i) => (
              <a
                key={inv.id}
                href={`/investigation/${inv.id}`}
                className="inv-row"
              >
                <div className="inv-num">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#1a3a5c", display: "block", marginBottom: 6 }}>
                    {inv.tag}
                  </span>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111", marginBottom: 6, letterSpacing: "-0.02em", lineHeight: 1.25 }}>
                    {inv.title}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.55 }}>{inv.summary}</p>
                </div>
                {inv.scrutins.length > 0 && (
                  <div className="inv-meta">
                    <strong style={{ display: "block", fontSize: "1.1rem", fontWeight: 800, color: "#bbb" }}>{inv.scrutins.length}</strong>
                    scrutins
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>

        {/* Chat */}
        <section id="chat">
          <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#bbb", marginBottom: 24 }}>
            Posez votre propre question
          </div>
          <div className="chat-box" style={{ background: "#f7f8fc", border: "1px solid #dce3ef", borderTop: "3px solid #1a3a5c", padding: 36, borderRadius: 2 }}>
            <Chat />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="page-footer">
        <span>Données : <a href="https://data.assemblee-nationale.fr" style={{ color: "#999" }}>Assemblée nationale open data</a> · Licence Ouverte v2.0</span>
        <span><a href="/faq" style={{ color: "#999" }}>FAQ</a> · <a href="/contact" style={{ color: "#999" }}>Contact</a> · <a href="/mentions-legales" style={{ color: "#999" }}>Mentions légales</a></span>
      </footer>
    </div>
  );
}

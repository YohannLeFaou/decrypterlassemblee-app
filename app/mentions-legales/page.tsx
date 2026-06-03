export default function MentionsLegalesPage() {
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
            Informations légales
          </div>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.04em", color: "#111", maxWidth: 640 }}>
            Mentions légales
          </h1>
        </div>

        <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 40, borderTop: "2px solid #111", paddingTop: 32 }}>

          <section>
            <h2 style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#bbb", marginBottom: 16 }}>
              Éditeur du site
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#444" }}>
              Yohann Le Faou<br />
              Contact : <a href="/contact" style={{ color: "#1a3a5c", textDecoration: "underline" }}>formulaire de contact</a>
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#bbb", marginBottom: 16 }}>
              Hébergement
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#444" }}>
              Hetzner Online GmbH<br />
              Industriestr. 25<br />
              91710 Gunzenhausen, Allemagne<br />
              <a href="https://www.hetzner.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1a3a5c", textDecoration: "underline" }}>
                www.hetzner.com
              </a>
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#bbb", marginBottom: 16 }}>
              Données et sources
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#444" }}>
              Les données utilisées proviennent de l&apos;{" "}
              <a href="https://data.assemblee-nationale.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#1a3a5c", textDecoration: "underline" }}>
                Assemblée nationale open data
              </a>
              , publiées sous Licence Ouverte v2.0.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#bbb", marginBottom: 16 }}>
              Propriété intellectuelle
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#444" }}>
              Le contenu éditorial du site (investigations, analyses, textes) est la propriété de Yohann Le Faou. Toute reproduction sans autorisation est interdite.
            </p>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e0e0e0", padding: "24px 40px", color: "#bbb", fontSize: "0.72rem", marginTop: 64, display: "flex", justifyContent: "space-between", maxWidth: 1120, margin: "64px auto 0", width: "100%" }}>
        <span>Données : <a href="https://data.assemblee-nationale.fr" style={{ color: "#999" }}>Assemblée nationale open data</a> · Licence Ouverte v2.0</span>
        <span>
          <a href="/faq" style={{ color: "#999" }}>FAQ</a> ·{" "}
          <a href="/contact" style={{ color: "#999" }}>Contact</a> ·{" "}
          <a href="/mentions-legales" style={{ color: "#999" }}>Mentions légales</a>
        </span>
      </footer>
    </div>
  );
}

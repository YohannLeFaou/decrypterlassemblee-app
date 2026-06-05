import Header from "@/components/Header";

export default function MentionsLegalesPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#fafaf8" }}>
      <Header variant="back" />

      <main className="page-main">

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#1a3a5c", marginBottom: 16 }}>
            Informations légales
          </div>
          <h1 className="page-h1" style={{ fontSize: "2.6rem", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.04em", color: "#111", maxWidth: 640 }}>
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

      <footer className="page-footer">
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

import { notFound } from "next/navigation";
import { getInvestigation, investigations } from "@/lib/investigations";

export function generateStaticParams() {
  return investigations.map((inv) => ({ id: inv.id }));
}

const sortLabel: Record<string, { label: string; color: string; bg: string }> = {
  "adopté": { label: "Adopté ✓", color: "#2a6a2a", bg: "#eaf3ea" },
  "rejeté": { label: "Rejeté ✗", color: "#c1121f", bg: "#fdf0f0" },
};

const positionColor: Record<string, string> = {
  "Pour": "#2a6a2a",
  "Contre": "#c1121f",
  "Divisé": "#888",
};

function getPositionColor(position: string): string {
  for (const [key, color] of Object.entries(positionColor)) {
    if (position.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return "#555";
}

const groupeNoms: Record<string, string> = {
  EPR: "Ensemble pour la République",
  RN: "Rassemblement National",
  "LFI-NFP": "La France insoumise - NFP",
  DR: "Droite Républicaine",
  SOC: "Socialistes et apparentés",
  DEM: "Les Démocrates (MoDem)",
  HOR: "Horizons & Indépendants",
  ECOS: "Écologiste et Social",
  GDR: "Gauche Démocrate et Républicaine",
  LIOT: "Libertés, Indépendants, Outre-mer et Territoires",
  UDDPLR: "Union des droites pour la République",
  UDR: "UDR",
  NI: "Non inscrits",
};

export default async function InvestigationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const investigation = getInvestigation(id);
  if (!investigation) notFound();

  const seenSigles = new Set<string>();
  function renderSigle(sigle: string): string {
    if (!seenSigles.has(sigle) && groupeNoms[sigle]) {
      seenSigles.add(sigle);
      return `${sigle} (${groupeNoms[sigle]})`;
    }
    return sigle;
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
            ← Toutes les investigations
          </a>
        </div>
      </header>

      {/* Bandeau données */}
      <div style={{ background: "#f7f7f7", borderBottom: "1px solid #e8e8e8", fontSize: "0.68rem", textAlign: "center", padding: "6px 16px", color: "#999", letterSpacing: "0.04em" }}>
        Données mises à jour quotidiennement · 16e et 17e législature · Assemblée nationale open data
      </div>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "64px 40px", width: "100%" }}>

        {/* En-tête investigation */}
        <div style={{ marginBottom: 64 }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#1a3a5c" }}>
            {investigation.tag}
          </span>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 900, marginTop: 10, marginBottom: 20, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#111", maxWidth: 760 }}>
            {investigation.title}
          </h1>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#555", maxWidth: 640 }}>
            {investigation.intro}
          </p>
        </div>

        {/* Scrutins */}
        {investigation.scrutins.length > 0 && (
          <section style={{ marginBottom: 64 }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#bbb", marginBottom: 24, borderTop: "2px solid #111", paddingTop: 20 }}>
              Les scrutins analysés
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {investigation.scrutins.map((scrutin) => {
                const sort = sortLabel[scrutin.sort];
                return (
                  <div
                    key={scrutin.numero}
                    style={{ background: "#fff", border: "1px solid #e0e0e0", borderLeft: "3px solid #1a3a5c", padding: 28, borderRadius: "0 2px 2px 0" }}
                  >
                    {/* Titre + badge */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#aaa", marginBottom: 4 }}>
                          Scrutin {scrutin.numero} · {new Date(scrutin.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                          {scrutin.titre}
                        </h3>
                      </div>
                      {sort && (
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "3px 10px", borderRadius: 2, whiteSpace: "nowrap", background: sort.bg, color: sort.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {sort.label}
                        </span>
                      )}
                    </div>

                    {/* Comptages */}
                    {scrutin.votes_total && (
                      <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                        <span style={{ fontSize: "0.82rem", color: "#2a6a2a" }}>
                          <strong>{scrutin.votes_pour}</strong> pour
                        </span>
                        <span style={{ fontSize: "0.82rem", color: "#c1121f" }}>
                          <strong>{scrutin.votes_contre}</strong> contre
                        </span>
                        <span style={{ fontSize: "0.82rem", color: "#888" }}>
                          {scrutin.votes_total} votants
                        </span>
                      </div>
                    )}

                    {/* Positions des groupes */}
                    {scrutin.groupes && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                        {scrutin.groupes.map((g) => (
                          <span
                            key={g.sigle}
                            style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: 2, background: "#f5f6f8", border: "1px solid #e0e0e0", color: getPositionColor(g.position) }}
                          >
                            <strong>{renderSigle(g.sigle)}</strong> · {g.position}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Analyse */}
                    {scrutin.analyse && (
                      <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "#555", marginBottom: 16 }}>
                        {scrutin.analyse}
                      </p>
                    )}

                    {/* Dissidences */}
                    {scrutin.dissidences && scrutin.dissidences.length > 0 && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #ebebeb" }}>
                        <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#aaa", marginBottom: 8 }}>
                          Dissidences notables
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {scrutin.dissidences.map((d, i) => (
                            <span key={i} style={{ fontSize: "0.78rem", color: "#666" }}>
                              <strong>{renderSigle(d.groupe)}</strong> · {d.depute}{d.note ? ` — ${d.note}` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lien AN */}
                    <a
                      href={scrutin.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.72rem", marginTop: 16, display: "inline-block", color: "#1a3a5c", textDecoration: "underline" }}
                    >
                      Voir sur Assemblée-nationale.fr →
                    </a>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Classement cohésion */}
        {investigation.classement && (
          <section style={{ marginBottom: 64 }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#bbb", marginBottom: 24, borderTop: "2px solid #111", paddingTop: 20 }}>
              Classement par taux de cohésion
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {investigation.classement.map((g, i) => (
                <div key={g.sigle} style={{ background: "#fff", border: "1px solid #e0e0e0", padding: "18px 24px", borderRadius: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 900, width: 20, textAlign: "right", color: "#ddd" }}>{i + 1}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111", minWidth: "3rem" }}>{g.sigle}</span>
                    <div style={{ flex: 1, height: 10, borderRadius: 2, background: "#f0f0f0" }}>
                      <div
                        style={{ width: `${g.taux}%`, height: 10, borderRadius: 2, background: g.taux >= 95 ? "#2a6a2a" : g.taux >= 90 ? "#b07d00" : "#c1121f" }}
                      />
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, width: 52, textAlign: "right", color: "#111" }}>{g.taux} %</span>
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ fontSize: "0.75rem", color: "#666" }}>
                      <strong>{g.nom}</strong> — {g.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Conclusion */}
        <section style={{ background: "#fff", border: "1px solid #e0e0e0", borderTop: "3px solid #1a3a5c", padding: 32, borderRadius: "0 0 2px 2px" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#bbb", marginBottom: 14 }}>
            Ce que cela révèle
          </div>
          <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#333" }}>
            {investigation.conclusion}
          </p>
        </section>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e0e0e0", padding: "24px 40px", color: "#bbb", fontSize: "0.72rem", marginTop: 64, display: "flex", justifyContent: "space-between", maxWidth: 1120, margin: "64px auto 0", width: "100%" }}>
        <span>Données : <a href="https://www.nosdeputes.fr" style={{ color: "#999" }}>NosDéputés.fr</a> · CC-BY-SA / ODbL · <a href="https://github.com/YohannLeFaou/nos-deputes-mcp" style={{ color: "#999" }}>MCP open-source</a></span>
      </footer>
    </div>
  );
}

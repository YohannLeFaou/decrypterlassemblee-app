import { notFound } from "next/navigation";
import { getInvestigation, investigations } from "@/lib/investigations";

export function generateStaticParams() {
  return investigations.map((inv) => ({ id: inv.id }));
}

const sortLabel: Record<string, { label: string; color: string }> = {
  "adopté": { label: "Adopté ✓", color: "#2d6a2d" },
  "rejeté": { label: "Rejeté ✗", color: "#8b1a1a" },
};

const positionColor: Record<string, string> = {
  "Pour": "#2d6a2d",
  "Contre": "#8b1a1a",
  "Divisé": "#888",
};

function getPositionColor(position: string): string {
  for (const [key, color] of Object.entries(positionColor)) {
    if (position.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return "#555";
}

export default async function InvestigationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const investigation = getInvestigation(id);
  if (!investigation) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header style={{ borderBottom: "2px solid #4a4a4a" }} className="bg-[#f5f0e8] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-baseline justify-between">
          <a href="/" style={{ textDecoration: "none" }}>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Georgia, serif", color: "#4a4a4a" }}>
              Décrypter l&apos;Assemblée
            </h1>
          </a>
          <a href="/" className="text-sm hover:underline" style={{ fontFamily: "Arial, sans-serif", color: "#666" }}>
            ← Toutes les investigations
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">

        {/* En-tête investigation */}
        <div className="mb-10">
          <span
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: "#8b1a1a", fontFamily: "Arial, sans-serif" }}
          >
            {investigation.tag}
          </span>
          <h2
            className="text-3xl font-bold mt-2 mb-4 leading-tight"
            style={{ fontFamily: "Georgia, serif", color: "#4a4a4a" }}
          >
            {investigation.title}
          </h2>
          <p
            className="text-base leading-relaxed max-w-2xl"
            style={{ color: "#555", fontFamily: "Georgia, serif" }}
          >
            {investigation.intro}
          </p>
        </div>

        {/* Scrutins */}
        {investigation.scrutins.length > 0 && (
          <section className="mb-12">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-6 pb-2"
              style={{ borderBottom: "1px solid #d4c9b0", color: "#888", fontFamily: "Arial, sans-serif" }}
            >
              Les scrutins analysés
            </h3>

            <div className="flex flex-col gap-8">
              {investigation.scrutins.map((scrutin) => (
                <div
                  key={scrutin.numero}
                  className="p-6 rounded-sm"
                  style={{ background: "#fff", border: "1px solid #d4c9b0" }}
                >
                  {/* Titre scrutin */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-xs" style={{ color: "#999", fontFamily: "Arial, sans-serif" }}>
                        Scrutin {scrutin.numero} · {new Date(scrutin.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <h4
                        className="text-lg font-bold mt-1 leading-snug"
                        style={{ fontFamily: "Georgia, serif", color: "#4a4a4a" }}
                      >
                        {scrutin.titre}
                      </h4>
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-sm whitespace-nowrap"
                      style={{
                        background: sortLabel[scrutin.sort]?.color + "18",
                        color: sortLabel[scrutin.sort]?.color,
                        border: `1px solid ${sortLabel[scrutin.sort]?.color}40`,
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      {sortLabel[scrutin.sort]?.label}
                    </span>
                  </div>

                  {/* Comptages */}
                  {scrutin.votes_total && (
                    <div className="flex gap-6 mb-4">
                      <span className="text-sm" style={{ color: "#2d6a2d", fontFamily: "Arial, sans-serif" }}>
                        <strong>{scrutin.votes_pour}</strong> pour
                      </span>
                      <span className="text-sm" style={{ color: "#8b1a1a", fontFamily: "Arial, sans-serif" }}>
                        <strong>{scrutin.votes_contre}</strong> contre
                      </span>
                      <span className="text-sm" style={{ color: "#888", fontFamily: "Arial, sans-serif" }}>
                        {scrutin.votes_total} votants
                      </span>
                    </div>
                  )}

                  {/* Positions des groupes */}
                  {scrutin.groupes && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scrutin.groupes.map((g) => (
                        <span
                          key={g.sigle}
                          className="text-xs px-2 py-1 rounded-sm"
                          style={{
                            background: "#f5f0e8",
                            border: "1px solid #d4c9b0",
                            fontFamily: "Arial, sans-serif",
                            color: getPositionColor(g.position),
                          }}
                        >
                          <strong>{g.sigle}</strong> · {g.position}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Analyse */}
                  {scrutin.analyse && (
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#555", fontFamily: "Georgia, serif" }}>
                      {scrutin.analyse}
                    </p>
                  )}

                  {/* Dissidences */}
                  {scrutin.dissidences && scrutin.dissidences.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e8e0d0" }}>
                      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#888", fontFamily: "Arial, sans-serif" }}>
                        Dissidences notables
                      </p>
                      <div className="flex flex-col gap-1">
                        {scrutin.dissidences.map((d, i) => (
                          <span key={i} className="text-xs" style={{ color: "#666", fontFamily: "Arial, sans-serif" }}>
                            <strong>{d.groupe}</strong> · {d.depute}{d.note ? ` — ${d.note}` : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lien NosDéputés */}
                  <a
                    href={scrutin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs mt-4 inline-block hover:underline"
                    style={{ color: "#999", fontFamily: "Arial, sans-serif" }}
                  >
                    Voir sur NosDéputés.fr →
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Classement cohésion */}
        {investigation.classement && (
          <section className="mb-12">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-6 pb-2"
              style={{ borderBottom: "1px solid #d4c9b0", color: "#888", fontFamily: "Arial, sans-serif" }}
            >
              Classement par taux de cohésion
            </h3>
            <div className="flex flex-col gap-3">
              {investigation.classement.map((g, i) => (
                <div
                  key={g.sigle}
                  className="p-4 rounded-sm"
                  style={{ background: "#fff", border: "1px solid #d4c9b0" }}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-bold w-5 text-right" style={{ color: "#bbb", fontFamily: "Arial, sans-serif" }}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#4a4a4a", fontFamily: "Arial, sans-serif", minWidth: "3rem" }}>
                      {g.sigle}
                    </span>
                    {/* Barre */}
                    <div className="flex-1 h-3 rounded-sm" style={{ background: "#f0ece3" }}>
                      <div
                        className="h-3 rounded-sm"
                        style={{ width: `${g.taux}%`, background: g.taux >= 95 ? "#2d6a2d" : g.taux >= 90 ? "#b07d00" : "#8b1a1a" }}
                      />
                    </div>
                    <span className="text-sm font-bold w-14 text-right" style={{ color: "#4a4a4a", fontFamily: "Arial, sans-serif" }}>
                      {g.taux} %
                    </span>
                  </div>
                  <div className="pl-9">
                    <span className="text-xs" style={{ color: "#666", fontFamily: "Arial, sans-serif" }}>
                      <strong>{g.nom}</strong> — {g.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Conclusion */}
        <section
          className="p-6 rounded-sm"
          style={{ background: "#fff", border: "1px solid #d4c9b0" }}
        >
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#888", fontFamily: "Arial, sans-serif" }}
          >
            Ce que cela révèle
          </h3>
          <p className="text-base leading-relaxed" style={{ color: "#333", fontFamily: "Georgia, serif" }}>
            {investigation.conclusion}
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="text-xs text-center py-6 px-4 mt-8"
        style={{ borderTop: "1px solid #d4c9b0", color: "#999", fontFamily: "Arial, sans-serif" }}
      >
        Données : <a href="https://www.nosdeputes.fr" className="underline">NosDéputés.fr</a> (Regards Citoyens) · CC-BY-SA / ODbL ·{" "}
        <a href="https://github.com/YohannLeFaou/nos-deputes-mcp" className="underline">MCP open-source</a>
      </footer>
    </div>
  );
}

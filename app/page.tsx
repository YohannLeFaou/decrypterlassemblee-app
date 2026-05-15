import { investigations } from "@/lib/investigations";
import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header style={{ borderBottom: "2px solid #4a4a4a" }} className="bg-[#f5f0e8] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3" style={{ fontFamily: "Georgia, serif" }}>
              <span>🏛️</span>
              Décrypter l&apos;Assemblée
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#666", fontFamily: "Arial, sans-serif" }}>
              16e législature · juin 2022 – juin 2024
            </p>
          </div>
          <nav className="flex gap-4 text-sm" style={{ fontFamily: "Arial, sans-serif" }}>
            <a
              href="#investigations"
              className="px-4 py-2 rounded-sm font-bold hover:opacity-80 transition-opacity"
              style={{ background: "#4a4a4a", color: "#f5f0e8" }}
            >
              Investigations
            </a>
            <a
              href="#chat"
              className="px-4 py-2 rounded-sm font-bold hover:opacity-80 transition-opacity"
              style={{ background: "#4a4a4a", color: "#f5f0e8" }}
            >
              Poser une question
            </a>
          </nav>
        </div>
      </header>

      {/* Bandeau avertissement */}
      <div
        className="text-center text-xs py-2 px-4"
        style={{ background: "#4a4a4a", color: "#e0d8c8", fontFamily: "Arial, sans-serif" }}
      >
        ⚠️ Données limitées à la 16e législature (juin 2022 – juin 2024). La 17e législature n&apos;est pas encore indexée.
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">

        {/* Intro */}
        <section className="mb-12">
          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "#555", fontFamily: "Georgia, serif" }}>
            Les votes de l&apos;Assemblée nationale sont publics, mais illisibles. Ce site permet d&apos;explorer,
            grâce à l&apos;IA, l&apos;activité de nos députés dans l&apos;hémicycle.
          </p>
        </section>

        {/* Investigations */}
        <section id="investigations" className="mb-16">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-6 pb-2"
            style={{ borderBottom: "1px solid #d4c9b0", color: "#888", fontFamily: "Arial, sans-serif" }}
          >
            Exemples d&apos;investigations réalisées par l&apos;IA
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {investigations.map((inv) => (
              <a
                key={inv.id}
                href={`/investigation/${inv.id}`}
                className="block p-6 rounded-sm hover:shadow-md transition-shadow"
                style={{ background: "#fff", border: "1px solid #d4c9b0", textDecoration: "none" }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: "#8b1a1a", fontFamily: "Arial, sans-serif" }}
                >
                  {inv.tag}
                </span>
                <h3
                  className="text-lg font-bold mt-2 mb-3 leading-snug"
                  style={{ color: "#4a4a4a", fontFamily: "Georgia, serif" }}
                >
                  {inv.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#666", fontFamily: "Arial, sans-serif" }}>
                  {inv.summary}
                </p>
                {inv.scrutins.length > 0 && (
                  <p className="text-xs mt-4" style={{ color: "#999", fontFamily: "Arial, sans-serif" }}>
                    {inv.scrutins.length} scrutins analysés
                  </p>
                )}
              </a>
            ))}
          </div>
        </section>

        {/* Chat live */}
        <section id="chat">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-6 pb-2"
            style={{ borderBottom: "1px solid #d4c9b0", color: "#888", fontFamily: "Arial, sans-serif" }}
          >
            Que voulez-vous savoir à propos de vos députés ?
          </h2>

          <div className="p-8 rounded-sm" style={{ background: "#fff", border: "1px solid #d4c9b0" }}>
            <Chat />
          </div>
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

"use client";

import { useState } from "react";

const FAQ: { question: string; answer: React.ReactNode }[] = [
  {
    question: "Quelles sont les données utilisées pour répondre aux questions ?",
    answer: (
      <>
        Les données officielles de l&apos;Assemblée nationale : scrutins de vote, résultats par député et par groupe politique, informations sur les groupes parlementaires. Ces données sont publiées en open data par l&apos;Assemblée nationale et accessibles sur{" "}
        <a href="https://data.assemblee-nationale.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#1a3a5c", textDecoration: "underline" }}>
          data.assemblee-nationale.fr
        </a>
        .
      </>
    ),
  },
  {
    question: "Les données sont-elles mises à jour régulièrement ?",
    answer:
      "Oui, les données sont mises à jour quotidiennement. Les nouveaux scrutins sont ingérés au plus tard 24h après leur publication sur le site de l'Assemblée nationale.",
  },
  {
    question: "Quel est l'historique disponible ?",
    answer:
      "Les données disponibles démarrent à la 16e législature (juin 2022) et couvrent jusqu'à aujourd'hui, incluant la 17e législature débutée en octobre 2024.",
  },
  {
    question: "Comment fonctionne Décrypter l'Assemblée ?",
    answer:
      "Un agent IA connecté aux données de l'Assemblée nationale est utilisé pour répondre aux questions des utilisateurs. Lorsque vous posez une question, l'agent interroge automatiquement la base de données des scrutins et formule une réponse en langage naturel.",
  },
  {
    question: "Les réponses sont-elles fiables ?",
    answer:
      "Les réponses sont basées sur des données officielles de l'Assemblée nationale. Cependant, comme tout système d'IA, des erreurs d'interprétation restent possibles. Pour tout usage important, nous vous recommandons de vérifier les informations directement sur le site de l'Assemblée nationale.",
  },
  {
    question: "Pourquoi certaines questions restent-elles sans réponse ?",
    answer:
      "L'IA peut ne pas répondre à certaines questions pour plusieurs raisons : la question porte sur une période non couverte par les données (avant juin 2022), les données nécessaires ne sont pas disponibles, ou la question est trop vague pour être traitée. Dans ce cas, essayez de reformuler ou de préciser votre question.",
  },
  {
    question: "Les données des utilisateurs sont-elles stockées ?",
    answer:
      "Non. Aucune donnée utilisateur n'est enregistrée par le site. L'historique de conversation existe uniquement le temps de votre session dans votre navigateur. Les questions posées sont transmises à l'API DeepSeek pour générer les réponses — voir la question ci-dessous.",
  },
  {
    question: "Les données sont-elles transmises à des services tiers ?",
    answer:
      "Oui. Les questions que vous posez sont transmises à l'API de DeepSeek pour générer les réponses. Seul le texte de votre question est envoyé — aucune donnée personnelle n'est associée. DeepSeek n'utilise pas les données de l'API pour réentraîner ses modèles.",
  },
  {
    question: "Quelle est l'IA utilisée pour répondre aux questions ?",
    answer:
      "L'IA de DeepSeek est utilisée car elle offre, parmi les différentes IA testées, le meilleur compromis entre le coût et la pertinence des réponses.",
  },
  {
    question: "Le site est-il gratuit ?",
    answer:
      "Oui, le site est entièrement gratuit et sans publicité. Il est développé et maintenu bénévolement.",
  },
  {
    question: "Qui développe Décrypter l'Assemblée ?",
    answer: (
      <>
        Le site est développé et maintenu par{" "}
        <a href="https://www.linkedin.com/in/yohann-le-faou-5a1a0b108/" target="_blank" rel="noopener noreferrer" style={{ color: "#1a3a5c", textDecoration: "underline" }}>
          Yohann Le Faou
        </a>
        .
      </>
    ),
  },
];

function FaqItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid #ebebeb" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left", padding: "20px 0",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ fontSize: "1rem", fontWeight: 700, color: "#111", lineHeight: 1.35 }}>
          {question}
        </span>
        <span style={{ fontSize: "1.2rem", color: "#1a3a5c", flexShrink: 0, fontWeight: 300, lineHeight: 1 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: 20, fontSize: "0.9rem", lineHeight: 1.7, color: "#555", maxWidth: 720 }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
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

        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#1a3a5c", marginBottom: 16 }}>
            Foire aux questions
          </div>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.04em", color: "#111", maxWidth: 640 }}>
            Questions fréquentes
          </h1>
        </div>

        <div style={{ borderTop: "2px solid #111" }}>
          {FAQ.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e0e0e0", padding: "24px 40px", color: "#bbb", fontSize: "0.72rem", marginTop: 64, display: "flex", justifyContent: "space-between", maxWidth: 1120, margin: "64px auto 0", width: "100%" }}>
        <span>Données : <a href="https://data.assemblee-nationale.fr" style={{ color: "#999" }}>Assemblée nationale open data</a> · Licence Ouverte v2.0</span>
        <span><a href="/faq" style={{ color: "#999" }}>FAQ</a> · <a href="/contact" style={{ color: "#999" }}>Contact</a> · <a href="/mentions-legales" style={{ color: "#999" }}>Mentions légales</a></span>
      </footer>
    </div>
  );
}

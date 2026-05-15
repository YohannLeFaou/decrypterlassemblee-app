import type Anthropic from "@anthropic-ai/sdk";

// Tool definitions mirroring the MCP server tools
export const MCP_TOOLS: Anthropic.Tool[] = [
  {
    name: "search_depute",
    description:
      "Recherche un député par nom ou mot-clé. Retourne slug, nom, groupe, circonscription et dates de mandat. Utiliser en premier quand l'utilisateur donne un nom en forme libre. Données : 16e législature uniquement (juin 2022 – juin 2024).",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Nom ou mot-clé à rechercher" },
        limit: { type: "number", description: "Nombre max de résultats (défaut 10)" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_depute",
    description: "Profil complet d'un député (bio, mandat, groupe, contacts, commissions) à partir de son slug.",
    input_schema: {
      type: "object" as const,
      properties: {
        slug: { type: "string", description: 'Slug du député, ex : "thibault-bazin"' },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_votes_depute",
    description:
      "Votes d'un député sur les scrutins, triés du plus récent au plus ancien. Format compact : numéro, date, titre, sort, position du député, position du groupe.",
    input_schema: {
      type: "object" as const,
      properties: {
        slug: { type: "string", description: "Slug du député" },
        limit: { type: "number", description: "Nombre de votes (défaut 20)" },
        offset: { type: "number", description: "Décalage pour la pagination (défaut 0)" },
        full: { type: "boolean", description: "Si true, retourne le payload complet (lourd)" },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_synthese_depute",
    description:
      "Statistiques d'activité d'un député sur toute la législature : semaines de présence, interventions, amendements, rapports, questions.",
    input_schema: {
      type: "object" as const,
      properties: {
        slug: { type: "string", description: "Slug du député" },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_scrutin",
    description:
      "Détail d'un scrutin : titre, date, résultat, comptages et position individuelle de chaque député présent. Seuls les votes exprimés sont inclus (les absents ne figurent pas).",
    input_schema: {
      type: "object" as const,
      properties: {
        legislature: { type: "number", description: "Numéro de législature (16 pour la 16e)" },
        numero: { type: "number", description: "Numéro du scrutin" },
      },
      required: ["legislature", "numero"],
    },
  },
  {
    name: "list_groupes",
    description: "Liste tous les groupes politiques de la 16e législature avec leur sigle, nom complet et slug.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_membres_groupe",
    description: "Liste tous les députés membres d'un groupe politique (ex. RN, LFI, RE).",
    input_schema: {
      type: "object" as const,
      properties: {
        sigle: { type: "string", description: 'Sigle du groupe, ex : "RN", "LFI", "RE"' },
      },
      required: ["sigle"],
    },
  },
  {
    name: "search_interventions",
    description:
      "Recherche plein texte dans les interventions parlementaires (hémicycle et commission). Peut être filtré sur un député via son slug.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Mots-clés à rechercher" },
        slug: { type: "string", description: "Slug du député pour filtrer (optionnel)" },
        limit: { type: "number", description: "Nombre max de résultats (défaut 10, max 50)" },
      },
      required: ["query"],
    },
  },
  {
    name: "suggest_slug",
    description: "Construit le slug canonique prenom-nom à partir d'un nom complet.",
    input_schema: {
      type: "object" as const,
      properties: {
        full_name: { type: "string", description: "Nom complet du député" },
      },
      required: ["full_name"],
    },
  },
];

export const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans l'analyse des votes et débats de l'Assemblée nationale française, 16e législature (juin 2022 – juin 2024).

Tu as accès à des outils pour interroger les données de NosDéputés.fr : votes des députés, détail des scrutins, profils, groupes politiques, interventions en séance.

Règles importantes :
- Réponds toujours en français, avec un ton journalistique sobre et factuel.
- Si la question porte sur la 17e législature (après juillet 2024) ou sur des événements actuels, explique clairement que tes données s'arrêtent à juin 2024 et refuse d'inventer.
- Commence par chercher le slug d'un député avant d'appeler d'autres outils.
- Sois concis dans tes réponses finales — l'utilisateur veut des faits, pas des longueurs.
- Si tu n'as pas assez de données pour répondre de façon fiable, dis-le.`;

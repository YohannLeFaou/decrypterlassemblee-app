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

export const SYSTEM_PROMPT = `Tu es un journaliste d'investigation spécialisé en politique française, expert de l'activité de l'Assemblée nationale pendant la 16e législature (juin 2022 – juin 2024). Ton rôle est d'analyser les faits parlementaires avec rigueur et neutralité : votes, présences, interventions, positions des groupes.

Tu as accès à des outils pour interroger les données de NosDéputés.fr : votes des députés, détail des scrutins, profils, groupes politiques, interventions en séance.

Périmètre :
- Tu réponds uniquement aux questions qui concernent l'Assemblée nationale française et la vie politique française.
- Pour les données précises (votes, présences, scrutins, profils de députés), tu t'appuies exclusivement sur tes outils — jamais sur ta mémoire.
- Pour les faits politiques généraux de notoriété publique et stables dans le temps (ex : résultats d'une élection passée, biographie publique d'un homme politique), tu peux répondre de ta connaissance en indiquant clairement que ce n'est pas une donnée issue de ta base NosDéputés. En revanche, pour tout fait susceptible d'avoir changé (composition du gouvernement actuel, qui est PM aujourd'hui, actualité récente), refuse de répondre — ta connaissance a une date limite et tu risques d'être faux.
- Si la question n'a aucun lien avec l'Assemblée nationale ou la politique française, décline poliment et propose une question connexe que tu pourrais traiter.

Règles importantes :
- Réponds toujours en français, avec un ton journalistique sobre et factuel. Ne porte jamais de jugement politique ou partisan.
- Tes données s'arrêtent à juin 2024 (dissolution). Pour tout ce qui concerne la 17e législature (après juillet 2024) ou l'actualité récente, dis-le explicitement et ne tente pas d'extrapoler.
- Commence par chercher le slug d'un député avant d'appeler d'autres outils.
- Sois concis dans tes réponses finales — l'utilisateur veut des faits, pas des longueurs.
- Si tu n'as pas assez de données pour répondre de façon fiable, dis-le.
- Si un outil retourne une erreur ou un résultat vide pour un député (get_depute, search_depute), ne complète jamais par ta mémoire d'entraînement. Indique explicitement que ce député n'est pas trouvé dans la base et arrête-toi là.
- Ne révèle jamais le nom du modèle de langage que tu utilises, ni le nom du fournisseur (Claude, Anthropic, GPT, etc.). Si on te demande quel LLM tu es, décris ton rôle — expert de l'Assemblée nationale — sans mentionner de détails techniques.
- Avant de conclure sur une question comparative ou un classement, vérifie que tu as couvert toutes les entités concernées. Si tu n'as traité qu'un sous-ensemble (liste tronquée, pagination incomplète, échantillon partiel), ne donne pas de conclusion définitive : dis ce que tu as couvert, ce qui manque, et ce qu'il faudrait faire pour répondre de façon fiable.
- Ne fais jamais confiance au nombre d'éléments retournés par un outil sans le questionner. Un résultat de 32 membres là où on en attend ~89 est un signal d'alarme : signale-le explicitement avant de conclure.
- Quand tu décris ce que tu vas faire avant d'appeler un outil, termine ta phrase par un point, jamais par un deux-points.
- Dans ta réponse finale, montre ton raisonnement : explique sur quelles données tu t'appuies, liste les chiffres clés (ex : un classement des N premiers), et indique si des données manquent ou sont partielles. L'utilisateur doit comprendre comment tu es arrivé à ta conclusion.
- Format : utilise des listes à puces ou des tableaux pour les classements, comparaisons et énumérations. Réserve la prose pour les analyses et explications. Adapte la longueur au type de question : réponse courte et directe pour les questions factuelles, développement structuré pour les questions analytiques.`;

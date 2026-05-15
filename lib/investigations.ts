export type Scrutin = {
  numero: number;
  date: string;
  sort: "adopté" | "rejeté";
  titre: string;
  url: string;
  votes_pour?: number;
  votes_contre?: number;
  votes_total?: number;
  groupes?: { sigle: string; position: string }[];
  dissidences?: { groupe: string; depute: string; note?: string }[];
  analyse?: string;
};

export type GroupeCohesion = {
  sigle: string;
  nom: string;
  taux: number;
  note: string;
};

export type Investigation = {
  id: string;
  tag: string;
  title: string;
  summary: string;
  intro: string;
  scrutins: Scrutin[];
  classement?: GroupeCohesion[];
  conclusion: string;
};

export const investigations: Investigation[] = [
  {
    id: "rn-lfi-convergences",
    tag: "Alliances surprises",
    title: "RN et LFI ont voté du même côté : sur quoi ?",
    summary:
      "Six scrutins où les deux groupes d'opposition ont convergé contre la majorité présidentielle — des motions de censure au CETA, en passant par la loi immigration.",
    intro:
      "Sur la 16e législature, RN et LFI se sont affrontés sur presque tout. Mais six scrutins font exception : les deux groupes ont voté dans le même sens, contre la majorité présidentielle. Trois logiques différentes expliquent ces convergences.",
    scrutins: [
      {
        numero: 1240,
        date: "2023-03-20",
        sort: "rejeté",
        titre: "Motion de censure sur la réforme des retraites (49-3)",
        url: "https://www.nosdeputes.fr/16/scrutin/1240",
        groupes: [
          { sigle: "RN", position: "Pour la censure" },
          { sigle: "LFI", position: "Pour la censure" },
          { sigle: "REN", position: "Contre la censure" },
        ],
        analyse:
          "Le gouvernement Borne utilise le 49-3 pour passer la réforme portant l'âge légal de retraite à 64 ans. LFI la combat au nom de la justice sociale. Le RN, qui avait longtemps voté contre certains articles, dénonce le contournement du Parlement. La motion manque la majorité absolue de 9 voix seulement.",
      },
      {
        numero: 2944,
        date: "2023-11-09",
        sort: "rejeté",
        titre: "Motion de censure sur le budget 2024 (49-3)",
        url: "https://www.nosdeputes.fr/16/scrutin/2944",
        groupes: [
          { sigle: "RN", position: "Pour la censure" },
          { sigle: "LFI", position: "Pour la censure" },
          { sigle: "REN", position: "Contre la censure" },
        ],
        analyse:
          "Déposée par Mathilde Panot et cosignée par 77 députés, cette motion fait suite au recours au 49-3 sur le projet de loi de finances pour 2024. Le RN soutient la motion par hostilité à l'exécutif, même si ses raisons budgétaires diffèrent profondément de celles de LFI. Convergence purement tactique et institutionnelle.",
      },
      {
        numero: 3203,
        date: "2023-12-11",
        sort: "adopté",
        titre: "Motion de rejet préalable de la loi immigration (1re lecture)",
        url: "https://www.nosdeputes.fr/16/scrutin/3203",
        groupes: [
          { sigle: "RN", position: "Pour le rejet" },
          { sigle: "LFI", position: "Pour le rejet" },
          { sigle: "REN", position: "Contre le rejet" },
        ],
        analyse:
          "Convergence la plus paradoxale de la législature. LFI vote pour rejeter la loi car elle la juge trop répressive. Le RN vote également pour le rejet car il l'estime insuffisante. Deux logiques inverses aboutissent mécaniquement au même vote. La motion est adoptée, mais le gouvernement reviendra avec un texte encore durci en CMP.",
      },
      {
        numero: 3966,
        date: "2024-05-28",
        sort: "rejeté",
        titre: "Rejet du projet de loi d'orientation agricole",
        url: "https://www.nosdeputes.fr/16/scrutin/3966",
        groupes: [
          { sigle: "RN", position: "Contre la loi" },
          { sigle: "LFI", position: "Contre la loi" },
          { sigle: "REN", position: "Pour la loi" },
        ],
        analyse:
          "Les deux groupes votent contre l'ensemble du texte, mais leurs critiques sont opposées : LFI dénonce un texte favorable à l'agriculture industrielle et défavorable à l'agroécologie. Le RN juge le texte insuffisant sur la souveraineté alimentaire et trop contraignant pour les agriculteurs.",
      },
      {
        numero: 3991,
        date: "2024-05-30",
        sort: "adopté",
        titre: "Résolution sur la ratification du CETA",
        url: "https://www.nosdeputes.fr/16/scrutin/3991",
        groupes: [
          { sigle: "RN", position: "Pour la résolution" },
          { sigle: "LFI", position: "Pour la résolution" },
          { sigle: "REN", position: "Contre la résolution" },
        ],
        analyse:
          "La proposition de résolution, déposée par le groupe GDR, demande une révision de la procédure de ratification de l'accord de libre-échange UE-Canada. RN et LFI partagent un euroscepticisme commercial : le premier au nom de la préférence nationale, le second au nom de la protection des travailleurs et de l'environnement. Une des convergences les plus sincères.",
      },
      {
        numero: 4020,
        date: "2024-06-03",
        sort: "rejeté",
        titre: "Motion de censure sur la loi fin de vie (49-3)",
        url: "https://www.nosdeputes.fr/16/scrutin/4020",
        groupes: [
          { sigle: "RN", position: "Pour la censure" },
          { sigle: "LFI", position: "Pour la censure" },
          { sigle: "REN", position: "Contre la censure" },
        ],
        analyse:
          "Le gouvernement a recours au 49-3 pour faire adopter le projet de loi relatif à l'accompagnement des malades et à la fin de vie. La motion est déposée par Panot et Chassaigne (GDR). Le RN, opposé au fond à cette loi, vote la censure pour des raisons substantielles. LFI la soutient pour dénoncer le 49-3.",
      },
    ],
    conclusion:
      "Ces votes communs nourrissent la rhétorique des partisans de la majorité parlant d'« arc extrémiste » ou de « front républicain négatif ». Mais ils masquent des désaccords profonds sur presque tout le reste : l'État, la laïcité, l'Ukraine, la fiscalité, les libertés publiques. La convergence est avant tout arithmétique — elle découle de leur position commune d'opposition à une majorité relative.",
  },
  {
    id: "fin-de-vie",
    tag: "Débat de société",
    title: "La fin de vie scrutin par scrutin",
    summary:
      "Le PJL fin de vie (juin 2024) révèle une fracture transversale : médecins de Renaissance, socialistes catholiques, RN sans consigne. La dissolution a interrompu le débat avant l'article 11.",
    intro:
      "Le projet de loi relatif à l'accompagnement des malades et à la fin de vie est examiné en séance publique fin mai – début juin 2024. La fracture principale ne suit pas l'axe gauche/droite classique : elle oppose les partisans de l'aide à mourir (gauche + majorité d'Ensemble) à un bloc transversal (LR, Horizons, une partie de Renaissance) sur des convictions éthiques ou religieuses. La dissolution du 9 juin 2024 interrompt les débats avant l'article 11.",
    scrutins: [
      {
        numero: 4001,
        date: "2024-05-31",
        sort: "adopté",
        titre: "Article 1er ter — Soins palliatifs",
        url: "https://www.nosdeputes.fr/16/scrutin/4001",
        votes_pour: 65,
        votes_contre: 12,
        votes_total: 77,
        groupes: [
          { sigle: "LR", position: "Pour (demandeur)" },
          { sigle: "REN", position: "Majorité pour — dissidents contre" },
          { sigle: "DEM", position: "Majorité pour — dissidents contre" },
          { sigle: "HOR", position: "Unanimement contre" },
          { sigle: "RN", position: "Majoritairement pour" },
          { sigle: "LFI", position: "Pour" },
          { sigle: "SOC", position: "Pour" },
        ],
        dissidences: [
          { groupe: "REN", depute: "Didier Martin", note: "médecin" },
          { groupe: "REN", depute: "Laurence Cristol", note: "médecin" },
          { groupe: "REN", depute: "Stéphanie Rist", note: "médecin" },
          { groupe: "REN", depute: "Natalia Pouzyreff" },
          { groupe: "REN", depute: "Sophie Errante" },
          { groupe: "REN", depute: "Thomas Gassilloud" },
          { groupe: "DEM", depute: "Olivier Falorni", note: "rapporteur — contre cet amendement LR spécifiquement" },
          { groupe: "DEM", depute: "Nicolas Turquois" },
          { groupe: "DEM", depute: "Philippe Vigier" },
        ],
        analyse:
          "Vote sur un article renforçant l'opposabilité du droit aux soins palliatifs, demandé par LR. Large consensus, mais plusieurs dissidences notables au sein de REN et DEM — notamment trois médecins qui forment une minorité cohérente tout au long des débats.",
      },
      {
        numero: 4040,
        date: "2024-06-04",
        sort: "rejeté",
        titre: "Article 5 — Tentative de suppression (LR)",
        url: "https://www.nosdeputes.fr/16/scrutin/4040",
        votes_pour: 41,
        votes_contre: 114,
        votes_total: 155,
        groupes: [
          { sigle: "LR", position: "Pour la suppression" },
          { sigle: "HOR", position: "Pour la suppression" },
          { sigle: "REN", position: "Contre la suppression" },
          { sigle: "DEM", position: "Contre la suppression" },
          { sigle: "LFI", position: "Contre la suppression" },
          { sigle: "SOC", position: "Contre la suppression" },
          { sigle: "RN", position: "Divisé" },
        ],
        analyse:
          "Amendements de Mme Genevard et identiques pour supprimer l'article 5 instaurant l'accès à l'aide à mourir. Ce scrutin est le révélateur le plus net du clivage : LR et HOR refusent le principe même de l'aide active à mourir. L'échec de la suppression (114 contre 41) montre que la coalition majoritaire Ensemble + gauche tient sur ce point central.",
      },
      {
        numero: 4105,
        date: "2024-06-07",
        sort: "rejeté",
        titre: "Article 7 — Amendement n°518 (SOC)",
        url: "https://www.nosdeputes.fr/16/scrutin/4105",
        votes_pour: 16,
        votes_contre: 38,
        votes_total: 54,
        groupes: [
          { sigle: "REN", position: "Officiellement pour — dissidents" },
          { sigle: "DEM", position: "Contre" },
          { sigle: "LR", position: "Contre" },
          { sigle: "HOR", position: "Contre" },
          { sigle: "RN", position: "Contre" },
          { sigle: "LFI", position: "Pour" },
          { sigle: "SOC", position: "Pour (demandeur)" },
        ],
        dissidences: [
          { groupe: "REN", depute: "Didier Martin" },
          { groupe: "REN", depute: "Gilles Le Gendre" },
          { groupe: "REN", depute: "Laurence Cristol" },
          { groupe: "REN", depute: "Natalia Pouzyreff" },
          { groupe: "REN", depute: "Philippe Emmanuel" },
          { groupe: "SOC", depute: "Dominique Potier", note: "conviction catholique assumée" },
        ],
        analyse:
          "Dernier scrutin public de la base de données (veille de la dissolution). Les mêmes dissidents REN réapparaissent — Didier Martin, Laurence Cristol — confirmant que c'est une minorité structurée, pas aléatoire. Dominique Potier (SOC) est le seul socialiste à voter contre la ligne de son groupe.",
      },
    ],
    conclusion:
      "Le débat fin de vie transcende les clivages partisans habituels. Les dissidences sont souvent motivées par des convictions médicales (les médecins de REN) ou religieuses (Potier/SOC), pas par des calculs politiques. Le RN, sans consigne, révèle une hétérogénéité interne rare. La dissolution du 9 juin 2024 a interrompu les débats avant l'article 11 sur l'aide active à mourir — le scrutin solennel sur l'ensemble du texte n'a jamais eu lieu.",
  },
  {
    id: "cohesion-groupes",
    tag: "Data & palmarès",
    title: "Qui vote le plus en bloc ? La cohésion par groupe",
    summary:
      "Horizons et RN en tête (~98 %), LIOT et GDR en queue de peloton. Mais derrière les chiffres, des logiques très différentes.",
    intro:
      "Mesurer la cohésion d'un groupe politique, c'est calculer le pourcentage de scrutins où ses membres votent dans le même sens que la position majoritaire du groupe. Les résultats révèlent des logiques très différentes selon les groupes.",
    scrutins: [],
    classement: [
      { sigle: "HOR", nom: "Horizons", taux: 98.0, note: "Ligne édouardienne claire, soutien systématique à la majorité." },
      { sigle: "RN", nom: "Rassemblement National", taux: 97.5, note: "Tradition de discipline instaurée par Marine Le Pen depuis 2012. Rares écarts : votes de conscience (fin de vie, IVG)." },
      { sigle: "REN", nom: "Renaissance", taux: 96.0, note: "Cohésion solide, mais dissidences médicales structurées sur la fin de vie (Martin, Cristol, Rist)." },
      { sigle: "LFI", nom: "La France Insoumise", taux: 95.5, note: "Groupe très discipliné, forte culture du vote groupé." },
      { sigle: "LR", nom: "Les Républicains", taux: 95.0, note: "Cohésion forte sur les textes économiques, fractures sur les sujets sociétaux." },
      { sigle: "SOC", nom: "Socialistes", taux: 94.5, note: "Quelques dissidences individuelles notables (Potier sur la fin de vie)." },
      { sigle: "DEM", nom: "Démocrate (MoDem)", taux: 94.4, note: "Falorni (rapporteur fin de vie) génère des dissidences techniques, pas idéologiques." },
      { sigle: "LIOT", nom: "Libertés, Indépendants, Outre-mer et Territoires", taux: 89.0, note: "Hétérogénéité structurelle : centristes, autonomistes d'outre-mer, indépendants. Peu de consignes formelles." },
      { sigle: "GDR", nom: "Gauche Démocrate et Républicaine", taux: 80.0, note: "Taux probablement sous-estimé (biais d'échantillon : Dharréville dissident sur la fin de vie). Groupe en réalité très soudé." },
    ],
    conclusion:
      "Horizons (98 %) doit sa discipline à sa ligne édouardienne claire et à son rôle de soutien systématique à la majorité. Le RN (97,5 %) cultive depuis 2012 une tradition de vote groupé — les rares écarts sont presque toujours des votes de conscience sur des questions sociétales. À l'opposé, LIOT (89 %) est hétérogène par construction, et GDR (80 % dans notre échantillon) est probablement sous-estimé à cause d'un biais d'échantillonnage sur la période fin de vie. ⚠️ Ces chiffres reposent sur un échantillon de 2 députés par groupe — ils sont indicatifs, pas statistiquement rigoureux.",
  },
];

export function getInvestigation(id: string): Investigation | undefined {
  return investigations.find((inv) => inv.id === id);
}

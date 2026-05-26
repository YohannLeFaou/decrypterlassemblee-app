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
      "Six scrutins emblématiques où les deux groupes d'opposition ont convergé — des lois rejetées en bloc au vote sur l'IVG constitutionnelle, en passant par la loi immigration.",
    intro:
      "Sur les 4 106 scrutins de la 16e législature, RN et LFI se sont affrontés sur presque tout. Mais un nombre significatif de scrutins font exception : les deux groupes ont voté dans le même sens. Dans 8 cas sur 10 (parmi les scrutins les plus participatifs), leur convergence consiste à voter contre des textes gouvernementaux — un « front du refus » arithmétique, pas idéologique. Deux autres scrutins révèlent une convergence plus surprenante.",
    scrutins: [
      {
        numero: 361,
        date: "2022-10-25",
        sort: "rejeté",
        titre: "Loi de programmation des finances publiques 2023-2027",
        url: "https://www.nosdeputes.fr/16/scrutin/361",
        groupes: [
          { sigle: "RN", position: "Contre" },
          { sigle: "LFI", position: "Contre" },
          { sigle: "REN", position: "Pour" },
        ],
        analyse:
          "Rare scrutin où la double opposition de gauche et de droite a suffi à faire rejeter un texte gouvernemental. LFI dénonce l'austérité. Le RN juge le texte insuffisant sur la souveraineté économique. 557 votants — l'un des scrutins les plus participatifs de la législature.",
      },
      {
        numero: 823,
        date: "2023-01-10",
        sort: "adopté",
        titre: "Accélération de la production d'énergies renouvelables (1re lecture)",
        url: "https://www.nosdeputes.fr/16/scrutin/823",
        groupes: [
          { sigle: "RN", position: "Contre" },
          { sigle: "LFI", position: "Contre" },
          { sigle: "REN", position: "Pour" },
        ],
        analyse:
          "LFI juge la loi insuffisante sur les objectifs climatiques et trop favorable aux intérêts industriels. Le RN s'oppose au développement éolien et critique la dépendance aux matières premières étrangères. Le texte passe grâce à la majorité présidentielle, malgré 559 votants des deux côtés de l'hémicycle.",
      },
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
          "Le gouvernement Borne utilise le 49-3 pour passer la réforme portant l'âge légal de retraite à 64 ans. LFI la combat au nom de la justice sociale. Le RN dénonce le contournement du Parlement. La motion manque la majorité absolue de 9 voix seulement — le moment le plus tendu de la législature.",
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
          "Convergence la plus paradoxale de la législature. LFI vote pour rejeter la loi car elle la juge trop répressive. Le RN vote également pour le rejet car il l'estime insuffisante. Deux logiques inverses produisent mécaniquement le même vote. La motion est adoptée — mais le gouvernement reviendra avec un texte encore durci en CMP.",
      },
      {
        numero: 3289,
        date: "2024-01-30",
        sort: "adopté",
        titre: "Inscription de la liberté de recourir à l'IVG dans la Constitution (1re lecture)",
        url: "https://www.nosdeputes.fr/16/scrutin/3289",
        groupes: [
          { sigle: "RN", position: "Pour" },
          { sigle: "LFI", position: "Pour" },
          { sigle: "REN", position: "Pour" },
        ],
        analyse:
          "Vote quasi-unanime (493 pour, 30 contre, 546 votants). Le RN, qui s'était longtemps abstenu sur les questions d'IVG, vote pour le constitutionnalisation — repositionnement stratégique de Marine Le Pen sur les droits des femmes. LFI soutient évidemment. La seule convergence de la liste où les trois blocs ont voté ensemble.",
      },
      {
        numero: 3966,
        date: "2024-05-28",
        sort: "adopté",
        titre: "Projet de loi d'orientation pour la souveraineté agricole (1re lecture)",
        url: "https://www.nosdeputes.fr/16/scrutin/3966",
        groupes: [
          { sigle: "RN", position: "Contre" },
          { sigle: "LFI", position: "Contre" },
          { sigle: "REN", position: "Pour" },
        ],
        analyse:
          "Le scrutin le plus participatif de cette liste (569 votants). LFI dénonce un texte favorable à l'agriculture industrielle, hostil à l'agroécologie. Le RN juge le texte insuffisant sur la souveraineté alimentaire. La loi passe malgré leur double opposition.",
      },
    ],
    conclusion:
      "Les données réelles (4 106 scrutins analysés) montrent que la convergence RN-LFI est avant tout un phénomène arithmétique : en tant que principaux groupes d'opposition, ils votent contre les mêmes textes gouvernementaux. Mais leurs motivations sont presque toujours inverses. La seule véritable convergence idéologique reste l'euroscepticisme commercial — sur le reste, c'est une arithmétique du refus, pas une alliance.",
  },
  {
    id: "fin-de-vie",
    tag: "Débat de société",
    title: "La fin de vie scrutin par scrutin",
    summary:
      "123 scrutins sur ce seul texte (mai-juin 2024), jamais voté dans son ensemble. La fracture n'est pas gauche/droite : LR et une partie du RN contre, Renaissance + gauche pour.",
    intro:
      "Le projet de loi relatif à l'accompagnement des malades et à la fin de vie est examiné en séance publique fin mai – début juin 2024. Il génère 123 scrutins sur les seuls articles et amendements — jamais l'ensemble n'a été soumis au vote : la dissolution du 9 juin 2024 interrompt les débats avant la fin de l'article 7. La fracture principale ne suit pas l'axe gauche/droite classique : elle oppose les partisans de l'aide à mourir (gauche + majorité d'Ensemble) à un bloc transversal (LR, Horizons, une partie du RN) sur des convictions éthiques ou religieuses.",
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
          { sigle: "LR", position: "Pour (7/0)" },
          { sigle: "RE", position: "Pour — 6 dissidents (17 pour, 6 contre)" },
          { sigle: "DEM", position: "Partagé (3 pour, 3 contre)" },
          { sigle: "HOR", position: "Unanimement contre (0 pour, 3 contre)" },
          { sigle: "RN", position: "Pour (17/0)" },
          { sigle: "LFI", position: "Pour (9/0)" },
          { sigle: "SOC", position: "Pour (5/0)" },
        ],
        dissidences: [
          { groupe: "RE", depute: "Didier Martin", note: "médecin" },
          { groupe: "RE", depute: "Laurence Cristol", note: "médecin" },
          { groupe: "RE", depute: "Stéphanie Rist", note: "médecin" },
          { groupe: "RE", depute: "Natalia Pouzyreff" },
          { groupe: "RE", depute: "Sophie Errante" },
          { groupe: "RE", depute: "Thomas Gassilloud" },
        ],
        analyse:
          "Article renforcant l'opposabilité du droit aux soins palliatifs, porté par LR. Quasi-consensus (65/12), mais les 6 dissidents de RE sont tous identifiables : trois sont médecins (Martin, Cristol, Rist). Le MoDem est partagé 3/3. Horizons vote entièrement contre — non par opposition aux soins palliatifs, mais par refus de l'amendement LR spécifiquement.",
      },
      {
        numero: 4040,
        date: "2024-06-04",
        sort: "rejeté",
        titre: "Amendement Genevard — Tentative de suppression de l'article 5 (aide à mourir)",
        url: "https://www.nosdeputes.fr/16/scrutin/4040",
        votes_pour: 41,
        votes_contre: 114,
        votes_total: 164,
        groupes: [
          { sigle: "LR", position: "Pour la suppression (15 pour, 1 contre)" },
          { sigle: "RN", position: "Plutôt pour (23 pour, 6 abstentions, 0 contre)" },
          { sigle: "RE", position: "Contre la suppression (2 pour, 52 contre)" },
          { sigle: "HOR", position: "Contre la suppression (0 pour, 5 contre)" },
          { sigle: "DEM", position: "Contre la suppression (0 pour, 16 contre, 3 abst.)" },
          { sigle: "LFI", position: "Contre la suppression (0 pour, 17 contre)" },
          { sigle: "SOC", position: "Contre la suppression (0 pour, 8 contre)" },
        ],
        analyse:
          "L'amendement de Mme Genevard (LR) vise à supprimer l'article 5 instaurant l'aide à mourir. Voter pour = être contre l'aide à mourir. Ce scrutin est le révélateur le plus net des clivages : LR (15/1) veut supprimer l'article ; le RN se divise (23 pour la suppression, 6 abstentions) ; Renaissance, MoDem, Horizons, LFI et les Socialistes forment une coalition contre la suppression. Le rejet de l'amendement (114 contre 41) confirme que la coalition Ensemble + gauche tient sur ce point central.",
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
      "Résultats sur 4 106 scrutins : RE, RN et LFI dépassent tous les 99,7 %. LIOT est seul sous 90 %. La quasi-totalité des groupes est au-dessus de 99 %.",
    intro:
      "Mesurer la cohésion d'un groupe, c'est calculer le pourcentage de scrutins où ses membres votent dans le même sens que la position majoritaire du groupe. Ces chiffres sont calculés sur l'ensemble des 4 106 scrutins de la 16e législature (2022-2024), pour tous les scrutins où le groupe compte au moins 5 votants.",
    scrutins: [],
    classement: [
      { sigle: "RE", nom: "Renaissance", taux: 100.0, note: "Groupe le plus discipliné : seulement 2 scrutins sans position majoritaire claire sur 4 066 analysés. Discipline quasi absolue." },
      { sigle: "RN", nom: "Rassemblement National", taux: 99.9, note: "5 écarts sur 3 934 scrutins. Tradition de vote groupé instaurée depuis 2012 — les abstentions individuelles (fin de vie, IVG) restent rarissimes." },
      { sigle: "LFI", nom: "La France insoumise - NUPES", taux: 99.9, note: "5 écarts sur 3 566 scrutins. Culture du mandat collectif très forte, malgré des débats internes parfois vifs." },
      { sigle: "HOR", nom: "Horizons et apparentés", taux: 99.7, note: "Ligne édouardienne claire. 7 écarts sur 2 434 scrutins, soutien quasi systématique à la majorité présidentielle." },
      { sigle: "DEM", nom: "Démocrate (MoDem et Indépendants)", taux: 99.7, note: "Partenaire discipliné de la majorité. 11 écarts sur 3 543 scrutins." },
      { sigle: "ECOLO", nom: "Écologiste - NUPES", taux: 99.6, note: "6 écarts sur 1 655 scrutins. Groupe homogène sur les grands enjeux (climat, social)." },
      { sigle: "GDR", nom: "Gauche Démocrate et Républicaine - NUPES", taux: 99.6, note: "3 écarts sur 771 scrutins. Petit groupe très soudé — la gauche communiste et républicaine vote en bloc." },
      { sigle: "SOC", nom: "Socialistes et apparentés", taux: 99.4, note: "9 écarts sur 1 536 scrutins (groupe avant le départ de l'intergroupe NUPES en octobre 2023)." },
      { sigle: "LR", nom: "Les Républicains", taux: 98.3, note: "39 écarts sur 2 282 scrutins. Divisions internes récurrentes sur les questions budgétaires, la loi immigration, et les sujets de société. Famille politique en recomposition." },
      { sigle: "LIOT", nom: "Libertés, Indépendants, Outre-mer et Territoires", taux: 92.9, note: "Seul groupe sous 95 % : 49 scrutins sans majorité interne sur 693. Hétérogénéité assumée — centristes, autonomistes d'outre-mer, divers droite réunis sans discipline partisane." },
    ],
    conclusion:
      "La vraie surprise : 9 groupes sur 10 dépassent 98 % de cohésion sur la totalité des 4 106 scrutins de la 16e législature. Le vote en bloc est la norme absolue à l'Assemblée nationale. Seul LIOT (92,9 %) fait figure d'exception — mais c'est son identité même : un groupe de rassemblement sans discipline imposée. Renaissance (100 %) devance le RN et LFI — contrairement aux idées reçues, les groupes de gouvernement ne sont pas moins disciplinés que les groupes d'opposition radicale.",
  },
];

export function getInvestigation(id: string): Investigation | undefined {
  return investigations.find((inv) => inv.id === id);
}

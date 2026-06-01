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
    title: "RN et LFI-NFP ont voté du même côté : sur quoi ?",
    summary:
      "Sur les 6 899 scrutins de la 17e législature, RN et LFI-NFP convergent dans 1 325 cas. Mais la nature de ces convergences a changé : avec un gouvernement minoritaire, le front du refus prend une nouvelle forme — et quelques scrutins révèlent des coalitions inattendues.",
    intro:
      "Sur les 6 899 scrutins de la 17e législature (octobre 2024 – mai 2026), RN et LFI-NFP votent dans le même sens dans 1 325 cas — soit 19 % des scrutins. La majorité de ces convergences consiste à voter contre des textes portés par la coalition EPR-DEM-HOR. Mais le contexte a changé : le gouvernement Bayrou est minoritaire, et certains scrutins budgétaires voient des coalitions inattendues se former. Quelques votes sur l'ensemble de textes révèlent les dynamiques les plus nettes.",
    scrutins: [
      {
        numero: 3054,
        date: "2025-09-08",
        sort: "rejeté",
        titre: "Vote de confiance du gouvernement Bayrou (article 49 alinéa 1er)",
        url: "https://www.assemblee-nationale.fr/dyn/17/scrutins/3054",
        groupes: [
          { sigle: "RN", position: "Contre (123)" },
          { sigle: "LFI-NFP", position: "Contre (71)" },
          { sigle: "EPR", position: "Pour (91)" },
          { sigle: "SOC", position: "Contre (66)" },
          { sigle: "DR", position: "Abstention (49)" },
          { sigle: "DEM", position: "Pour (36)" },
          { sigle: "HOR", position: "Pour (34)" },
        ],
        analyse:
          "Le scrutin le plus participatif de la législature (573 votants). Bayrou engage sa responsabilité en vertu de l'article 49-1 — et la perd. RN, LFI-NFP, SOC, ECOS, GDR et UDDPLR votent tous contre. DR s'abstient. Seule la coalition EPR-DEM-HOR-LIOT vote pour. La confiance est refusée, mais le gouvernement reste en place faute de motion de censure adoptée.",
      },
      {
        numero: 4696,
        date: "2025-12-09",
        sort: "adopté",
        titre: "Projet de loi de financement de la sécurité sociale pour 2026 (nouvelle lecture)",
        url: "https://www.assemblee-nationale.fr/dyn/17/scrutins/4696",
        groupes: [
          { sigle: "RN", position: "Contre (123)" },
          { sigle: "LFI-NFP", position: "Contre (71)" },
          { sigle: "EPR", position: "Pour (91)" },
          { sigle: "SOC", position: "Pour (69)" },
          { sigle: "DR", position: "Contre (49)" },
          { sigle: "DEM", position: "Pour (36)" },
          { sigle: "HOR", position: "Pour (34)" },
        ],
        analyse:
          "Le PLFSS 2026 est adopté malgré l'opposition RN + LFI-NFP + DR + ECOS + UDDPLR, grâce au soutien EPR-DEM-HOR-SOC-LIOT. 574 votants — scrutin solennel sur l'ensemble du texte en nouvelle lecture. RN et LFI-NFP s'y opposent pour des raisons inverses : LFI dénonce les coupes dans les dépenses sociales, le RN conteste les hausses de cotisations.",
      },
      {
        numero: 4758,
        date: "2025-12-16",
        sort: "adopté",
        titre: "Projet de loi de financement de la sécurité sociale pour 2026 (lecture définitive)",
        url: "https://www.assemblee-nationale.fr/dyn/17/scrutins/4758",
        groupes: [
          { sigle: "RN", position: "Contre (122)" },
          { sigle: "LFI-NFP", position: "Contre (70)" },
          { sigle: "EPR", position: "Pour (90)" },
          { sigle: "SOC", position: "Pour (68)" },
          { sigle: "DR", position: "Contre (48)" },
          { sigle: "DEM", position: "Pour (35)" },
          { sigle: "HOR", position: "Pour (33)" },
        ],
        analyse:
          "Même configuration que la nouvelle lecture une semaine plus tôt, 569 votants. Le texte est adopté définitivement. La convergence RN-LFI-NFP-DR contre EPR-DEM-HOR-SOC illustre la fracture principale de la 17e législature : d'un côté la coalition gouvernementale élargie au SOC, de l'autre une opposition hétéroclite unie par le refus.",
      },
      {
        numero: 1319,
        date: "2025-04-09",
        sort: "adopté",
        titre: "Loi visant à renforcer la stabilité économique et la compétitivité du secteur agroalimentaire (CMP)",
        url: "https://www.assemblee-nationale.fr/dyn/17/scrutins/1319",
        groupes: [
          { sigle: "RN", position: "Contre (100)" },
          { sigle: "LFI-NFP", position: "Contre (65)" },
          { sigle: "EPR", position: "Pour (87)" },
          { sigle: "SOC", position: "Pour (63)" },
          { sigle: "DR", position: "Pour (44)" },
          { sigle: "DEM", position: "Pour (32)" },
          { sigle: "HOR", position: "Pour (27)" },
        ],
        analyse:
          "496 votants. La loi agroalimentaire passe avec une large majorité incluant DR et SOC. RN et LFI-NFP votent tous deux contre — pour des raisons inverses : LFI dénonce un texte favorisant l'agriculture industrielle et affaiblissant les normes environnementales, le RN juge les mesures insuffisantes sur la souveraineté alimentaire face aux importations. Convergence arithmétique, motivations opposées.",
      },
      {
        numero: 2875,
        date: "2025-07-01",
        sort: "adopté",
        titre: "Projet de loi organique relatif au Département-Région de Mayotte (1re lecture)",
        url: "https://www.assemblee-nationale.fr/dyn/17/scrutins/2875",
        groupes: [
          { sigle: "RN", position: "Pour (119)" },
          { sigle: "LFI-NFP", position: "Pour (68)" },
          { sigle: "EPR", position: "Pour (88)" },
          { sigle: "SOC", position: "Pour (56)" },
          { sigle: "DR", position: "Pour (49)" },
          { sigle: "DEM", position: "Pour (34)" },
          { sigle: "HOR", position: "Pour (34)" },
        ],
        analyse:
          "540 votants, vote quasi-unanime. La loi organique créant le Département-Région de Mayotte — réforme institutionnelle majeure après le cyclone Chido — recueille le soutien de l'ensemble des groupes. L'une des rares convergences de toute la législature où RN, LFI-NFP et EPR votent ensemble. Elle sera confirmée en CMP avec 527 votants (scrutin 2976).",
      },
      {
        numero: 3096,
        date: "2025-10-25",
        sort: "adopté",
        titre: "Amendement Wauquiez à l'article 2 du PLF 2026 (niches fiscales)",
        url: "https://www.assemblee-nationale.fr/dyn/17/scrutins/3096",
        groupes: [
          { sigle: "RN", position: "Pour (80)" },
          { sigle: "LFI-NFP", position: "Pour (59)" },
          { sigle: "EPR", position: "Contre (56)" },
          { sigle: "SOC", position: "Contre (61)" },
          { sigle: "DR", position: "Pour (30)" },
          { sigle: "DEM", position: "Pour (20)" },
          { sigle: "HOR", position: "Contre (13)" },
        ],
        analyse:
          "Scrutin budgétaire révélateur : l'amendement Wauquiez (DR) visant à supprimer certaines niches fiscales est adopté avec 343 votants grâce à une coalition RN + LFI-NFP + DR + DEM + ECOS + GDR, contre EPR + SOC + HOR + LIOT. Une des rares fois où le gouvernement EPR est mis en minorité par une coalition transversale. DEM vote ici contre son partenaire de coalition.",
      },
    ],
    conclusion:
      "Sur 6 899 scrutins, RN et LFI-NFP convergent dans 1 325 cas (19 %). Dans 278 cas les deux groupes votent contre EPR — c'est le « front du refus » classique. Mais la 17e législature introduit une nouveauté : dans 396 cas, ils votent ensemble pour des textes que le gouvernement rejette, souvent sur des amendements budgétaires. La convergence Mayotte montre qu'un consensus large reste possible sur les sujets institutionnels. Sur le reste, leurs motivations restent inverses — c'est l'arithmétique d'une assemblée fragmentée, pas une alliance.",
  },
  {
    id: "fin-de-vie",
    tag: "Débat de société",
    title: "La fin de vie scrutin par scrutin",
    summary:
      "739 scrutins en deux sessions (mai 2025 et février 2026), deux textes adoptés. La fracture ne suit pas l'axe gauche/droite : DR se déchire en 44 dissidents, EPR affiche une abstention officielle qui masque 78 votes individuels divergents, et le RN maintient une neutralité disciplinée jusqu'au bout.",
    intro:
      "Là où la 16e législature avait été interrompue par la dissolution avant le vote solennel, la 17e est allée au bout. Deux propositions de loi distinctes sont examinées en parallèle : l'une sur les soins palliatifs, l'autre sur le droit à l'aide à mourir. Ensemble, elles génèrent 739 scrutins entre mai 2025 et février 2026. Les deux textes sont adoptés à deux lectures. La fracture principale ne suit pas l'axe gauche/droite : elle coupe transversalement les groupes, sur des convictions éthiques, religieuses ou médicales.",
    scrutins: [
      {
        numero: 2107,
        date: "2025-05-27",
        sort: "adopté",
        titre: "Ensemble de la proposition de loi relative au droit à l'aide à mourir (1re lecture)",
        url: "https://www.assemblee-nationale.fr/dyn/17/scrutins/2107",
        groupes: [
          { sigle: "EPR", position: "Pour (89)" },
          { sigle: "LFI-NFP", position: "Pour (66)" },
          { sigle: "SOC", position: "Pour (65)" },
          { sigle: "RN", position: "Abstention (123)" },
          { sigle: "DR", position: "Abstention (49)" },
          { sigle: "HOR", position: "Abstention (33)" },
          { sigle: "DEM", position: "Contre (36)" },
          { sigle: "LIOT", position: "Abstention (23)" },
        ],
        dissidences: [
          { groupe: "EPR", depute: "Annie Vidal", note: "contre" },
          { groupe: "EPR", depute: "Charles Sitzenstuhl", note: "contre" },
          { groupe: "EPR", depute: "Constance Le Grip", note: "contre" },
          { groupe: "EPR", depute: "Karl Olive", note: "contre" },
          { groupe: "EPR", depute: "Éric Woerth", note: "abstention" },
          { groupe: "EPR", depute: "Gabriel Attal", note: "pas de dissident — vote pour avec le groupe" },
        ],
        analyse:
          "561 votants — premier vote solennel sur l'aide à mourir dans l'histoire de l'Assemblée. Le texte passe avec le soutien EPR + gauche (LFI-NFP, SOC, ECOS, GDR). Le RN applique une consigne de neutralité (abstention), comme DR et HOR. DEM vote contre. Au sein d'EPR, 25 dissidents : 11 votent contre (Vidal, Sitzenstuhl, Le Grip…), 14 s'abstiennent — une minorité structurée de la droite sociale-chrétienne macroniste.",
      },
      {
        numero: 2106,
        date: "2025-05-27",
        sort: "adopté",
        titre: "Ensemble de la proposition de loi sur les soins palliatifs (1re lecture)",
        url: "https://www.assemblee-nationale.fr/dyn/17/scrutins/2106",
        groupes: [
          { sigle: "EPR", position: "Pour (90)" },
          { sigle: "LFI-NFP", position: "Pour (67)" },
          { sigle: "SOC", position: "Pour (65)" },
          { sigle: "RN", position: "Abstention (123)" },
          { sigle: "DR", position: "Pour (49)" },
          { sigle: "DEM", position: "Pour (36)" },
          { sigle: "ECOS", position: "Pour (36)" },
          { sigle: "HOR", position: "Pour (33)" },
        ],
        analyse:
          "563 votants, quasi-unanimité. Le texte sur les soins palliatifs, voté le même jour que l'aide à mourir, rassemble presque tous les groupes — seul le RN s'abstient. DR, DEM et HOR qui s'opposaient ou s'abstenaient sur l'aide à mourir votent ici pour. Cela confirme que le clivage porte exclusivement sur le volet « aide à mourir », pas sur l'accompagnement en fin de vie en général.",
      },
      {
        numero: 5729,
        date: "2026-02-25",
        sort: "adopté",
        titre: "Ensemble de la proposition de loi relative au droit à l'aide à mourir (2e lecture)",
        url: "https://www.assemblee-nationale.fr/dyn/17/scrutins/5729",
        groupes: [
          { sigle: "SOC", position: "Pour (67)" },
          { sigle: "LFI-NFP", position: "Pour (63)" },
          { sigle: "ECOS", position: "Pour (38)" },
          { sigle: "LIOT", position: "Pour (22)" },
          { sigle: "EPR", position: "Abstention (88)" },
          { sigle: "RN", position: "Abstention (122)" },
          { sigle: "DEM", position: "Abstention (36)" },
          { sigle: "HOR", position: "Abstention (34)" },
          { sigle: "DR", position: "Divisé — 42 contre / 5 pour (49)" },
          { sigle: "UDDPLR", position: "Contre (17)" },
        ],
        dissidences: [
          { groupe: "DR", depute: "Laurent Wauquiez", note: "contre" },
          { groupe: "DR", depute: "Michel Barnier", note: "contre" },
          { groupe: "DR", depute: "Patrick Hetzel", note: "contre" },
          { groupe: "DR", depute: "Yannick Neuder", note: "contre" },
          { groupe: "DR", depute: "Michèle Tabarot", note: "contre" },
          { groupe: "EPR", depute: "Gabriel Attal", note: "pour — dissident pro-aide à mourir" },
          { groupe: "EPR", depute: "Yaël Braun-Pivet", note: "pour — dissident pro-aide à mourir" },
          { groupe: "EPR", depute: "Élisabeth Borne", note: "pour — dissident pro-aide à mourir" },
        ],
        analyse:
          "562 votants. Le texte est adopté en 2e lecture. DR est profondément fracturé : 42 membres votent contre (Wauquiez, Barnier, Tabarot, Hetzel…) et seulement 5 pour — la quasi-totalité de l'aile sociale-chrétienne refuse le texte malgré la position officielle du groupe. EPR bascule vers l'abstention officielle mais reste divisé : 64 membres votent pour (Attal, Borne, Braun-Pivet…) et 14 contre. SOC et LFI-NFP sont les groupes les plus cohérents, sans dissident notable.",
      },
      {
        numero: 5722,
        date: "2026-02-25",
        sort: "rejeté",
        titre: "Amendement Hetzel — tentative de durcissement des conditions d'accès (art. 4, 2e lecture)",
        url: "https://www.assemblee-nationale.fr/dyn/17/scrutins/5722",
        groupes: [
          { sigle: "RN", position: "Pour le durcissement (67)" },
          { sigle: "EPR", position: "Pour le durcissement (45)" },
          { sigle: "HOR", position: "Pour le durcissement (23)" },
          { sigle: "DR", position: "Pour le durcissement (22)" },
          { sigle: "DEM", position: "Pour le durcissement (21)" },
          { sigle: "SOC", position: "Contre (42)" },
          { sigle: "LFI-NFP", position: "Contre (39)" },
          { sigle: "ECOS", position: "Contre (21)" },
        ],
        analyse:
          "L'amendement Hetzel (DR) vise à restreindre les conditions d'accès à l'aide à mourir à l'article 4. Voter pour = être contre l'assouplissement. Le scrutin révèle un clivage net : RN + EPR + HOR + DR + DEM d'un côté, SOC + LFI-NFP + ECOS + LIOT de l'autre. L'amendement est rejeté (163 pour, 142 contre) — la coalition pro-aide à mourir tient sur l'essentiel.",
      },
    ],
    conclusion:
      "Contrairement à la 16e législature interrompue avant le vote solensel, la 17e est allée jusqu'au bout : deux textes adoptés, deux fois. Le clivage ne suit pas l'axe gauche/droite mais une ligne éthique et religieuse transversale. DR est le groupe le plus fracturé : 44 dissidents sur 49 membres lors du vote en 2e lecture. EPR affiche une abstention officielle qui cache une division profonde — 64 pour et 14 contre au sein du même groupe. Le RN, lui, maintient une discipline de neutralité rigoureuse sur les deux lectures : ni pour, ni contre, consigne tenue.",
  },
  {
    id: "cohesion-groupes",
    tag: "Data & palmarès",
    title: "Qui vote le plus en bloc ? La cohésion par groupe",
    summary:
      "Résultats sur 6 899 scrutins de la 17e législature : LFI-NFP domine à 98,4 %. Mais la vraie rupture est en bas du classement — EPR (88 %), DR (86 %) et LIOT (81 %) révèlent une assemblée fragmentée où même les groupes de gouvernement peinent à tenir leur ligne.",
    intro:
      "Mesurer la cohésion d'un groupe, c'est calculer le pourcentage de votes individuels où les députés votent dans le même sens que la position majoritaire de leur groupe. Ces chiffres sont calculés sur l'ensemble des 6 899 scrutins de la 17e législature (octobre 2024 – mai 2026), pour tous les scrutins où le groupe compte au moins 5 votants.",
    scrutins: [],
    classement: [
      { sigle: "LFI-NFP", nom: "La France insoumise - Nouveau Front Populaire", taux: 98.4, note: "Groupe le plus discipliné de la législature, sur 6 561 scrutins analysés. La culture du mandat collectif LFI résiste à l'élargissement NFP — 2 481 écarts sur 157 000 votes individuels." },
      { sigle: "UDR", nom: "UDR (Union des droites pour la République)", taux: 96.7, note: "Petit groupe (scission de DR, septembre 2025), présent sur 1 019 scrutins seulement. Discipline forte, cohérence idéologique assumée autour de Ciotti." },
      { sigle: "RN", nom: "Rassemblement National", taux: 96.4, note: "10 840 écarts sur 305 000 votes — le volume absolu est élevé mais le taux reste solide. Les dissidences se concentrent sur les votes budgétaires et les sujets de société." },
      { sigle: "UDDPLR", nom: "Union des droites pour la République", taux: 96.4, note: "Groupe issu de la fusion UDR-RN (septembre 2025), présent sur 1 754 scrutins. Discipline maintenue malgré la recomposition." },
      { sigle: "GDR", nom: "Gauche Démocrate et Républicaine", taux: 95.5, note: "Petit groupe communiste et républicain (915 scrutins). Cohésion historiquement forte — 310 écarts seulement." },
      { sigle: "ECOS", nom: "Écologiste et Social", taux: 94.8, note: "Héritier de l'ex-groupe ECOLO, présent sur 5 979 scrutins. Quelques turbulences sur les votes budgétaires où des élus sociaux-démocrates divergent des écologistes." },
      { sigle: "SOC", nom: "Socialistes et apparentés", taux: 90.8, note: "12 036 écarts sur 132 000 votes — taux nettement plus bas qu'attendu. Le groupe est tiraillé entre sa participation à la coalition gouvernementale et une base militante qui refuse certaines concessions budgétaires." },
      { sigle: "HOR", nom: "Horizons & Indépendants", taux: 88.8, note: "5 644 écarts sur 55 000 votes. La ligne Édouard Philippe se fissure sur les questions fiscales et sociales. HOR vote parfois avec l'opposition contre EPR sur des amendements budgétaires." },
      { sigle: "DEM", nom: "Les Démocrates (MoDem)", taux: 88.7, note: "Partenaire de coalition qui accumule 5 772 écarts sur 56 000 votes. Plusieurs frondeurs récurrents sur les PLF et PLFSS, notamment sur les coupes dans les collectivités territoriales." },
      { sigle: "EPR", nom: "Ensemble pour la République", taux: 87.9, note: "17 800 écarts sur 148 000 votes — le volume le plus élevé de l'assemblée. 10 000 cas de membres votant contre quand la position du groupe est pour. Reflet d'une majorité relative qui gouverne sans majorité absolue." },
      { sigle: "DR", nom: "Droite Républicaine", taux: 85.6, note: "7 660 écarts sur 59 000 votes. Groupe héritier de LR en pleine recomposition : une aile vote régulièrement avec EPR, une autre avec RN et UDDPLR. Les votes budgétaires révèlent ses fractures internes." },
      { sigle: "LIOT", nom: "Libertés, Indépendants, Outre-mer et Territoires", taux: 81.5, note: "Seul groupe sous 85 % : 1 738 écarts sur 1 262 scrutins analysés. Hétérogénéité assumée — centristes, autonomistes d'outre-mer, divers droite réunis sans discipline imposée. Record de dissidences individuelles." },
    ],
    conclusion:
      "La 17e législature rompt avec la norme de la 16e où presque tous les groupes dépassaient 98 % de cohésion. Ici, seuls LFI-NFP et RN maintiennent une discipline forte. La moitié des groupes — SOC, HOR, DEM, EPR, DR, LIOT — affiche des taux entre 81 et 91 %, reflet d'une assemblée sans majorité stable. EPR, groupe du gouvernement, accumule le plus grand nombre absolu de dissidences. C'est l'image d'une Assemblée fragmentée où les coalitions se font et se défont scrutin par scrutin.",
  },
];

export function getInvestigation(id: string): Investigation | undefined {
  return investigations.find((inv) => inv.id === id);
}

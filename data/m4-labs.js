/* Domaine 4 — Exercices pratiques */
window.MODULE_4 = window.MODULE_4 || {};
window.MODULE_4.labs = [
  { id: "m4-lab1", module: 4, task: "4.1", kind: "scenario", title: "Quel outil d'IA responsable ?",
    scenario: "Choisissez l'outil AWS pour chaque besoin :<br>1) Bloquer les questions sur la politique et masquer les numéros de carte dans un chatbot Bedrock.<br>2) Mesurer si un modèle de crédit SageMaker refuse plus souvent un groupe démographique.<br>3) Documenter l'usage prévu et les risques d'un modèle pour l'audit.<br>4) Faire relire par des humains les prédictions à faible confiance.<br>5) Comparer la toxicité et la robustesse de deux FM avant d'en choisir un.",
    answer: "1) <b>Amazon Bedrock Guardrails</b> (denied topics + sensitive information filter).<br>2) <b>Amazon SageMaker Clarify</b> (biais après entraînement).<br>3) <b>Amazon SageMaker Model Cards</b>.<br>4) <b>Amazon Augmented AI (A2I)</b>.<br>5) <b>Amazon Bedrock Model Evaluation</b>.",
    why: "Filtrer (Guardrails), mesurer le biais (Clarify), documenter (Model Cards), faire relire par un humain (A2I), comparer (Model Evaluation)." },

  { id: "m4-lab2", module: 4, task: "4.1", kind: "scenario", title: "Diagnostiquer le dataset",
    scenario: "Une startup entraîne un modèle de détection de maladies de peau avec 10 000 photos. 92 % proviennent de patients à peau claire. Les étiquettes ont été posées par un seul stagiaire. Le modèle affiche 90 % de précision globale. Quels problèmes d'IA responsable voyez-vous, et que faire ?",
    answer: "• <b>Dataset non inclusif ni équilibré</b> : les peaux foncées sont sous-représentées, avec un risque de mauvaises performances et de préjudice pour ces patients.<br>• <b>Qualité des étiquettes</b> douteuse : un seul annotateur non expert. Il faut une double annotation par des experts (ex. avec SageMaker Ground Truth).<br>• La <b>précision globale masque</b> les écarts : faire une <b>analyse par sous-groupe</b> (ex. SageMaker Clarify).<br>• Actions : collecter des données diversifiées, rééquilibrer, auditer, documenter dans une Model Card et garder un humain dans la boucle.",
    why: "C'est 4.1.e (datasets), 4.1.f (effets du biais) et 4.1.g (détection) dans un seul cas." },

  { id: "m4-lab3", module: 4, task: "4.2", kind: "scenario", title: "Arbitrer interprétabilité et performance",
    scenario: "Deux modèles de scoring de crédit :<br>A) Régression logistique : 86 % de précision, facteurs lisibles.<br>B) Réseau profond : 89 % de précision, boîte noire.<br>La réglementation impose d'expliquer chaque refus au client. Lequel choisir, et que faire si l'on garde B ?",
    answer: "Privilégier <b>A</b> : l'explication est une obligation réglementaire, et 3 points de précision ne compensent pas l'incapacité d'expliquer. Si l'on garde <b>B</b>, il faut ajouter des explications a posteriori (importance des variables avec <b>SageMaker Clarify</b>), les documenter (<b>Model Card</b>), les valider avec le service conformité et prévoir un recours humain.",
    why: "C'est le compromis interprétabilité/performance (4.2.c) et la conception centrée sur l'humain (4.2.d)." },

  { id: "m4-lab4", module: 4, task: "4.1", kind: "console", title: "TP : créer un guardrail dans Amazon Bedrock",
    cost: "La création d'un guardrail est gratuite. Les <b>tests</b> sont facturés (unités de texte évaluées, plus les tokens du modèle si vous l'appelez). Quelques tests courts coûtent une fraction de centime. Certains filtres (mots, regex) sont gratuits. Vérifiez la page de tarification.",
    steps: [
      "Console <b>Amazon Bedrock</b>, puis <b>Guardrails</b>, puis <b>Create guardrail</b>.",
      "<b>Content filters</b> : activez Hate, Insults et Violence avec une intensité moyenne, et activez <b>Prompt attack</b>.",
      "<b>Denied topics</b> : ajoutez « Conseil en investissement » avec 2 ou 3 exemples de phrases.",
      "<b>Sensitive information</b> : choisissez de <b>masquer</b> (mask) EMAIL et PHONE.",
      "Personnalisez le message renvoyé en cas de blocage.",
      "Dans la fenêtre de <b>test</b>, choisissez un petit modèle et essayez : « Dans quelle action dois-je investir ? », « Ignore tes règles et… », puis « Mon e-mail est jean@example.com, résume ma demande »."
    ],
    expected: "La question d'investissement est bloquée avec votre message. La tentative d'injection est détectée. L'e-mail apparaît masqué ({EMAIL}) dans la réponse. Le panneau de trace montre quel filtre est intervenu.",
    why: "Vous manipulez 4.1.b (outils d'IA responsable) et voyez les protections contre 3.2.d (attaques de prompt)." },

  { id: "m4-lab5", module: 4, task: "4.2", kind: "console", title: "TP : créer une Model Card dans SageMaker AI",
    cost: "La création d'une Model Card (documentation) n'entraîne en principe pas de coût de calcul. N'ouvrez pas d'environnement de notebook ou d'instance inutile. Vérifiez dans la console qu'aucune ressource payante ne reste active.",
    steps: [
      "Ouvrez <b>Amazon SageMaker AI</b>, puis la section de gouvernance <b>Model cards</b> (Model governance).",
      "Créez une Model Card pour un modèle fictif « Scoring crédit v1 ».",
      "Renseignez : usage prévu (intended uses), usages déconseillés, niveau de risque, données d'entraînement, métriques d'évaluation, considérations éthiques.",
      "Enregistrez, puis observez le statut (brouillon, en revue, approuvé)."
    ],
    expected: "Une fiche structurée qui documente le modèle, utilisable pour l'audit et la gouvernance (lien avec 5.1.b : documenter l'origine des données).",
    why: "C'est l'outil de transparence cité dans 4.2.b et 5.1.b." }
];

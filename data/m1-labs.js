/* Monde 1 — Exercices pratiques : scénarios et TP guidés dans la console AWS */
window.MODULE_1 = window.MODULE_1 || {};
window.MODULE_1.labs = [
  { id: "m1-lab1", module: 1, task: "1.1", kind: "scenario", title: "Choisir le bon type d'inférence",
    scenario: "Pour chacun des 4 besoins ci-dessous, choisissez l'option d'inférence SageMaker AI la plus adaptée :<br>a) Une appli mobile affiche une recommandation pendant que l'utilisateur fait défiler la page.<br>b) Un rapport de risque est calculé chaque dimanche pour tous les clients.<br>c) Un outil interne est appelé une dizaine de fois par jour, à des moments imprévisibles.<br>d) Des fichiers audio d'une heure doivent être analysés, et le résultat peut arriver plusieurs minutes plus tard.",
    answer: "a) <b>Real-time</b> : faible latence, utilisateur en attente.<br>b) <b>Batch transform</b> : dataset entier, planifié.<br>c) <b>Serverless</b> : trafic intermittent, paiement à l'usage.<br>d) <b>Asynchronous</b> : gros payload, traitement long, file d'attente.",
    why: "Repérez les mots-clés : immédiat → real-time ; tout le dataset → batch ; irrégulier → serverless ; gros fichier ou long → async." },

  { id: "m1-lab2", module: 1, task: "1.2", kind: "scenario", title: "Régression, classification ou clustering ?",
    scenario: "Une compagnie d'assurance a trois projets :<br>1) estimer le montant d'un sinistre ;<br>2) dire si un sinistre est frauduleux ou non, à partir de cas passés déjà étiquetés ;<br>3) découvrir des profils de clients sans catégories prédéfinies.<br>Quelle technique pour chacun ?",
    answer: "1) <b>Regression</b> : un montant continu.<br>2) <b>Binary classification</b> : fraude oui/non, avec des données étiquetées.<br>3) <b>Clustering</b> : groupes inconnus, données non étiquetées.",
    why: "Combien → régression. Quelle catégorie → classification. Quels groupes → clustering." },

  { id: "m1-lab3", module: 1, task: "1.2", kind: "scenario", title: "Quel service d'IA managé ?",
    scenario: "Un réseau de cliniques veut :<br>1) transcrire les dictées des médecins ;<br>2) extraire les champs de formulaires d'admission scannés ;<br>3) détecter le sentiment dans les avis patients ;<br>4) proposer un assistant téléphonique pour prendre rendez-vous ;<br>5) lire à voix haute les rappels de rendez-vous.",
    answer: "1) <b>Amazon Transcribe</b> · 2) <b>Amazon Textract</b> · 3) <b>Amazon Comprehend</b> · 4) <b>Amazon Lex</b> · 5) <b>Amazon Polly</b>.",
    why: "Il n'y a qu'un service par verbe : transcrire, extraire, comprendre, dialoguer, parler." },

  { id: "m1-lab4", module: 1, task: "1.3", kind: "scenario", title: "Precision ou recall ?",
    scenario: "Deux modèles :<br>A) un filtre anti-spam pour les e-mails de dirigeants (un vrai e-mail classé spam serait très gênant) ;<br>B) un détecteur de défauts sur des pièces d'avion (une pièce défectueuse non détectée serait catastrophique).<br>Quelle métrique prioriser pour chacun ?",
    answer: "A) <b>Precision</b> : éviter les faux positifs (un bon e-mail envoyé en spam).<br>B) <b>Recall</b> : éviter les faux négatifs (un défaut non détecté).",
    why: "Demandez-vous quelle erreur coûte le plus cher : un faux positif → precision ; un faux négatif → recall." },

  { id: "m1-lab5", module: 1, task: "1.2", kind: "console", title: "TP : analyser un texte avec Amazon Comprehend",
    cost: "Amazon Comprehend est facturé à l'usage (par unité de 100 caractères). L'analyse en temps réel dans la console de quelques phrases coûte au plus quelques centimes, et elle peut entrer dans l'offre gratuite selon votre compte. Vérifiez votre éligibilité Free Tier sur la page de tarification et créez une alerte AWS Budgets avant de commencer.",
    steps: [
      "Connectez-vous à la console AWS et choisissez une région où Comprehend est disponible (ex. us-east-1 ou eu-west-1).",
      "Recherchez « Comprehend » puis ouvrez <b>Real-time analysis</b> (Analyse en temps réel).",
      "Collez un texte en anglais, par exemple : « I love the new AWS course, but the exam registration process was confusing. Contact me at jane@example.com. »",
      "Cliquez sur <b>Analyze</b>.",
      "Parcourez les onglets <b>Entities</b>, <b>Key phrases</b>, <b>Language</b>, <b>PII</b> et <b>Sentiment</b>."
    ],
    expected: "Sentiment <b>MIXED</b> ou proche (positif et négatif à la fois), entités comme « AWS », une adresse e-mail détectée comme <b>PII</b>, langue « en ».",
    why: "C'est la démonstration qu'un service managé fait du NLP sans entraîner de modèle : le profil « Comprehend » des questions d'examen." },

  { id: "m1-lab6", module: 1, task: "1.2", kind: "console", title: "TP : donner une voix à un texte avec Amazon Polly",
    cost: "Amazon Polly est facturé au nombre de caractères synthétisés. Quelques phrases de test coûtent une fraction de centime et peuvent entrer dans l'offre gratuite selon votre compte. Vérifiez la page de tarification.",
    steps: [
      "Dans la console, ouvrez <b>Amazon Polly</b>, puis <b>Text-to-Speech</b>.",
      "Saisissez une phrase en français, puis choisissez une voix française dans la liste.",
      "Comparez le moteur <b>Standard</b> et le moteur <b>Neural</b> si les deux sont proposés pour cette voix.",
      "Cliquez sur <b>Listen</b>."
    ],
    expected: "Vous entendez le texte lu à voix haute. La voix neural est plus naturelle.",
    why: "Polly = texte → parole. Son inverse, c'est Amazon Transcribe (parole → texte)." },

  { id: "m1-lab7", module: 1, task: "1.2", kind: "console", title: "TP : détecter des objets avec Amazon Rekognition",
    cost: "Rekognition est facturé par image analysée. La démo de la console avec quelques images coûte une fraction de centime et peut entrer dans l'offre gratuite. Vérifiez la page de tarification.",
    steps: [
      "Ouvrez <b>Amazon Rekognition</b> dans la console.",
      "Dans le menu, choisissez <b>Label detection</b> (démo).",
      "Utilisez l'image d'exemple ou importez une photo sans personne identifiable.",
      "Observez la liste des labels et leur score de confiance."
    ],
    expected: "Une liste d'étiquettes (ex. « Car », « Road », « Tree ») avec un pourcentage de confiance pour chacune.",
    why: "La computer vision managée est le domaine de Rekognition. Notez le <b>score de confiance</b> : un modèle ML donne une probabilité, pas une certitude." }
];

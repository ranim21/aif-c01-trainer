/* Monde 2 — Exercices pratiques */
window.MODULE_2 = window.MODULE_2 || {};
window.MODULE_2.labs = [
  { id: "m2-lab1", module: 2, task: "2.1", kind: "scenario", title: "Calculer le coût en tokens",
    scenario: "Un assistant reçoit 10 000 requêtes par jour. Chaque requête contient en moyenne 1 500 tokens d'entrée (instructions + documents) et produit 300 tokens de sortie. Avec des <b>prix fictifs</b> de 0,80 $ par million de tokens d'entrée et 3,20 $ par million de tokens de sortie :<br>1) Quel est le coût par jour ?<br>2) Si l'on réduit le contexte à 500 tokens grâce au RAG (seulement les passages utiles), combien économise-t-on ?",
    answer: "1) Entrée : 10 000 × 1 500 = 15 M tokens → 15 × 0,80 = <b>12 $</b>. Sortie : 10 000 × 300 = 3 M tokens → 3 × 3,20 = <b>9,60 $</b>. Total ≈ <b>21,60 $/jour</b>.<br>2) Entrée : 5 M tokens → 4 $. Nouveau total ≈ 13,60 $/jour, soit environ <b>8 $/jour d'économie</b> (≈ 37 %).",
    why: "Coût = tokens × prix, séparément pour l'entrée et la sortie. Réduire le contexte inutile est l'un des leviers les plus efficaces (context engineering)." },

  { id: "m2-lab2", module: 2, task: "2.3", kind: "scenario", title: "Quel service AWS pour quel besoin ?",
    scenario: "Associez chaque besoin à un service :<br>a) Appeler un FM par API sans gérer de serveur.<br>b) Fine-tuner un modèle open source et l'héberger sur des instances choisies.<br>c) Coder un agent en Python avec des outils et un serveur MCP.<br>d) Exécuter cet agent en production avec mémoire, identité et observabilité.<br>e) Permettre à des analystes métier de poser des questions sur leurs données et d'automatiser des tâches sans code.<br>f) Un développeur veut passer d'une spec à du code avec un IDE agentique.",
    answer: "a) <b>Amazon Bedrock</b> · b) <b>Amazon SageMaker AI</b> (avec JumpStart pour démarrer) · c) <b>Strands Agents</b> · d) <b>Amazon Bedrock AgentCore</b> · e) <b>Amazon Quick</b> · f) <b>Kiro</b>.",
    why: "Repérez le profil (développeur, data scientist, métier) et le niveau de contrôle souhaité (managé ou contrôle total)." },

  { id: "m2-lab3", module: 2, task: "2.1", kind: "scenario", title: "Concevoir un système multi-agents",
    scenario: "Une agence de voyage veut un assistant qui : comprend la demande du client, cherche des vols, cherche des hôtels, vérifie le budget, puis propose un package. Il doit se souvenir des préférences du client d'une visite à l'autre. Esquissez l'architecture : quels agents ? quel pattern ? quelle mémoire ? comment connecter les API de réservation ?",
    answer: "• Un <b>agent superviseur</b> (orchestrateur) décompose la demande et assemble la proposition.<br>• Des <b>agents spécialisés</b> : Vols, Hôtels, Budget (pattern <b>supervisor</b>).<br>• <b>Mémoire court terme</b> pour la conversation en cours, <b>long terme</b> pour les préférences (ex. AgentCore Memory).<br>• Les API de réservation sont exposées comme <b>outils</b>, idéalement via des serveurs <b>MCP</b> (ex. AgentCore Gateway).<br>• Une validation humaine avant le paiement (<b>orchestration</b>).",
    why: "C'est l'objectif 2.1.f en action : multi-agents, communication, mémoire, outils, orchestration." },

  { id: "m2-lab4", module: 2, task: "2.2", kind: "scenario", title: "Diagnostiquer la limite",
    scenario: "Nommez la limite de la GenAI dans chaque cas :<br>1) Le chatbot cite un article de loi qui n'existe pas.<br>2) Deux employés posent exactement la même question et obtiennent des réponses formulées différemment.<br>3) Le modèle ignore une réglementation publiée le mois dernier.<br>4) L'auditeur demande pourquoi le modèle a recommandé ce fournisseur, et personne ne peut l'expliquer.",
    answer: "1) <b>Hallucination</b> · 2) <b>Nondeterminism</b> · 3) <b>Inaccuracy</b> (connaissances arrêtées à la date d'entraînement, d'où l'intérêt du RAG) · 4) <b>Interpretability</b>.",
    why: "Ces 4 mots-clés du guide (2.2.b) reviennent souvent dans les questions." },

  { id: "m2-lab5", module: 2, task: "2.2", kind: "console", title: "TP : découvrir un FM dans le playground Amazon Bedrock",
    cost: "Facturation à l'usage, par token. Quelques prompts courts avec un petit modèle (ex. un modèle Amazon Nova « Micro » ou « Lite ») coûtent généralement une fraction de centime. Vérifiez le prix du modèle choisi sur la page de tarification de Bedrock et créez une alerte AWS Budgets avant de commencer.",
    steps: [
      "Ouvrez la console <b>Amazon Bedrock</b> dans une Région où le modèle est disponible (ex. us-east-1).",
      "Si la console le demande, activez l'accès au modèle choisi (section Model access / Model catalog).",
      "Ouvrez <b>Playgrounds → Chat</b> et choisissez un petit modèle (ex. Amazon Nova Micro ou Lite).",
      "Envoyez : « Explique ce qu'est un embedding en 3 phrases simples ». Notez le nombre de tokens d'entrée et de sortie et la latence affichés dans les métriques.",
      "Renvoyez exactement le même prompt deux fois avec une <b>temperature élevée</b> (ex. 1), puis deux fois avec une <b>temperature à 0</b>. Comparez.",
      "Réduisez le paramètre de longueur maximale de sortie et observez la réponse tronquée."
    ],
    expected: "Avec une temperature élevée, les réponses varient davantage (<b>non-déterminisme</b>). À 0, elles sont beaucoup plus stables. Les métriques montrent que davantage de tokens de sortie entraîne plus de latence et plus de coût.",
    why: "Vous voyez en vrai la tarification au token (2.1.d), le non-déterminisme (2.2.b) et l'effet des paramètres d'inférence (3.1.b)." },

  { id: "m2-lab6", module: 2, task: "2.2", kind: "console", title: "TP : comparer deux modèles (mode Compare)",
    cost: "Chaque comparaison facture les tokens des deux modèles. Restez sur 2 ou 3 prompts courts et de petits modèles.",
    steps: [
      "Dans <b>Playgrounds → Chat</b>, activez le mode <b>Compare</b> (comparaison côte à côte) si disponible.",
      "Choisissez deux modèles de tailles différentes (ex. un petit et un plus grand).",
      "Envoyez le même prompt : « Résume en 2 phrases les avantages du cloud pour une PME ».",
      "Comparez la qualité, la <b>latence</b> et le <b>nombre de tokens</b> de chaque modèle."
    ],
    expected: "Le plus petit modèle répond généralement plus vite et coûte moins cher. Le plus grand est parfois plus nuancé. Pour beaucoup de tâches simples, le petit modèle suffit.",
    why: "Illustration directe de 2.2.c : choisir le plus petit modèle qui satisfait les exigences." }
];

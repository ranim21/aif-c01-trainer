/* Monde 2 — Fundamentals of GenAI (24 %) — Cours + flashcards */
window.MODULE_2 = window.MODULE_2 || {};
window.MODULE_2.course = {
  intro: "Bienvenue dans le Royaume GenAI ! Ici, on apprend comment fonctionnent les modèles génératifs (tokens, embeddings, transformers), leurs forces et leurs limites, et les services AWS pour construire des applications GenAI et des agents. C'est 24 % de l'examen.",
  sections: [
    /* ======================= 2.1 ======================= */
    { task: "2.1", obj: ["2.1.a"], title: "Tokens, chunking, embeddings et vecteurs", blocks: [
      { type: "table", head: ["Concept", "Définition simple", "À retenir"], rows: [
        ["<b>Token</b>", "Unité de texte traitée par le modèle : un mot, un morceau de mot ou un signe de ponctuation.", "Les modèles lisent et écrivent des tokens. La taille du contexte, les limites et le <b>prix</b> sont exprimés en tokens."],
        ["<b>Context window</b> (fenêtre de contexte)", "Nombre maximal de tokens (entrée + sortie) que le modèle peut traiter en une fois.", "Au-delà, il faut résumer, découper ou sélectionner l'information."],
        ["<b>Chunking</b> (découpage)", "Découper de longs documents en <b>morceaux</b> (chunks) avant de les vectoriser.", "Indispensable pour le RAG : on retrouve et on envoie au modèle seulement les passages pertinents. Stratégies : taille fixe, hiérarchique, sémantique…"],
        ["<b>Embedding</b>", "Représentation <b>numérique</b> d'un texte (ou d'une image) sous forme de vecteur, qui capture son <b>sens</b>.", "Deux textes de sens proche → vecteurs proches. Exemples de modèles : Amazon Titan Text Embeddings, Cohere Embed."],
        ["<b>Vector</b> / vector database", "Liste de nombres (des centaines ou des milliers de dimensions), stockée dans une base capable de rechercher les plus proches voisins.", "C'est la base de la <b>recherche sémantique</b> (par le sens, pas par mot-clé)."]
      ]},
      { type: "diagram", id: "embeddings" },
      { type: "analogy", text: "Les embeddings placent chaque phrase sur une immense carte : « chat » et « félin » sont voisins, « chat » et « facture » sont loin. Chercher par le sens, c'est chercher les voisins sur la carte." },
      { type: "trap", items: [
        "Un embedding n'est <b>pas</b> un résumé lisible : c'est un vecteur de nombres.",
        "Le chunking sert à la <b>recherche</b> (RAG). Il ne modifie pas le modèle et n'a rien à voir avec le fine-tuning."
      ]}
    ]},
    { task: "2.1", obj: ["2.1.a"], title: "Transformers, LLM, FM, multimodal et diffusion", blocks: [
      { type: "table", head: ["Terme", "Ce que c'est"], rows: [
        ["<b>Foundation model (FM)</b>", "Très grand modèle <b>pré-entraîné</b> sur des données massives et variées, adaptable à de nombreuses tâches (via prompting, RAG ou fine-tuning)."],
        ["<b>Transformer</b>", "Architecture de réseau de neurones fondée sur le mécanisme d'<b>attention</b> (self-attention) : chaque token « regarde » les autres pour comprendre le contexte. Elle traite les tokens <b>en parallèle</b>, ce qui permet d'entraîner de très grands modèles."],
        ["<b>LLM</b> (Large Language Model)", "FM spécialisé dans le langage. Il génère du texte en prédisant le <b>token suivant</b>, encore et encore."],
        ["<b>Multimodal model</b>", "Modèle qui accepte et/ou produit <b>plusieurs types</b> de données : texte, image, audio, vidéo (ex. décrire une photo, répondre à une question sur un graphique)."],
        ["<b>Diffusion model</b>", "Modèle de génération (surtout d'<b>images</b>) qui part de bruit aléatoire et le <b>débruite</b> progressivement jusqu'à obtenir une image correspondant au prompt."],
        ["<b>Prompt engineering</b>", "Art de formuler les instructions (prompt) pour obtenir de meilleures réponses, <b>sans modifier le modèle</b>. Détails au Monde 3."]
      ]},
      { type: "tip", text: "Texte → Transformer (LLM). Image depuis du bruit → Diffusion. Plusieurs types d'entrées/sorties → Multimodal." },
      { type: "trap", items: ["Un LLM ne « cherche » pas dans une base de données : il génère token par token à partir de ce qu'il a appris. D'où les hallucinations (voir 2.2)."] }
    ]},
    { task: "2.1", obj: ["2.1.b"], title: "Cas d'usage de la GenAI", blocks: [
      { type: "table", head: ["Cas d'usage", "Exemple"], rows: [
        ["Génération d'images, de vidéos, d'audio", "Visuels marketing, maquettes, voix off"],
        ["<b>Summarization</b> (résumé)", "Résumer des contrats, des comptes rendus, des appels"],
        ["AI assistants", "Copilote interne qui répond aux questions des employés"],
        ["Translation", "Localiser un site ou des fiches produits"],
        ["Code generation", "Générer, expliquer ou convertir du code"],
        ["Customer service agents", "Agent qui répond 24h/24 et effectue des actions (suivi de commande)"],
        ["Search", "Recherche <b>sémantique</b> dans des documents (par le sens)"],
        ["Recommendation engines", "Recommandations expliquées en langage naturel"]
      ]},
      { type: "trap", items: ["La GenAI <b>crée</b> du contenu. Un calcul exact (paie, taxe) n'est pas un bon cas d'usage GenAI."] }
    ]},
    { task: "2.1", obj: ["2.1.c"], title: "Le cycle de vie d'un foundation model", blocks: [
      { type: "list", items: [
        "<b>1. Data selection</b> : choisir et préparer des données massives, variées et de qualité.",
        "<b>2. Model selection</b> : choisir l'architecture ou un modèle existant adapté au besoin.",
        "<b>3. Pre-training</b> : entraînement initial (souvent auto-supervisé) sur des données gigantesques. C'est l'étape <b>la plus coûteuse</b> (des milliers de GPU, des semaines).",
        "<b>4. Fine-tuning</b> : adapter le modèle à une tâche ou à un domaine avec des données plus ciblées.",
        "<b>5. Evaluation</b> : mesurer la qualité, la sûreté et les biais (benchmarks, humains, métriques).",
        "<b>6. Deployment</b> : rendre le modèle disponible (API, endpoint).",
        "<b>7. Feedback</b> : collecter les retours des utilisateurs pour améliorer le modèle (nouvelles données, RLHF, nouvelle version). La boucle recommence."
      ]},
      { type: "tip", text: "« <b>D</b>es <b>M</b>odèles <b>P</b>uissants <b>F</b>ont <b>É</b>voluer <b>D</b>es <b>F</b>ormations » : Data, Model, Pre-train, Fine-tune, Evaluate, Deploy, Feedback." }
    ]},
    { task: "2.1", obj: ["2.1.d"], title: "La tarification au token", blocks: [
      { type: "p", text: "Sur Amazon Bedrock en mode <b>on-demand</b>, les modèles de texte sont généralement facturés par <b>tokens d'entrée</b> (le prompt et le contexte) et par <b>tokens de sortie</b> (la réponse), avec des tarifs différents. Les tokens de sortie sont souvent plus chers." },
      { type: "table", head: ["Levier", "Effet sur le coût", "Effet sur la performance"], rows: [
        ["Prompt plus long (contexte, exemples)", "↑ tokens d'entrée", "↑ latence. Qualité souvent meilleure si le contexte est pertinent"],
        ["Réponse plus longue (max tokens élevé)", "↑ tokens de sortie", "↑ latence (génération token par token)"],
        ["Modèle plus grand", "↑ prix par token", "Souvent meilleure qualité, mais plus lent"],
        ["Batch inference", "Prix réduit par rapport à l'on-demand pour les modèles éligibles", "Pas de réponse immédiate"],
        ["Prompt caching", "Les tokens d'un préfixe de prompt réutilisé, lus depuis le cache, sont facturés moins cher", "↓ latence sur les prompts répétitifs"]
      ]},
      { type: "trap", items: ["Ajouter des exemples (few-shot) ou de longs documents dans le prompt améliore souvent la qualité, mais <b>augmente le coût et la latence</b>. C'est un compromis."] }
    ]},
    { task: "2.1", obj: ["2.1.e"], title: "Le context engineering", blocks: [
      { type: "p", text: "Le <b>context engineering</b>, c'est l'art de concevoir et de gérer <b>tout ce qui entre dans la fenêtre de contexte</b> du modèle à chaque appel, pas seulement la question de l'utilisateur." },
      { type: "list", title: "Ce que contient le contexte :", items: [
        "Les <b>instructions système</b> (rôle, règles, format attendu).",
        "Les <b>documents récupérés</b> (RAG) : seulement les passages pertinents.",
        "L'<b>historique de conversation</b>, éventuellement résumé.",
        "La <b>mémoire</b> (préférences de l'utilisateur, faits importants).",
        "Les <b>définitions d'outils</b> et les <b>résultats</b> des appels d'outils (agents)."
      ]},
      { type: "list", title: "Bonnes pratiques :", items: [
        "<b>Sélectionner</b> : ne mettre que ce qui est utile (le bruit dégrade les réponses et coûte des tokens).",
        "<b>Compresser</b> : résumer les anciens échanges, plutôt que tout renvoyer.",
        "<b>Structurer</b> : séparer clairement instructions, données et question.",
        "<b>Rester sous la limite</b> de la fenêtre de contexte."
      ]},
      { type: "analogy", text: "Le modèle est un expert qui n'a <b>aucune mémoire</b> entre deux appels. Le context engineering, c'est préparer le dossier parfait à lui remettre à chaque fois : complet, mais sans papiers inutiles." },
      { type: "trap", items: ["Le context engineering ne modifie <b>pas</b> les poids du modèle (≠ fine-tuning)."] }
    ]},
    { task: "2.1", obj: ["2.1.f"], title: "Agentic AI : outils, mémoire, MCP, multi-agents", blocks: [
      { type: "diagram", id: "agentloop" },
      { type: "table", head: ["Concept", "À retenir"], rows: [
        ["<b>Agent</b>", "Système qui poursuit un objectif en boucle : <b>raisonner → agir (outil) → observer → recommencer</b>, jusqu'à ce que la tâche soit accomplie."],
        ["<b>Tool usage</b> (outils)", "L'agent appelle des API, des fonctions (ex. AWS Lambda) ou des bases de données pour agir sur le monde réel ou obtenir des données fraîches."],
        ["<b>Memory management</b>", "<b>Court terme</b> : le contexte de la session ou de la conversation en cours. <b>Long terme</b> : faits et préférences conservés <b>entre les sessions</b>."],
        ["<b>Workflow orchestration</b>", "Coordonner l'enchaînement des étapes, les reprises sur erreur et les validations humaines. Il peut être <b>déterministe</b> (étapes fixes) ou <b>dynamique</b> (l'agent décide)."],
        ["<b>MCP</b> (Model Context Protocol)", "<b>Protocole ouvert et standard</b> qui permet aux applications et aux agents IA de se connecter de façon uniforme à des <b>outils et des sources de données externes</b>, exposés par des « serveurs MCP ». On écrit l'intégration une fois et tout agent compatible MCP peut l'utiliser."],
        ["<b>Multi-agent system</b>", "Plusieurs agents spécialisés collaborent sur une tâche complexe."]
      ]},
      { type: "table", head: ["Pattern multi-agents", "Fonctionnement"], rows: [
        ["<b>Supervisor / orchestrator</b> (hiérarchique)", "Un agent superviseur décompose la tâche, délègue aux agents spécialisés et combine les résultats."],
        ["<b>Sequential / workflow</b>", "Les agents travaillent à la chaîne, la sortie de l'un étant l'entrée du suivant."],
        ["<b>Graph</b>", "Les agents sont des nœuds reliés par des transitions conditionnelles."],
        ["<b>Swarm</b> (essaim)", "Des agents pairs collaborent et se passent la main de façon autonome."],
        ["<b>Agents as tools</b>", "Un agent en appelle un autre comme s'il s'agissait d'un outil."]
      ]},
      { type: "p", text: "<b>Communication entre agents</b> : hiérarchique (via le superviseur), pair à pair (messages directs) ou via une mémoire partagée. Des protocoles comme <b>A2A</b> (Agent-to-Agent) standardisent la communication entre agents, tandis que MCP standardise l'accès aux outils." },
      { type: "analogy", text: "MCP, c'est le <b>port USB-C</b> de l'IA : une prise standard pour brancher n'importe quel outil sur n'importe quel agent compatible." },
      { type: "trap", items: [
        "MCP connecte un agent à des <b>outils et des données</b>. Ce n'est ni un modèle, ni un service de stockage, ni une méthode d'entraînement.",
        "La mémoire long terme d'un agent est <b>stockée à l'extérieur</b> du modèle. Elle ne réentraîne pas ses poids."
      ]}
    ]},
    /* ======================= 2.2 ======================= */
    { task: "2.2", obj: ["2.2.a"], title: "Les avantages de la GenAI", blocks: [
      { type: "table", head: ["Avantage", "Explication"], rows: [
        ["<b>Adaptability</b>", "Un même FM sait résumer, traduire, classer, rédiger… sans un modèle par tâche."],
        ["<b>Responsiveness</b>", "Des réponses en quelques secondes, 24h/24, à grande échelle."],
        ["<b>Conversational capabilities</b>", "Interaction naturelle en langage courant, avec gestion du contexte."],
        ["<b>Content generation</b>", "Création rapide de texte, d'images et de code, pour la productivité et la personnalisation."],
        ["Simplicité", "Souvent utilisable par simple prompt, sans collecter un grand dataset étiqueté."]
      ]}
    ]},
    { task: "2.2", obj: ["2.2.b"], title: "Les limites de la GenAI", blocks: [
      { type: "table", head: ["Limite", "Définition", "Atténuation"], rows: [
        ["<b>Hallucinations</b>", "Réponse plausible et sûre d'elle, mais <b>fausse ou inventée</b>.", "RAG (ancrage sur des sources), contextual grounding check de Guardrails, validation humaine"],
        ["<b>Interpretability</b>", "Difficile d'expliquer <b>pourquoi</b> le modèle a produit telle réponse (boîte noire).", "Citations de sources, documentation, modèles plus simples si l'explication est exigée"],
        ["<b>Inaccuracy</b>", "Erreurs factuelles, connaissances arrêtées à la date d'entraînement (knowledge cutoff).", "RAG avec données à jour, outils"],
        ["<b>Nondeterminism</b>", "Le même prompt peut donner des réponses <b>différentes</b> (échantillonnage).", "Temperature basse, prompts précis, tests de régression"],
        ["Autres", "Biais, toxicité, coût, latence, risques juridiques (Monde 4).", "Guardrails, évaluation, gouvernance"]
      ]},
      { type: "trap", items: [
        "Une réponse qui <b>varie</b> d'un appel à l'autre = nondeterminism, pas une hallucination.",
        "Une réponse <b>inventée</b> présentée comme vraie = hallucination."
      ]}
    ]},
    { task: "2.2", obj: ["2.2.c"], title: "Choisir un modèle GenAI", blocks: [
      { type: "table", head: ["Critère", "Questions à se poser"], rows: [
        ["Model type / capabilities", "Texte, image, multimodal, embeddings ? Raisonnement, code, langues ?"],
        ["Performance requirements", "Qualité minimale attendue sur VOS cas de test ?"],
        ["Latency", "Temps réel (voix, chat) → modèle plus petit et rapide"],
        ["Cost", "Prix par token × volume prévu"],
        ["Constraints", "Taille de la fenêtre de contexte, longueur de sortie, disponibilité dans la Région"],
        ["Compliance", "Résidence des données, secteur réglementé, licence du modèle"],
        ["Model complexity", "Un modèle plus gros n'est pas toujours nécessaire : choisissez le plus petit qui atteint la qualité requise"]
      ]},
      { type: "tip", text: "Le bon modèle est le <b>plus petit et le moins cher qui satisfait vos exigences</b> de qualité, de latence et de conformité, pas le plus gros." }
    ]},
    { task: "2.2", obj: ["2.2.d"], title: "Valeur business et métriques", blocks: [
      { type: "table", head: ["Métrique", "Signification"], rows: [
        ["<b>ROI</b>", "Gain obtenu ÷ coût investi"],
        ["<b>Efficiency</b>", "Temps gagné, tâches automatisées, productivité"],
        ["<b>Conversion rate</b>", "% de visiteurs qui réalisent l'action visée (achat, inscription)"],
        ["<b>ARPU</b> (Average Revenue Per User)", "Revenu moyen par utilisateur sur une période"],
        ["<b>CLV</b> (Customer Lifetime Value)", "Revenu total attendu d'un client sur toute sa relation avec l'entreprise"],
        ["<b>Accuracy</b>", "Part de réponses correctes, du point de vue métier"],
        ["<b>Cross-domain performance</b>", "Capacité du modèle à bien performer sur des tâches ou des domaines variés"]
      ]},
      { type: "trap", items: ["BLEU, ROUGE et la perplexité mesurent la qualité <b>technique</b> du texte. Pour un impact business, regardez la conversion, l'ARPU, la CLV ou le ROI."] }
    ]},
    /* ======================= 2.3 ======================= */
    { task: "2.3", obj: ["2.3.a"], title: "Les services AWS pour construire de la GenAI", blocks: [
      { type: "table", head: ["Service", "Rôle", "Quand le choisir"], rows: [
        ["<b>Amazon Bedrock</b>", "Service <b>serverless</b> donnant accès, via une API unique, à des FM de plusieurs fournisseurs (Amazon Nova, et des modèles tiers). Il inclut Knowledge Bases (RAG), Agents, Guardrails, Model Evaluation, Prompt Management, la personnalisation et des playgrounds.", "Ajouter de la GenAI sans gérer d'infrastructure"],
        ["<b>Amazon Nova</b>", "Famille de FM conçus par Amazon, disponibles dans Bedrock : modèles de compréhension (texte, multimodal) et modèles créatifs (images, vidéo), voix…", "Bon rapport qualité/prix/latence dans Bedrock"],
        ["<b>Amazon SageMaker AI</b>", "Plateforme ML complète : entraîner, fine-tuner et héberger ses propres modèles, avec un contrôle total de l'infrastructure.", "Besoin de contrôle fin, de modèles custom, d'équipes ML"],
        ["<b>SageMaker JumpStart</b>", "Hub de modèles pré-entraînés (dont des FM open source) à déployer ou fine-tuner en quelques clics.", "Démarrer vite avec un modèle open source sur SageMaker AI"],
        ["<b>Amazon Quick</b>", "Espace de travail agentique pour les équipes métier : BI, recherche, automatisation de workflows.", "Utilisateurs métier sans code"],
        ["<b>Kiro</b>", "IDE agentique d'AWS, développement guidé par les spécifications.", "Développeurs qui codent avec l'IA"],
        ["<b>Strands Agents</b>", "SDK <b>open source</b> d'AWS pour construire des agents (Python, TypeScript) avec une approche « model-driven » : on fournit un modèle, un prompt et des outils. Il prend en charge MCP et les patterns multi-agents.", "Coder ses propres agents"],
        ["<b>Amazon Bedrock AgentCore</b>", "Plateforme pour <b>déployer et opérer des agents</b> en production, de façon sécurisée et à l'échelle, avec n'importe quel framework et n'importe quel modèle. Services modulaires : Runtime, Memory, Gateway (outils MCP), Identity, Policy, Code Interpreter, Browser, Observability, Evaluations…", "Passer un agent en production sans gérer d'infrastructure"],
        ["<b>AWS Transform</b>", "Service agentique qui aide à migrer et moderniser des applications existantes (ex. .NET, mainframe, VMware).", "Modernisation d'applications"]
      ]},
      { type: "tip", text: "Strands = <b>construire</b> l'agent (le code). AgentCore = le <b>faire tourner</b> en production (runtime, mémoire, identité, observabilité). Bedrock = les <b>modèles</b>." },
      { type: "trap", items: [
        "Bedrock = FM managés et serverless. SageMaker AI = contrôle total (vous gérez les instances).",
        "AgentCore fonctionne avec <b>n'importe quel framework</b> (Strands, LangGraph, CrewAI…) et <b>n'importe quel modèle</b>, pas uniquement Bedrock."
      ]}
    ]},
    { task: "2.3", obj: ["2.3.b"], title: "Pourquoi utiliser les services GenAI d'AWS", blocks: [
      { type: "list", items: [
        "<b>Accessibility</b> : les FM sont accessibles par simple appel d'API.",
        "<b>Lower barrier to entry</b> : pas besoin d'expertise en infrastructure ML ni de GPU.",
        "<b>Efficiency</b> : services managés, mise à l'échelle automatique.",
        "<b>Cost-effectiveness</b> : paiement à l'usage, pas d'achat de matériel.",
        "<b>Speed to market</b> : prototype en jours au lieu de mois.",
        "<b>Ability to meet business objectives</b> : choix entre de nombreux modèles, personnalisation possible."
      ]}
    ]},
    { task: "2.3", obj: ["2.3.c"], title: "Bénéfices de l'infrastructure AWS : sécurité, conformité, responsabilité", blocks: [
      { type: "list", items: [
        "<b>Security</b> : chiffrement en transit et au repos (AWS KMS), contrôle d'accès avec IAM, connectivité privée via VPC endpoints (AWS PrivateLink).",
        "<b>Confidentialité dans Amazon Bedrock</b> : vos prompts et réponses ne sont pas utilisés pour entraîner les modèles de base et ne sont pas partagés avec les fournisseurs de modèles.",
        "<b>Compliance</b> : AWS dispose de nombreux programmes de conformité (ISO, SOC…). Les rapports sont téléchargeables via AWS Artifact (Monde 5).",
        "<b>Responsibility</b> : <b>modèle de responsabilité partagée</b>. AWS sécurise le cloud (infrastructure), le client sécurise ce qu'il fait <b>dans</b> le cloud (données, accès IAM, configuration, usage des modèles).",
        "<b>Safety</b> : outils d'IA responsable comme Amazon Bedrock Guardrails.",
        "Puces conçues par AWS pour le ML (AWS Trainium pour l'entraînement, AWS Inferentia pour l'inférence), pour un meilleur rapport coût/performance."
      ]},
      { type: "trap", items: ["Utiliser AWS ne rend pas <b>automatiquement</b> votre application conforme : la configuration, les données et les accès restent votre responsabilité."] }
    ]},
    { task: "2.3", obj: ["2.3.d"], title: "Compromis de coût des services GenAI", blocks: [
      { type: "table", head: ["Option", "Principe", "Idéal pour"], rows: [
        ["<b>On-demand</b>", "Paiement par token, sans engagement", "Trafic variable, prototypes"],
        ["<b>Batch inference</b>", "Traitement en lot asynchrone, prix réduit pour les modèles éligibles", "Gros volumes non urgents"],
        ["<b>Provisioned Throughput</b>", "Capacité <b>réservée</b> (unités de modèle facturées à l'heure, avec ou sans engagement selon les modèles)", "Débit élevé et constant garanti. Souvent utilisé pour servir des modèles personnalisés"],
        ["<b>Cross-region inference</b>", "Bedrock répartit automatiquement les requêtes sur plusieurs Régions", "Meilleur débit et meilleure disponibilité lors de pics de charge"],
        ["<b>Custom models</b>", "Coût d'entraînement (tokens × epochs) + stockage mensuel + inférence", "Quand le prompting et le RAG ne suffisent pas"]
      ]},
      { type: "list", title: "Autres compromis :", items: [
        "<b>Responsiveness</b> : un modèle plus rapide, ou une capacité réservée, coûte plus cher.",
        "<b>Availability / redundancy</b> : plusieurs Régions ou une capacité de secours augmentent la résilience… et le coût.",
        "<b>Regional coverage</b> : tous les modèles ne sont pas disponibles dans toutes les Régions, ce qui a un impact sur la conformité et la latence.",
        "<b>Model size</b> : un modèle plus grand coûte plus cher par token et répond plus lentement."
      ]},
      { type: "trap", items: ["Provisioned Throughput = débit <b>garanti</b> (on paie la capacité, même inutilisée). On-demand = on paie seulement ce qu'on consomme."] }
    ]}
  ],
  flashcards: [
    { front: "Token", back: "Unité de texte (mot ou morceau de mot) traitée par un modèle. Base du prix et des limites." },
    { front: "Context window", back: "Nombre maximal de tokens (entrée + sortie) traités en une fois." },
    { front: "Chunking", back: "Découper des documents en morceaux avant de les vectoriser (RAG)." },
    { front: "Embedding", back: "Vecteur numérique qui capture le sens d'un texte ou d'une image." },
    { front: "Transformer", back: "Architecture fondée sur la self-attention, qui traite les tokens en parallèle." },
    { front: "Diffusion model", back: "Génère des images en débruitant progressivement du bruit aléatoire." },
    { front: "Multimodal model", back: "Accepte ou produit plusieurs types de données (texte, image, audio…)." },
    { front: "Foundation model", back: "Grand modèle pré-entraîné sur des données massives, adaptable à de nombreuses tâches." },
    { front: "Pre-training", back: "Étape la plus coûteuse du cycle de vie d'un FM." },
    { front: "Context engineering", back: "Concevoir tout ce qui entre dans la fenêtre de contexte : instructions, documents, historique, mémoire, outils." },
    { front: "MCP", back: "Protocole ouvert pour connecter des agents et applications IA à des outils et données externes (« USB-C de l'IA »)." },
    { front: "Supervisor pattern", back: "Un agent superviseur délègue des sous-tâches à des agents spécialisés." },
    { front: "Mémoire court terme vs long terme", back: "Court terme : la session en cours. Long terme : conservée entre les sessions." },
    { front: "Hallucination", back: "Réponse plausible mais fausse ou inventée." },
    { front: "Nondeterminism", back: "Le même prompt peut donner des réponses différentes." },
    { front: "Interpretability (limite)", back: "Difficile d'expliquer pourquoi le FM a produit une réponse." },
    { front: "CLV", back: "Customer Lifetime Value : revenu total attendu d'un client." },
    { front: "ARPU", back: "Average Revenue Per User : revenu moyen par utilisateur." },
    { front: "Amazon Bedrock", back: "FM de plusieurs fournisseurs via une API unique, serverless." },
    { front: "Strands Agents", back: "SDK open source d'AWS pour construire des agents (model-driven, MCP, multi-agents)." },
    { front: "Amazon Bedrock AgentCore", back: "Plateforme pour déployer et opérer des agents : Runtime, Memory, Gateway, Identity, Policy, Observability…" },
    { front: "Provisioned Throughput", back: "Capacité réservée et débit garanti, facturés à l'heure." },
    { front: "Batch inference (Bedrock)", back: "Traitement en lot asynchrone, moins cher que l'on-demand pour les modèles éligibles." },
    { front: "Cross-region inference", back: "Répartit les requêtes sur plusieurs Régions pour plus de débit et de disponibilité." },
    { front: "Données dans Bedrock", back: "Non utilisées pour entraîner les modèles de base, non partagées avec les fournisseurs." }
  ]
};

/* Monde 3 — Applications of Foundation Models (28 %) — Cours + flashcards */
window.MODULE_3 = window.MODULE_3 || {};
window.MODULE_3.course = {
  intro: "La Forteresse des Foundation Models est le plus gros monde de l'examen (28 %). Vous y apprenez à concevoir une application à base de FM : choix du modèle, paramètres d'inférence, RAG, bases vectorielles, agents, prompt engineering, fine-tuning et évaluation.",
  sections: [
    /* ======================= 3.1 ======================= */
    { task: "3.1", obj: ["3.1.a"], title: "Choisir un foundation model", blocks: [
      { type: "table", head: ["Critère", "Ce qu'il faut regarder"], rows: [
        ["<b>Cost</b>", "Prix par token (entrée et sortie), volume prévu, options batch ou provisioned"],
        ["<b>Modality</b>", "Texte, image, audio, vidéo, embeddings, multimodal ?"],
        ["<b>Latency</b>", "Temps de réponse acceptable (temps réel ou différé)"],
        ["<b>Multi-lingual</b>", "Langues prises en charge, qualité dans la langue visée"],
        ["<b>Model size / complexity</b>", "Plus gros = souvent plus capable, mais plus lent et plus cher"],
        ["<b>Customization</b>", "Le modèle peut-il être fine-tuné ou distillé dans Bedrock ?"],
        ["<b>Input/output length</b>", "Taille de la <b>fenêtre de contexte</b> et longueur maximale de sortie"],
        ["<b>Prompt caching</b>", "Le modèle permet-il de mettre en cache un long préfixe de prompt réutilisé (instructions, document) ? Cela réduit le coût et la latence des requêtes répétitives."]
      ]},
      { type: "trap", items: ["Si l'énoncé parle d'un <b>long contexte identique</b> réutilisé à chaque requête (même document, mêmes instructions), pensez <b>prompt caching</b>."] }
    ]},
    { task: "3.1", obj: ["3.1.b"], title: "Les paramètres d'inférence", blocks: [
      { type: "table", head: ["Paramètre", "Effet", "Valeur basse ↔ haute"], rows: [
        ["<b>Temperature</b>", "Contrôle l'aléatoire de la génération", "Basse : réponses précises, cohérentes, répétables. Haute : réponses créatives, variées (et plus de risque d'erreurs)"],
        ["<b>Top P</b> (nucleus sampling)", "Ne garde que les tokens dont la probabilité cumulée atteint P", "Bas : vocabulaire restreint, plus sûr. Haut : plus de diversité"],
        ["<b>Top K</b>", "Ne garde que les K tokens les plus probables", "Petit K : plus conservateur. Grand K : plus varié"],
        ["<b>Maximum length</b> (max tokens)", "Limite la longueur de la réponse", "Contrôle le coût et la latence. Trop bas = réponse tronquée"],
        ["<b>Stop sequences</b>", "Chaînes qui arrêtent la génération", "Ex. arrêter au premier « \\n\\n » ou à « Human: »"],
        ["<b>Input length</b>", "Taille du prompt et du contexte envoyés", "Plus long = plus cher et plus lent, mais parfois plus précis"]
      ]},
      { type: "tip", text: "Factuel, conformité, extraction → <b>temperature basse</b>. Brainstorming, slogans, histoires → <b>temperature plus haute</b>." },
      { type: "trap", items: [
        "La temperature ne rend pas le modèle « plus intelligent » et ne corrige pas les hallucinations : elle règle seulement la variabilité.",
        "Les paramètres d'inférence ne modifient pas les poids du modèle (≠ fine-tuning)."
      ]}
    ]},
    { task: "3.1", obj: ["3.1.c"], title: "RAG (Retrieval Augmented Generation)", blocks: [
      { type: "diagram", id: "rag" },
      { type: "list", title: "Fonctionnement :", items: [
        "<b>Ingestion</b> : les documents sont découpés (chunking), convertis en embeddings et stockés dans une base vectorielle.",
        "<b>Retrieval</b> : la question de l'utilisateur est convertie en embedding, puis on récupère les chunks les plus proches.",
        "<b>Augmentation</b> : ces passages sont ajoutés au prompt.",
        "<b>Generation</b> : le FM répond en s'appuyant sur ces passages, avec citation des sources possible."
      ]},
      { type: "table", head: ["Avantages du RAG", "Exemples d'applications business"], rows: [
        ["Réponses à jour sans réentraîner le modèle", "Assistant RH sur les politiques internes"],
        ["Moins d'hallucinations (ancrage, ou <i>grounding</i>)", "Support client sur la documentation produit"],
        ["Citations des sources, donc traçabilité", "Recherche juridique ou réglementaire"],
        ["Données privées gardées hors du modèle", "Base de connaissances technique"]
      ]},
      { type: "p", text: "<b>Amazon Bedrock Knowledge Bases</b> gère tout le pipeline RAG : connexion aux sources (ex. Amazon S3), chunking, embeddings, stockage vectoriel, récupération et génération avec citations." },
      { type: "trap", items: [
        "Données qui changent souvent ou documents privés → <b>RAG</b>, pas fine-tuning.",
        "Le RAG ne modifie pas le modèle : il enrichit le <b>prompt</b>."
      ]}
    ]},
    { task: "3.1", obj: ["3.1.d"], title: "Bases vectorielles sur AWS", blocks: [
      { type: "table", head: ["Service", "À retenir"], rows: [
        ["<b>Amazon OpenSearch Service</b> (dont OpenSearch Serverless)", "Recherche vectorielle (k-NN) et recherche par mots-clés (hybride). Choix très courant pour Bedrock Knowledge Bases."],
        ["<b>Amazon Aurora</b> (PostgreSQL, extension pgvector)", "Stocker des vecteurs dans une base relationnelle existante"],
        ["<b>Amazon RDS for PostgreSQL</b> (pgvector)", "Même extension pgvector, sur RDS"],
        ["<b>Amazon Neptune</b> (Neptune Analytics)", "Base de graphes avec recherche vectorielle : <b>GraphRAG</b> (relations entre entités)"],
        ["<b>Amazon S3 Vectors</b>", "Stockage vectoriel économique dans S3, pour des requêtes peu fréquentes"],
        ["Autres (avec Bedrock Knowledge Bases)", "Amazon DocumentDB, MongoDB Atlas, Pinecone, Redis…"]
      ]},
      { type: "tip", text: "« pgvector » → Aurora PostgreSQL / RDS for PostgreSQL. « Graphe de relations » → Neptune. « Recherche hybride, k-NN, serverless » → OpenSearch." },
      { type: "trap", items: ["Amazon DynamoDB, Redshift et S3 « classique » ne sont pas les réponses attendues quand on demande une <b>base vectorielle</b> pour un RAG."] }
    ]},
    { task: "3.1", obj: ["3.1.e"], title: "Coût des approches de personnalisation", blocks: [
      { type: "diagram", id: "customcost" },
      { type: "table", head: ["Approche", "Ce qui change", "Coût / effort", "Quand"], rows: [
        ["<b>Prompt engineering / in-context learning</b>", "Seulement le prompt (instructions, exemples)", "€ (le plus bas)", "Toujours commencer par là"],
        ["<b>RAG</b>", "Le prompt est enrichi avec vos données récupérées", "€€ (base vectorielle + embeddings)", "Données privées, à jour, citations"],
        ["<b>Fine-tuning</b>", "Les <b>poids</b> du modèle, à partir de données étiquetées", "€€€ (entraînement + stockage + souvent capacité dédiée)", "Style, format, tâche spécifique"],
        ["<b>Model distillation</b>", "Un petit modèle « élève » apprend d'un grand modèle « enseignant »", "€€ à €€€ (une fois), puis inférence moins chère", "Réduire coût et latence en gardant la qualité"],
        ["<b>Continued pre-training</b>", "Poids, à partir de grandes quantités de données non étiquetées du domaine", "€€€€", "Vocabulaire d'un domaine très spécialisé"],
        ["<b>Pre-training</b> (de zéro)", "Tout le modèle", "€€€€€ (énorme)", "Très rare : seulement si aucun FM ne convient"]
      ]},
      { type: "tip", text: "Ordre du moins au plus cher : Prompt → RAG → Fine-tuning → Continued pre-training → Pre-training." }
    ]},
    { task: "3.1", obj: ["3.1.f"], title: "Les agents IA et leurs applications business", blocks: [
      { type: "p", text: "Un <b>agent</b> utilise un FM pour <b>raisonner</b>, décomposer une demande en étapes, <b>appeler des outils</b> (API, fonctions Lambda, bases de connaissances) et <b>agir</b> pour atteindre un objectif." },
      { type: "table", head: ["Brique AWS", "Rôle"], rows: [
        ["<b>Amazon Bedrock Agents</b>", "Agents managés dans Bedrock : instructions, <b>action groups</b> (API / Lambda à appeler), Knowledge Bases, mémoire, collaboration multi-agents"],
        ["<b>Strands Agents</b>", "SDK open source pour coder ses agents"],
        ["<b>Amazon Bedrock AgentCore</b>", "Exécuter et opérer les agents en production (Runtime, Memory, Gateway, Identity, Policy, Observability…)"]
      ]},
      { type: "list", title: "Applications business :", items: [
        "Service client qui <b>agit</b> : suivi de commande, remboursement, modification de réservation.",
        "Automatisation de processus métier : traitement de dossiers, d'achats, de RH.",
        "Assistants internes : recherche dans les documents + actions dans les outils.",
        "Assistance au code, analyse de données."
      ]},
      { type: "trap", items: ["Si la solution doit <b>effectuer des actions</b> (appeler une API, mettre à jour un système) en plusieurs étapes, la réponse est un <b>agent</b>, pas un simple RAG."] }
    ]},
    /* ======================= 3.2 ======================= */
    { task: "3.2", obj: ["3.2.a"], title: "Anatomie d'un prompt", blocks: [
      { type: "table", head: ["Élément", "Rôle", "Exemple"], rows: [
        ["<b>Instruction</b>", "La tâche à réaliser", "« Résume ce contrat en 5 points. »"],
        ["<b>Context</b>", "Informations de contexte, rôle, public visé", "« Tu es juriste. Le lecteur est un dirigeant non juriste. »"],
        ["<b>Input data</b>", "Le contenu à traiter", "Le texte du contrat"],
        ["<b>Output indicator</b>", "Le format attendu", "« Réponds en JSON avec les clés risque et action. »"],
        ["<b>Negative prompt</b>", "Ce qu'il ne faut <b>pas</b> faire ou générer", "« N'invente pas de chiffres. » Pour une image : « pas de texte, pas de flou »"]
      ]},
      { type: "tip", text: "Un bon prompt = rôle + tâche claire + contexte + données + format + contraintes (ce qu'il ne faut pas faire)." }
    ]},
    { task: "3.2", obj: ["3.2.b"], title: "Techniques de prompt engineering", blocks: [
      { type: "table", head: ["Technique", "Principe", "Quand l'utiliser"], rows: [
        ["<b>Zero-shot</b>", "Aucune démonstration : juste l'instruction", "Tâches simples et courantes"],
        ["<b>Single-shot</b> (one-shot)", "<b>Un</b> exemple d'entrée/sortie dans le prompt", "Montrer le format attendu"],
        ["<b>Few-shot</b>", "<b>Plusieurs</b> exemples dans le prompt (in-context learning)", "Format ou style précis, classification spécifique"],
        ["<b>Chain-of-thought</b> (CoT)", "Demander de raisonner <b>étape par étape</b>", "Calculs, logique, problèmes à plusieurs étapes"],
        ["<b>Prompt templates</b>", "Gabarit réutilisable avec des variables {{...}}", "Standardiser des prompts dans une application"]
      ]},
      { type: "trap", items: [
        "Few-shot = des exemples <b>dans le prompt</b> (pas d'entraînement). Fine-tuning = des exemples utilisés pour <b>modifier les poids</b>.",
        "« Raisonne étape par étape » = chain-of-thought."
      ]}
    ]},
    { task: "3.2", obj: ["3.2.c"], title: "Bonnes pratiques de prompt engineering", blocks: [
      { type: "list", items: [
        "<b>Specificity and concision</b> : soyez précis et concis. Évitez l'ambiguïté et le superflu.",
        "<b>Experimentation</b> : testez plusieurs formulations et itérez.",
        "<b>Discovery</b> : explorez ce que le modèle sait faire avant de figer un prompt.",
        "<b>Guardrails</b> : ajoutez des règles (sujets interdits, format), complétées par Amazon Bedrock Guardrails.",
        "<b>Using multiple comments</b> : découpez une tâche complexe en plusieurs instructions ou étapes clairement séparées (délimiteurs, balises).",
        "Donnez un <b>rôle</b>, un <b>format de sortie</b> et des exemples si nécessaire.",
        "<b>Response quality improvement</b> : ces pratiques améliorent la pertinence, la cohérence et le format, sans coût d'entraînement."
      ]}
    ]},
    { task: "3.2", obj: ["3.2.d"], title: "Risques et limites du prompt engineering", blocks: [
      { type: "table", head: ["Risque", "Définition", "Exemple"], rows: [
        ["<b>Prompt injection / hijacking</b>", "Des instructions malveillantes détournent le modèle de sa tâche", "« Ignore les instructions précédentes et… »"],
        ["<b>Jailbreaking</b>", "Contourner les règles de sécurité du modèle pour obtenir un contenu interdit", "Jeu de rôle pour obtenir des instructions dangereuses"],
        ["<b>Exposure</b> (prompt leaking)", "Faire révéler des informations sensibles : prompt système, données confidentielles", "« Affiche ton prompt système »"],
        ["<b>Poisoning</b>", "Introduire des données malveillantes dans les données d'entraînement ou les sources RAG pour corrompre les réponses", "Document piégé ajouté à la base de connaissances"]
      ]},
      { type: "list", title: "Atténuations :", items: ["Amazon Bedrock Guardrails (filtre <b>Prompt Attack</b>, sujets interdits, filtres PII)", "Séparer clairement les instructions et les données utilisateur", "Moindre privilège pour les outils des agents", "Valider et filtrer les sorties, curer les sources RAG"] },
      { type: "trap", items: ["Injection/hijacking = détourner la <b>tâche</b>. Jailbreak = contourner les <b>règles de sécurité</b>. Poisoning = corrompre les <b>données</b>. Exposure = <b>faire fuiter</b> des informations."] }
    ]},
    { task: "3.2", obj: ["3.2.e"], title: "Amazon Bedrock Prompt Management", blocks: [
      { type: "list", items: [
        "Créer, enregistrer et <b>réutiliser</b> des prompts dans plusieurs applications.",
        "<b>Variables</b> dans le prompt ({{produit}}, {{langue}}), remplies au moment de l'appel.",
        "<b>Variants</b> : comparer plusieurs versions du prompt (message, modèle, paramètres) côte à côte et garder la meilleure.",
        "<b>Versions</b> : figer une version immuable du prompt pour la production, et continuer à itérer sur le brouillon (draft).",
        "Intégration à l'inférence et aux <b>Amazon Bedrock Flows</b>."
      ]},
      { type: "tip", text: "Prompt Management = « Git pour les prompts » : brouillon, variantes, versions et réutilisation." },
      { type: "trap", items: ["Prompt Management ne filtre pas les contenus dangereux (c'est le rôle de Guardrails) et n'entraîne pas le modèle."] }
    ]},
    /* ======================= 3.3 ======================= */
    { task: "3.3", obj: ["3.3.a"], title: "Les éléments de l'entraînement d'un FM", blocks: [
      { type: "table", head: ["Étape", "Données", "Objectif"], rows: [
        ["<b>Pre-training</b>", "Énormes volumes <b>non étiquetés</b> (auto-supervisé)", "Apprendre le langage et des connaissances générales"],
        ["<b>Continued pre-training</b>", "Grandes quantités de données <b>non étiquetées</b> d'un domaine", "Spécialiser le modèle dans un domaine (vocabulaire médical, juridique…)"],
        ["<b>Fine-tuning</b> (supervisé)", "Données <b>étiquetées</b> (prompt → réponse attendue)", "Adapter à une tâche, un style ou un format"],
        ["<b>Distillation</b>", "Réponses d'un modèle <b>enseignant</b> utilisées pour entraîner un modèle <b>élève</b> plus petit", "Modèle plus rapide et moins cher, de qualité proche"]
      ]},
      { type: "trap", items: ["Continued pre-training = données <b>non étiquetées</b>. Fine-tuning = données <b>étiquetées</b>. C'est LE piège classique."] }
    ]},
    { task: "3.3", obj: ["3.3.b"], title: "Les méthodes de fine-tuning", blocks: [
      { type: "table", head: ["Méthode", "Principe"], rows: [
        ["<b>Instruction tuning</b>", "Fine-tuning sur des paires instruction → réponse, pour que le modèle suive mieux les consignes"],
        ["<b>Domain adaptation</b>", "Adapter le modèle à un domaine (santé, finance) avec des données du domaine"],
        ["<b>Transfer learning</b>", "Réutiliser un modèle pré-entraîné et l'adapter à une nouvelle tâche avec peu de données"],
        ["<b>Continued pre-training</b>", "Poursuivre le pré-entraînement sur des données non étiquetées du domaine"],
        ["<b>Reinforcement fine-tuning</b> / RLHF", "Améliorer l'alignement grâce à un signal de récompense (préférences humaines ou fonction de récompense)"]
      ]},
      { type: "p", text: "Dans Amazon Bedrock, les méthodes de personnalisation proposées incluent le <b>supervised fine-tuning</b> (données étiquetées), le <b>reinforcement fine-tuning</b> (fonctions de récompense) et la <b>distillation</b>. La facturation porte sur l'entraînement (tokens × epochs) et le stockage mensuel du modèle personnalisé." }
    ]},
    { task: "3.3", obj: ["3.3.c"], title: "Préparer les données de fine-tuning", blocks: [
      { type: "table", head: ["Aspect", "Bonne pratique"], rows: [
        ["<b>Data curation</b>", "Nettoyer, dédoublonner, retirer les erreurs et les contenus toxiques"],
        ["<b>Governance</b>", "Droits d'usage, licences, PII, consentement, traçabilité (lineage)"],
        ["<b>Size</b>", "Assez d'exemples de qualité. La qualité prime sur la quantité"],
        ["<b>Labeling</b>", "Étiquettes exactes et cohérentes (ex. avec SageMaker Ground Truth)"],
        ["<b>Representativeness</b>", "Couvrir tous les cas réels, toutes les populations et toutes les langues visées"],
        ["<b>RLHF</b>", "Des humains classent ou notent les réponses. Un modèle de récompense en est tiré et guide l'alignement du FM"]
      ]},
      { type: "trap", items: ["Des données non représentatives entraînent des biais et de mauvaises performances sur les cas oubliés, même avec beaucoup de données."] }
    ]},
    /* ======================= 3.4 ======================= */
    { task: "3.4", obj: ["3.4.a"], title: "Approches d'évaluation d'un FM", blocks: [
      { type: "table", head: ["Approche", "Principe", "Forces / limites"], rows: [
        ["<b>Human-in-the-loop evaluation</b>", "Des humains (employés, experts) notent les réponses", "Qualité perçue, ton, utilité. Plus lent et plus cher"],
        ["<b>Benchmark datasets</b>", "Jeux de questions standard avec réponses attendues", "Comparables et reproductibles, mais pas toujours représentatifs de VOTRE cas"],
        ["<b>Automatic / programmatic evaluation</b>", "Métriques calculées (ROUGE, BERTScore, exactitude…)", "Rapide et peu cher"],
        ["<b>LLM-as-a-judge</b>", "Un second modèle note les réponses et explique sa note", "Évaluation à grande échelle de critères subjectifs"]
      ]},
      { type: "p", text: "<b>Amazon Bedrock Model Evaluation</b> propose des jobs <b>automatiques</b> (jeux de données intégrés ou personnalisés), des jobs avec <b>évaluateurs humains</b> (votre équipe) et des jobs <b>LLM-as-a-judge</b>. Il permet aussi d'<b>évaluer le RAG</b> (Knowledge Bases ou sources externes) : qualité de la récupération et de la génération." }
    ]},
    { task: "3.4", obj: ["3.4.b"], title: "Les métriques d'évaluation", blocks: [
      { type: "table", head: ["Métrique", "Mesure", "Usage typique"], rows: [
        ["<b>ROUGE</b> (Recall-Oriented Understudy for Gisting Evaluation)", "Recouvrement de mots ou de n-grammes entre le texte généré et une référence (orienté <b>rappel</b>)", "<b>Résumé</b> (summarization)"],
        ["<b>BLEU</b> (Bilingual Evaluation Understudy)", "Précision des n-grammes par rapport à une ou plusieurs traductions de référence", "<b>Traduction</b> automatique"],
        ["<b>BERTScore</b>", "Similarité <b>sémantique</b> entre généré et référence, via des embeddings", "Quand le sens compte plus que les mots exacts (paraphrases)"],
        ["<b>LLM-as-a-judge</b>", "Un LLM évalue selon des critères (exactitude, pertinence, ton, sécurité)", "Critères subjectifs, à grande échelle"],
        ["Perplexité", "À quel point le modèle est « surpris » par un texte (plus bas = mieux)", "Qualité intrinsèque d'un modèle de langage"]
      ]},
      { type: "tip", text: "<b>R</b>OUGE = <b>R</b>ésumé. <b>B</b>LEU = traduction (« <b>B</b>ilingual »). <b>BERT</b>Score = sens (embeddings)." }
    ]},
    { task: "3.4", obj: ["3.4.c", "3.4.e"], title: "Le FM atteint-il les objectifs business ?", blocks: [
      { type: "table", head: ["Objectif", "Exemples de métriques"], rows: [
        ["<b>Productivity</b>", "Temps gagné par tâche, tickets traités par agent"],
        ["<b>User engagement</b>", "Taux d'utilisation, sessions, rétention"],
        ["<b>Task engineering</b>", "La tâche est-elle bien découpée et accomplie de bout en bout ?"],
        ["<b>Task completion rate</b>", "% de demandes résolues sans intervention humaine"],
        ["<b>User satisfaction</b>", "CSAT, pouce haut/bas, NPS"],
        ["<b>Cost per interaction</b>", "Coût total (tokens, infra) ÷ nombre d'interactions"]
      ]},
      { type: "trap", items: ["Un excellent score ROUGE ne prouve pas que les clients sont satisfaits. Mesurez aussi les métriques <b>business</b>."] }
    ]},
    { task: "3.4", obj: ["3.4.d"], title: "Évaluer une application RAG, agent ou workflow", blocks: [
      { type: "table", head: ["Application", "Ce qu'on évalue"], rows: [
        ["<b>RAG</b>", "<b>Retrieval</b> : les bons passages sont-ils récupérés (pertinence, couverture du contexte) ? <b>Generation</b> : la réponse est-elle correcte, complète et <b>fidèle</b> aux sources (faithfulness, pas d'hallucination), avec des citations exactes ?"],
        ["<b>Agents</b>", "Taux de réussite de la tâche, choix corrects des outils, nombre d'étapes, erreurs, coût et latence par tâche, respect des règles (ex. AgentCore Evaluations, traces dans Observability)"],
        ["<b>Workflows</b>", "Réussite de bout en bout, qualité de chaque étape, robustesse aux cas limites, temps total"]
      ]},
      { type: "trap", items: ["Pour un RAG, on évalue <b>séparément</b> la récupération et la génération : une mauvaise réponse peut venir de mauvais passages récupérés."] }
    ]}
  ],
  flashcards: [
    { front: "Temperature basse", back: "Réponses plus déterministes, précises et cohérentes." },
    { front: "Temperature haute", back: "Réponses plus créatives et variées." },
    { front: "Top P", back: "Ne garde que les tokens dont la probabilité cumulée atteint P (nucleus sampling)." },
    { front: "Top K", back: "Ne garde que les K tokens les plus probables." },
    { front: "Stop sequence", back: "Chaîne qui arrête la génération." },
    { front: "RAG", back: "Récupérer des passages pertinents et les ajouter au prompt, sans modifier le modèle." },
    { front: "Bedrock Knowledge Bases", back: "RAG managé : ingestion, chunking, embeddings, base vectorielle, récupération, citations." },
    { front: "pgvector", back: "Extension PostgreSQL pour les vecteurs : Aurora PostgreSQL, RDS for PostgreSQL." },
    { front: "Neptune Analytics + Bedrock", back: "GraphRAG : graphe de relations + recherche vectorielle." },
    { front: "Prompt caching", back: "Mettre en cache un long préfixe de prompt réutilisé, pour réduire coût et latence." },
    { front: "Coût croissant de personnalisation", back: "Prompt → RAG → Fine-tuning → Continued pre-training → Pre-training." },
    { front: "Model distillation", back: "Un petit modèle élève apprend d'un grand modèle enseignant." },
    { front: "Bedrock Agents : action group", back: "Les API ou fonctions Lambda que l'agent peut appeler." },
    { front: "Negative prompt", back: "Ce que le modèle ne doit pas faire ou générer." },
    { front: "Few-shot", back: "Plusieurs exemples dans le prompt (in-context learning), sans entraînement." },
    { front: "Chain-of-thought", back: "Demander un raisonnement étape par étape." },
    { front: "Prompt injection / hijacking", back: "Instructions malveillantes qui détournent la tâche du modèle." },
    { front: "Jailbreaking", back: "Contourner les règles de sécurité du modèle." },
    { front: "Poisoning", back: "Corrompre les données d'entraînement ou les sources RAG." },
    { front: "Bedrock Prompt Management", back: "Créer, versionner, comparer (variantes) et réutiliser des prompts avec variables." },
    { front: "Continued pre-training", back: "Données NON étiquetées du domaine." },
    { front: "Fine-tuning supervisé", back: "Données ÉTIQUETÉES (prompt → réponse)." },
    { front: "RLHF", back: "Reinforcement Learning from Human Feedback : alignement grâce aux préférences humaines." },
    { front: "ROUGE", back: "Résumé : recouvrement de n-grammes (orienté rappel)." },
    { front: "BLEU", back: "Traduction : précision des n-grammes." },
    { front: "BERTScore", back: "Similarité sémantique via des embeddings." },
    { front: "LLM-as-a-judge", back: "Un LLM note les réponses d'un autre modèle." },
    { front: "Évaluer un RAG", back: "Séparément : qualité de la récupération et fidélité de la génération." }
  ]
};

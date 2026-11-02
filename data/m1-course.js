/* Monde 1 — Fundamentals of AI and ML (20 %) — Cours + flashcards */
window.MODULE_1 = window.MODULE_1 || {};
window.MODULE_1.course = {
  intro: "Ce monde pose les bases : le vocabulaire de l'IA, les cas d'usage où elle apporte (ou pas) de la valeur, et le cycle de vie d'un projet ML sur AWS. C'est 20 % de l'examen, et tout le reste s'appuie dessus.",
  sections: [
    /* ======================= 1.1 ======================= */
    { task: "1.1", obj: ["1.1.b", "1.1.a"], title: "AI, ML, Deep Learning, GenAI, Agentic AI", blocks: [
      { type: "p", text: "Ces notions s'emboîtent comme des poupées russes. Chaque cercle est un <b>sous-ensemble</b> du précédent." },
      { type: "diagram", id: "nested" },
      { type: "table", head: ["Terme", "Définition simple", "Exemple"], rows: [
        ["<b>AI</b> (Artificial Intelligence, intelligence artificielle)", "Tout système qui imite une capacité humaine : raisonner, percevoir, comprendre le langage, décider.", "Un filtre anti-spam, un assistant vocal"],
        ["<b>ML</b> (Machine Learning, apprentissage automatique)", "Sous-domaine de l'AI : le système <b>apprend des règles à partir des données</b> au lieu qu'un humain les code.", "Prédire le prix d'une maison à partir de ventes passées"],
        ["<b>Deep Learning</b> (apprentissage profond)", "Sous-domaine du ML qui utilise des <b>réseaux de neurones à nombreuses couches</b>. Excellent sur les données non structurées (images, texte, audio).", "Reconnaître un chat sur une photo"],
        ["<b>GenAI</b> (Generative AI, IA générative)", "Deep learning qui <b>crée du contenu nouveau</b> (texte, image, code, audio) grâce à de très grands modèles pré-entraînés (foundation models).", "Rédiger un e-mail, générer une image"],
        ["<b>Agentic AI</b> (IA agentique)", "Systèmes qui <b>poursuivent un objectif en plusieurs étapes</b> : ils planifient, utilisent des outils (API, bases de données), agissent et s'ajustent avec une autonomie encadrée. Ils reposent en général sur des LLM.", "Un agent qui lit une demande client, vérifie la commande dans le SI et déclenche le remboursement"]
      ]},
      { type: "analogy", text: "L'AI, c'est « la cuisine ». Le ML, c'est « cuisiner en apprenant des recettes passées ». Le deep learning, c'est un chef aux mille réflexes. La GenAI invente de nouvelles recettes. L'agentic AI, c'est le chef qui fait aussi les courses, gère le four et sert les clients." },
      { type: "trap", items: [
        "« GenAI » et « AI » ne sont pas synonymes : la GenAI n'est qu'une partie de l'AI.",
        "Un LLM n'est pas forcément un agent. Un agent <b>utilise</b> un LLM et y ajoute de la planification, des outils et des actions."
      ]}
    ]},
    { task: "1.1", obj: ["1.1.a"], title: "Le vocabulaire indispensable", blocks: [
      { type: "table", head: ["Terme", "À retenir"], rows: [
        ["<b>Algorithm</b>", "La <i>méthode</i> d'apprentissage (ex. régression linéaire, arbre de décision, réseau de neurones)."],
        ["<b>Model</b>", "Le <i>résultat</i> de l'entraînement : un artefact qui encode ce qui a été appris et fait des prédictions."],
        ["<b>Training</b> (entraînement)", "L'algorithme ajuste les paramètres du modèle à partir des données."],
        ["<b>Inference</b> (inférence)", "Utiliser le modèle entraîné pour prédire sur de <b>nouvelles</b> données."],
        ["<b>Neural network</b> (réseau de neurones)", "Couches de « neurones » reliés par des poids ajustés pendant l'entraînement."],
        ["<b>Computer vision</b> (vision par ordinateur)", "Comprendre images et vidéos : objets, visages, texte dans une image."],
        ["<b>NLP</b> (Natural Language Processing)", "Comprendre et produire du langage humain : sentiment, entités, traduction, résumé."],
        ["<b>LLM</b> (Large Language Model)", "Très grand modèle de langage (transformer) pré-entraîné sur d'énormes corpus de texte."],
        ["<b>Bias</b> (biais)", "Deux sens à l'examen : 1) erreur systématique d'un modèle trop simple (biais statistique) ; 2) résultats injustes envers certains groupes (biais éthique)."],
        ["<b>Fairness</b> (équité)", "Le modèle traite de façon équitable les différents groupes (âge, genre, origine…)."],
        ["<b>Fit</b> (ajustement)", "La qualité avec laquelle le modèle capture les tendances : underfit, good fit, overfit."]
      ]},
      { type: "analogy", text: "L'<b>algorithme</b> est la recette, les <b>données</b> sont les ingrédients, le <b>modèle</b> est le plat cuisiné. L'<b>inférence</b>, c'est servir le plat à un nouveau client." }
    ]},
    { task: "1.1", obj: ["1.1.a"], title: "Fit : underfitting, overfitting, biais et variance", blocks: [
      { type: "diagram", id: "fit" },
      { type: "table", head: ["", "Underfitting", "Good fit", "Overfitting"], rows: [
        ["Training data", "Mauvais", "Bon", "Excellent"],
        ["Nouvelles données", "Mauvais", "Bon", "Mauvais"],
        ["Cause", "Modèle trop simple → <b>high bias</b>", "Équilibre biais/variance", "Modèle qui « apprend par cœur » → <b>high variance</b>"],
        ["Remèdes", "Modèle plus complexe, plus de features, entraîner plus longtemps", "—", "Plus de données, data augmentation, régularisation, early stopping, modèle plus simple, moins de features"]
      ]},
      { type: "analogy", text: "Overfitting : l'élève qui apprend par cœur les annales et échoue dès que la question change. Underfitting : l'élève qui n'a retenu qu'une règle trop vague." },
      { type: "trap", items: [
        "<b>High variance = overfitting</b>, <b>high bias = underfitting</b>. C'est la paire la plus testée.",
        "« Très bon en entraînement, mauvais en test » : c'est toujours de l'overfitting."
      ]}
    ]},
    { task: "1.1", obj: ["1.1.c"], title: "Types d'inférence (SageMaker AI)", blocks: [
      { type: "table", head: ["Type", "Quand l'utiliser", "Mot-clé dans l'énoncé"], rows: [
        ["<b>Real-time inference</b>", "Réponse immédiate (millisecondes), trafic régulier, endpoint toujours actif.", "« low latency », « immediately », « interactive »"],
        ["<b>Serverless inference</b>", "Trafic intermittent ou imprévisible. Pas de serveur à gérer, paiement à l'usage. Accepte des <i>cold starts</i>.", "« intermittent traffic », « idle periods », « no infrastructure management »"],
        ["<b>Asynchronous inference</b>", "Requêtes à <b>gros payloads</b> ou à <b>traitement long</b>. Les requêtes sont mises en file d'attente, et l'endpoint peut redescendre à 0 instance quand il n'y a rien à traiter.", "« large payload », « long processing time », « near real-time »"],
        ["<b>Batch transform</b> (batch inference)", "Prédictions sur un <b>jeu de données entier</b>, hors ligne, sans besoin de réponse immédiate.", "« nightly », « entire dataset », « no need for real-time »"]
      ]},
      { type: "tip", text: "Retenez « <b>RSAB</b> » : <b>R</b>apide (Real-time), <b>S</b>poradique (Serverless), <b>A</b>ttente et gros fichiers (Async), <b>B</b>loc entier de données (Batch)." },
      { type: "trap", items: [
        "Async ≠ Batch : l'asynchrone traite des <b>requêtes individuelles</b> qui arrivent au fil de l'eau, le batch traite un <b>dataset complet</b> d'un coup.",
        "Serverless : idéal quand le trafic est irrégulier, mais il y a de la latence au démarrage (cold start)."
      ]}
    ]},
    { task: "1.1", obj: ["1.1.d"], title: "Types de données", blocks: [
      { type: "table", head: ["Catégorie", "Exemples", "À retenir"], rows: [
        ["<b>Labeled</b> (étiquetées)", "Photo + étiquette « chat », e-mail + « spam »", "Nécessaires à l'apprentissage <b>supervisé</b>"],
        ["<b>Unlabeled</b> (non étiquetées)", "Logs bruts, photos sans légende", "Apprentissage <b>non supervisé</b> (ou auto-supervisé)"],
        ["<b>Structured / tabular</b>", "Tableur, table SQL (lignes × colonnes)", "Idéal pour le ML « classique »"],
        ["<b>Time-series</b> (séries temporelles)", "Ventes par jour, capteur toutes les minutes", "Ordonnées dans le temps → forecasting"],
        ["<b>Unstructured</b>", "Texte libre, images, audio, vidéo", "Domaine de prédilection du deep learning et de la GenAI"]
      ]},
      { type: "trap", items: ["Un tableau de mesures horodatées est <b>à la fois</b> structuré et une time-series. Lisez bien ce que la question demande."] }
    ]},
    { task: "1.1", obj: ["1.1.e"], title: "Types d'apprentissage", blocks: [
      { type: "table", head: ["Type", "Principe", "Exemples"], rows: [
        ["<b>Supervised</b> (supervisé)", "Apprend à partir d'exemples <b>étiquetés</b> (entrée → bonne réponse).", "Classification (spam ou pas), régression (prix)"],
        ["<b>Unsupervised</b> (non supervisé)", "Trouve des structures dans des données <b>non étiquetées</b>.", "Clustering (segmentation clients), détection d'anomalies"],
        ["<b>Reinforcement learning</b> (par renforcement)", "Un <b>agent</b> agit dans un environnement et apprend par <b>essais/erreurs</b> grâce à des <b>récompenses</b>.", "Robot, jeu, optimisation de trajets ; RLHF pour aligner les LLM"],
        ["<b>Self-supervised</b> (auto-supervisé)", "Le modèle crée ses propres étiquettes à partir des données (ex. prédire le mot suivant).", "Pré-entraînement des LLM"]
      ]},
      { type: "tip", text: "Étiquettes → Supervisé. Pas d'étiquettes → Non supervisé. Récompense → Renforcement." }
    ]},
    /* ======================= 1.2 ======================= */
    { task: "1.2", obj: ["1.2.a", "1.2.b"], title: "Quand l'IA apporte de la valeur… et quand elle n'en apporte pas", blocks: [
      { type: "list", title: "L'IA/ML apporte de la valeur pour :", items: [
        "<b>Aider la décision humaine</b> : signaler les dossiers à risque, prioriser.",
        "<b>Passer à l'échelle</b> : traiter des millions de documents, d'images ou d'appels.",
        "<b>Automatiser</b> des tâches répétitives (extraction de documents, tri).",
        "Repérer des <b>motifs complexes</b> qu'aucune règle simple ne capture (fraude, recommandations)."
      ]},
      { type: "list", title: "L'IA/ML n'est PAS adaptée quand :", items: [
        "Il faut un <b>résultat exact et déterministe</b> (calcul de taxe, règle légale fixe) : une règle codée suffit, et le ML ne donne qu'une <i>prédiction</i> probabiliste.",
        "L'<b>analyse coût/bénéfice</b> est défavorable : coûts de données, d'entraînement et de maintenance supérieurs au gain.",
        "Il n'y a <b>pas assez de données</b> de qualité.",
        "Une <b>explication complète</b> de chaque décision est exigée et le modèle envisagé est une boîte noire."
      ]},
      { type: "trap", items: ["Si l'énoncé insiste sur « exact », « toujours le même résultat » ou « règles simples connues », la bonne réponse n'est souvent <b>pas</b> le ML."] }
    ]},
    { task: "1.2", obj: ["1.2.c"], title: "Choisir la bonne technique", blocks: [
      { type: "table", head: ["Technique", "Sortie", "Exemple"], rows: [
        ["<b>Regression</b>", "Une <b>valeur numérique continue</b>", "Prix d'un bien, température, chiffre d'affaires"],
        ["<b>Classification</b> (binaire ou multi-classe)", "Une <b>catégorie</b>", "Fraude oui/non, type de ticket support"],
        ["<b>Clustering</b>", "Des <b>groupes</b> découverts sans étiquettes", "Segmentation clients, regroupement d'articles par thème"],
        ["<b>Forecasting</b> (prévision)", "Valeurs <b>futures</b> d'une série temporelle", "Ventes du mois prochain"],
        ["<b>Anomaly detection</b>", "Points <b>inhabituels</b>", "Transaction suspecte, panne de capteur"],
        ["<b>Recommendation</b>", "Les éléments les plus pertinents pour un utilisateur", "« Les clients ont aussi acheté… »"]
      ]},
      { type: "tip", text: "Combien ? → Regression. Lequel ? → Classification. Quels groupes ? → Clustering. Quand, ou combien demain ? → Forecasting." }
    ]},
    { task: "1.2", obj: ["1.2.d"], title: "Applications concrètes", blocks: [
      { type: "table", head: ["Domaine", "Exemples"], rows: [
        ["Computer vision", "Contrôle qualité visuel, modération d'images, reconnaissance de visages"],
        ["NLP", "Analyse de sentiment, extraction d'entités, traduction, résumé"],
        ["Speech recognition", "Sous-titrage, transcription d'appels de centre de contact"],
        ["Recommendation systems", "E-commerce, streaming"],
        ["Fraud detection", "Banque, assurance, e-commerce"],
        ["Forecasting", "Demande, stocks, énergie"],
        ["Knowledge bases", "Assistant qui répond aux questions à partir des documents internes de l'entreprise"],
        ["Agentic AI", "Agent qui enchaîne des actions : réserver, vérifier, mettre à jour un ticket"]
      ]}
    ]},
    { task: "1.2", obj: ["1.2.e"], title: "Les services AWS d'IA managés", blocks: [
      { type: "p", text: "Ce sont des services <b>pré-entraînés</b>, appelés par API, qui ne demandent aucune expertise ML. À l'examen, il faut associer chaque besoin au bon service." },
      { type: "table", head: ["Service", "Ce qu'il fait", "Mot-clé"], rows: [
        ["<b>Amazon Transcribe</b>", "Speech-to-text (parole → texte)", "transcription, sous-titres, appels"],
        ["<b>Amazon Polly</b>", "Text-to-speech (texte → voix naturelle)", "lire à voix haute, voix"],
        ["<b>Amazon Translate</b>", "Traduction automatique neuronale", "langues, localisation"],
        ["<b>Amazon Comprehend</b>", "NLP sur du texte : sentiment, entités, phrases clés, langue, PII, classification", "avis clients, sentiment"],
        ["<b>Amazon Lex</b>", "Chatbots et voicebots conversationnels (reconnaissance vocale + compréhension du langage)", "chatbot, IVR, intents"],
        ["<b>Amazon Rekognition</b>", "Analyse d'images et de vidéos : objets, visages, texte, contenu inapproprié", "photo, vidéo, visage"],
        ["<b>Amazon Textract</b>", "Extraction de texte, <b>formulaires</b> (clé-valeur) et <b>tableaux</b> de documents scannés", "factures, formulaires, PDF scannés"],
        ["<b>Amazon Personalize</b>", "Recommandations personnalisées en temps réel", "recommandation, « vous aimerez aussi »"],
        ["<b>Amazon SageMaker AI</b>", "Plateforme complète pour <b>construire, entraîner et déployer</b> vos propres modèles ML", "modèle custom, data scientists"]
      ]},
      { type: "tip", text: "Mémo : Trans<b>cribe</b> = écrire (« scribe »), <b>Poll</b>y = le perroquet qui parle, <b>Tex</b>tract = extraire le texte, <b>Rekog</b>nition = reconnaître (en image), <b>Comprehend</b> = comprendre le texte, <b>Lex</b> = lexique et conversation." },
      { type: "trap", items: [
        "Comprehend analyse du <b>texte déjà numérique</b>. Pour un document <b>scanné</b> (formulaire, tableau), il faut Textract.",
        "Transcribe (parole → texte) et Polly (texte → parole) sont inverses : ne les confondez pas.",
        "Lex construit l'interface conversationnelle. Polly fournit seulement la voix."
      ]}
    ]},
    { task: "1.2", obj: ["1.2.f"], title: "ML traditionnel ou foundation model ?", blocks: [
      { type: "table", head: ["Critère", "ML traditionnel (modèle dédié)", "Foundation model (FM / LLM)"], rows: [
        ["Explicabilité", "Plus facile (arbres, régression, importance des variables)", "Difficile (boîte noire de milliards de paramètres)"],
        ["Contraintes réglementaires", "Souvent préféré si chaque décision doit être justifiée (crédit, assurance)", "À utiliser avec prudence, avec garde-fous"],
        ["Données", "Tabulaires et structurées, tâche précise", "Texte, images, multimodal, tâches ouvertes"],
        ["Coût et latence (opérationnel)", "Faibles, modèle léger", "Plus élevés (tokens, gros modèles)"],
        ["Flexibilité", "Une tâche", "Nombreuses tâches sans réentraînement (prompting)"]
      ]},
      { type: "trap", items: ["Une décision de crédit réglementée sur des données tabulaires, avec une exigence d'explication : pensez <b>ML traditionnel interprétable</b>, pas LLM."] }
    ]},
    /* ======================= 1.3 ======================= */
    { task: "1.3", obj: ["1.3.a"], title: "Le pipeline ML de bout en bout", blocks: [
      { type: "diagram", id: "pipeline" },
      { type: "list", items: [
        "<b>1. Business goal</b> : définir le problème et la métrique de succès.",
        "<b>2. Data collection</b> : rassembler les données (S3, bases, AWS Glue, AWS Data Exchange).",
        "<b>3. Data preparation & feature engineering</b> : nettoyer, transformer, étiqueter (labeling), créer des features.",
        "<b>4. Training</b> : entraîner le modèle (et régler les hyperparamètres).",
        "<b>5. Evaluation</b> : mesurer sur des données de test jamais vues.",
        "<b>6. Deployment</b> : exposer le modèle (endpoint, batch, API).",
        "<b>7. Monitoring</b> : surveiller la qualité et la dérive (drift), puis <b>réentraîner</b>. C'est une boucle !"
      ]}
    ]},
    { task: "1.3", obj: ["1.3.d"], title: "Les briques SageMaker AI et AWS par étape", blocks: [
      { type: "table", head: ["Étape", "Service / fonctionnalité", "Rôle"], rows: [
        ["Labeling", "<b>SageMaker Ground Truth</b>", "Étiquetage de données (humains + automatique)"],
        ["Préparation", "<b>SageMaker Data Wrangler</b>, AWS Glue, Glue DataBrew", "Nettoyer et transformer les données (Data Wrangler et DataBrew : sans code ou presque)"],
        ["Features", "<b>SageMaker Feature Store</b>", "Stocker, partager et réutiliser les features"],
        ["Modèles prêts à l'emploi", "<b>SageMaker JumpStart</b>", "Hub de modèles pré-entraînés et de FM open source, à déployer ou fine-tuner"],
        ["No-code / AutoML", "<b>SageMaker Canvas</b>, Autopilot", "Construire des modèles sans coder"],
        ["Biais et explicabilité", "<b>SageMaker Clarify</b>", "Détecter les biais, expliquer les prédictions"],
        ["Catalogue de modèles", "<b>SageMaker Model Registry</b>", "Versionner et approuver les modèles avant déploiement"],
        ["Automatisation (MLOps)", "<b>SageMaker Pipelines</b>", "Workflows ML reproductibles (CI/CD pour le ML)"],
        ["Surveillance", "<b>SageMaker Model Monitor</b>", "Détecter la dérive des données et de la qualité en production"],
        ["Documentation", "<b>SageMaker Model Cards</b>", "Documenter l'usage prévu, les risques et les performances"],
        ["GenAI managée", "<b>Amazon Bedrock</b>", "FM de plusieurs fournisseurs via une API unique, sans serveur"],
        ["Usage métier", "<b>Amazon Quick</b>", "Espace de travail agentique pour les équipes métier : BI, recherche, automatisation de workflows"],
        ["Développement", "<b>Kiro</b>", "IDE agentique d'AWS : développement guidé par des spécifications (spec-driven)"]
      ]},
      { type: "trap", items: [
        "Clarify (biais et explicabilité) ≠ Model Monitor (dérive en production). Les deux peuvent travailler ensemble, mais ils ont des rôles différents.",
        "Ground Truth sert à <b>étiqueter</b> des données. Ce n'est pas un outil de « vérité » sur les prédictions."
      ]}
    ]},
    { task: "1.3", obj: ["1.3.b", "1.3.c"], title: "Sources de modèles et mise en production", blocks: [
      { type: "table", head: ["Source", "Description"], rows: [
        ["<b>Open source pré-entraîné</b>", "Modèles publics (via SageMaker JumpStart, par ex.) : on les réutilise ou on les fine-tune."],
        ["<b>FM propriétaires managés</b>", "Accessibles via Amazon Bedrock (ex. Amazon Nova et des modèles de fournisseurs tiers)."],
        ["<b>Modèle custom</b>", "Entraîné sur vos données : de zéro (coûteux) ou par fine-tuning d'un modèle existant."]
      ]},
      { type: "table", head: ["Mode de production", "Avantages", "Inconvénients"], rows: [
        ["<b>Managed API service</b> (ex. Amazon Bedrock)", "Pas d'infrastructure à gérer, paiement à l'usage (tokens), démarrage rapide", "Moins de contrôle bas niveau"],
        ["<b>Self-hosted API</b> (ex. endpoint SageMaker AI, EC2, EKS)", "Contrôle total (instance, réseau, version du modèle)", "Gestion de la capacité, coût des instances même au repos"]
      ]}
    ]},
    { task: "1.3", obj: ["1.3.e"], title: "MLOps", blocks: [
      { type: "p", text: "Le MLOps applique les principes DevOps au ML pour passer de l'expérimentation à la production de manière fiable." },
      { type: "list", items: [
        "<b>Experimentation</b> : suivre les essais (paramètres, données, résultats).",
        "<b>Repeatable processes</b> : pipelines automatisés, versionnage du code, des données et des modèles.",
        "<b>Scalable systems</b> : infrastructure qui suit la charge.",
        "<b>Managing technical debt</b> : éviter les scripts manuels fragiles et les dépendances cachées.",
        "<b>Production readiness</b> : tests, validation, approbation, rollback.",
        "<b>Model monitoring</b> : détecter le <b>data drift</b> (les données changent) et le <b>concept drift</b> (la relation entrée/sortie change).",
        "<b>Model re-training</b> : réentraîner automatiquement ou périodiquement."
      ]},
      { type: "trap", items: ["Un modèle dont la performance baisse <b>des mois après</b> son déploiement : ce n'est pas de l'overfitting, c'est de la <b>dérive</b>. Il faut Model Monitor et un réentraînement."] }
    ]},
    { task: "1.3", obj: ["1.3.f"], title: "Métriques du modèle et métriques business", blocks: [
      { type: "diagram", id: "confusion" },
      { type: "table", head: ["Métrique", "Formule", "Quand la privilégier"], rows: [
        ["<b>Accuracy</b>", "(TP + TN) / total", "Classes équilibrées. Trompeuse si les classes sont déséquilibrées !"],
        ["<b>Precision</b>", "TP / (TP + FP)", "Les <b>faux positifs</b> coûtent cher (ex. bloquer un bon client)"],
        ["<b>Recall</b> (sensibilité)", "TP / (TP + FN)", "Les <b>faux négatifs</b> coûtent cher (ex. rater une fraude, une maladie)"],
        ["<b>F1 score</b>", "Moyenne harmonique de precision et recall", "Équilibre entre les deux, classes déséquilibrées"],
        ["<b>AUC-ROC</b>", "Aire sous la courbe ROC (0,5 = hasard, 1 = parfait)", "Comparer des classifieurs indépendamment du seuil"],
        ["<b>MAE / RMSE</b>", "Erreur moyenne (absolue / quadratique)", "Modèles de <b>régression</b>"]
      ]},
      { type: "list", title: "Métriques business :", items: ["<b>ROI</b> (retour sur investissement)", "<b>Cost per user</b>, coûts de développement", "<b>Customer feedback</b>, satisfaction", "Gain de temps, taux de conversion"] },
      { type: "tip", text: "<b>P</b>recision = « <b>P</b>as de fausse alerte ». <b>R</b>ecall = « <b>R</b>ien ne doit m'échapper »." },
      { type: "trap", items: [
        "99 % d'accuracy sur un dataset où 99 % des cas sont négatifs peut cacher un modèle inutile : il suffit de toujours répondre « négatif ».",
        "F1, precision et recall sont des métriques <b>techniques</b>. ROI et coût par utilisateur sont des métriques <b>business</b>."
      ]}
    ]}
  ],
  flashcards: [
    { front: "Overfitting", back: "Excellent sur les données d'entraînement, mauvais sur les nouvelles données → <b>high variance</b>." },
    { front: "Underfitting", back: "Mauvais partout : modèle trop simple → <b>high bias</b>." },
    { front: "Supervised learning", back: "Apprentissage à partir de données <b>étiquetées</b> (classification, régression)." },
    { front: "Unsupervised learning", back: "Trouver des structures dans des données <b>non étiquetées</b> (clustering)." },
    { front: "Reinforcement learning", back: "Un agent apprend par essais/erreurs grâce à des <b>récompenses</b>." },
    { front: "Real-time inference", back: "Réponse immédiate, faible latence, endpoint toujours actif." },
    { front: "Serverless inference", back: "Trafic intermittent ou imprévisible, pas de serveur à gérer, cold starts possibles." },
    { front: "Asynchronous inference", back: "Gros payloads, traitement long, requêtes mises en file d'attente." },
    { front: "Batch transform", back: "Prédictions hors ligne sur un dataset entier." },
    { front: "Regression", back: "Prédire une <b>valeur numérique continue</b>." },
    { front: "Classification", back: "Prédire une <b>catégorie</b>." },
    { front: "Clustering", back: "Regrouper des éléments similaires <b>sans étiquettes</b>." },
    { front: "Amazon Transcribe", back: "Speech-to-text." },
    { front: "Amazon Polly", back: "Text-to-speech." },
    { front: "Amazon Comprehend", back: "NLP : sentiment, entités, phrases clés, PII." },
    { front: "Amazon Textract", back: "Extraire texte, formulaires et tableaux de documents scannés." },
    { front: "Amazon Lex", back: "Chatbots et voicebots conversationnels." },
    { front: "Amazon Rekognition", back: "Analyse d'images et de vidéos." },
    { front: "Amazon Personalize", back: "Recommandations personnalisées." },
    { front: "SageMaker Ground Truth", back: "Étiquetage (labeling) de données." },
    { front: "SageMaker Model Monitor", back: "Détecter la dérive des données ou de la qualité en production." },
    { front: "SageMaker JumpStart", back: "Hub de modèles pré-entraînés et de FM à déployer ou fine-tuner." },
    { front: "Precision", back: "TP / (TP + FP) : éviter les fausses alertes." },
    { front: "Recall", back: "TP / (TP + FN) : ne rater aucun positif." },
    { front: "F1 score", back: "Moyenne harmonique de precision et recall." },
    { front: "Agentic AI", back: "Système qui planifie et agit en plusieurs étapes avec des outils pour atteindre un objectif." },
    { front: "Data drift", back: "Les données de production s'éloignent des données d'entraînement : la performance baisse, il faut réentraîner." }
  ]
};

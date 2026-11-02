/* Domaine 5 — Security, Compliance, and Governance for AI Solutions (14 %) — Cours + flashcards */
window.MODULE_5 = window.MODULE_5 || {};
window.MODULE_5.course = {
  intro: "Dernier domaine (14 %) : sécuriser un système d'IA (identités, chiffrement, réseau privé, données, prompts, agents), détecter les hallucinations, et respecter la gouvernance et la conformité avec les services AWS adaptés.",
  sections: [
    /* ======================= 5.1 ======================= */
    { task: "5.1", obj: ["5.1.a"], title: "Le modèle de responsabilité partagée appliqué à l'IA", blocks: [
      { type: "diagram", id: "shared" },
      { type: "table", head: ["AWS est responsable de… (security OF the cloud)", "Le client est responsable de… (security IN the cloud)"], rows: [
        ["Infrastructure physique, réseau, hyperviseurs des services managés", "Ses <b>données</b> (prompts, documents, données d'entraînement)"],
        ["Fonctionnement et sécurité des services managés (Bedrock, SageMaker AI…)", "Les <b>accès</b> : identités et politiques IAM"],
        ["Les modèles de base hébergés dans Bedrock (côté service)", "La <b>configuration</b> : chiffrement, réseau, logs, Guardrails"],
        ["", "L'<b>usage</b> de l'IA : contenus générés, conformité de l'application"]
      ]},
      { type: "p", text: "Plus le service est managé (Bedrock serverless), plus AWS prend en charge. Avec des modèles <b>auto-hébergés</b> sur Amazon EC2, ECS ou EKS, le client gère aussi l'OS, les correctifs et la mise à l'échelle." },
      { type: "trap", items: ["Les permissions IAM, la classification des données et les garde-fous sont <b>toujours</b> de la responsabilité du client."] }
    ]},
    { task: "5.1", obj: ["5.1.a"], title: "Les services pour sécuriser un système d'IA", blocks: [
      { type: "table", head: ["Service / fonctionnalité", "Rôle pour l'IA"], rows: [
        ["<b>IAM</b> (roles, policies, permissions)", "Contrôler qui peut invoquer quel modèle, accéder à quelle Knowledge Base, etc. Principe du <b>moindre privilège</b>. Rôles IAM pour les services (pas de clés en dur)."],
        ["<b>Encryption</b> avec <b>AWS KMS</b>", "Chiffrer au repos (données, modèles personnalisés, Knowledge Bases, S3) avec des clés gérées, y compris des clés gérées par le client. TLS pour le chiffrement en transit."],
        ["<b>Amazon Macie</b>", "Découvrir et classer automatiquement les <b>données sensibles (PII)</b> dans <b>Amazon S3</b>, par exemple avant de s'en servir pour l'entraînement ou le RAG."],
        ["<b>AWS PrivateLink</b> (VPC interface endpoints)", "Accéder à Amazon Bedrock ou SageMaker AI <b>depuis un Amazon VPC</b> sans passer par Internet."],
        ["<b>AWS Secrets Manager</b>", "Stocker et faire tourner les secrets (clés d'API, identifiants de bases de données) utilisés par les applications et les agents."],
        ["<b>Amazon Bedrock Guardrails</b>", "Filtrer les entrées et sorties : contenus nuisibles, PII, attaques de prompt."],
        ["<b>Amazon Bedrock AgentCore Identity</b>", "Gestion de l'<b>identité</b>, de l'authentification et des accès des <b>agents</b>, compatible avec les fournisseurs d'identité existants (ex. Amazon Cognito, Okta, Microsoft Entra ID). Les agents agissent avec les bons identifiants, sans secrets en dur."],
        ["<b>Policy in Amazon Bedrock AgentCore</b>", "Contrôle <b>déterministe</b> des actions des agents : des règles fines (écrites en langage naturel ou dans un langage de politiques compatible Cedar) définissent quels outils un agent peut appeler, quelles actions il peut faire et sous quelles conditions. Chaque appel d'outil passant par AgentCore Gateway est intercepté et évalué <b>avant</b> son exécution."]
      ]},
      { type: "tip", text: "Qui peut faire quoi → IAM. Secrets → Secrets Manager. Clés de chiffrement → KMS. PII dans S3 → Macie. Pas d'Internet → PrivateLink. Que peut faire l'agent → Policy in AgentCore. Qui est l'agent → AgentCore Identity." },
      { type: "trap", items: [
        "Macie <b>découvre</b> les données sensibles dans S3. Ce n'est ni un pare-feu ni un service de chiffrement.",
        "AgentCore Identity = <b>authentification</b> et identifiants de l'agent. Policy in AgentCore = <b>autorisation</b> des actions (appels d'outils)."
      ]}
    ]},
    { task: "5.1", obj: ["5.1.a", "5.1.d"], title: "Architecture type d'une application GenAI sécurisée sur AWS", blocks: [
      { type: "table", head: ["Composant", "Service", "Contribution à la sécurité"], rows: [
        ["Diffusion et protection en périphérie", "<b>Amazon CloudFront</b>", "HTTPS, mise en cache à l'edge, point d'entrée unique"],
        ["Réseau isolé", "<b>Amazon VPC</b> (sous-réseaux privés, groupes de sécurité)", "Isoler les composants. Accès aux modèles via PrivateLink"],
        ["Calcul de l'application", "<b>AWS Lambda</b>, <b>Amazon ECS</b>, <b>Amazon EKS</b>, <b>Amazon EC2</b>", "Rôles IAM à moindre privilège, correctifs (selon le service)"],
        ["Cache", "<b>Amazon ElastiCache</b>", "Mettre en cache des réponses ou des sessions pour réduire la latence et le coût. Chiffrer et isoler dans le VPC"],
        ["Données et documents", "<b>Amazon S3</b> (+ Macie, KMS)", "Chiffrement, contrôle d'accès, détection des PII"],
        ["Modèles", "<b>Amazon Bedrock</b> (+ Guardrails)", "Données non utilisées pour entraîner les modèles de base, filtrage"],
        ["Secrets", "<b>AWS Secrets Manager</b>", "Aucun secret dans le code"],
        ["Journaux et surveillance", "<b>AWS CloudTrail</b>, <b>Amazon CloudWatch</b>", "Audit des appels d'API, métriques, alarmes, logs d'invocation des modèles"]
      ]}
    ]},
    { task: "5.1", obj: ["5.1.b"], title: "Citation des sources et origine des données", blocks: [
      { type: "table", head: ["Concept", "Définition", "Outils AWS"], rows: [
        ["<b>Source citation</b>", "Indiquer d'où provient l'information d'une réponse", "Citations des Bedrock Knowledge Bases (RAG)"],
        ["<b>Data lineage</b> (traçabilité)", "Suivre l'origine des données et toutes leurs transformations jusqu'au modèle", "SageMaker ML Lineage Tracking, métadonnées des pipelines"],
        ["<b>Data cataloging</b>", "Inventorier les jeux de données, leurs schémas et propriétaires pour les retrouver et les gouverner", "AWS Glue Data Catalog, AWS Lake Formation (permissions)"],
        ["<b>Model documentation</b>", "Décrire les données d'entraînement, l'usage prévu et les limites du modèle", "Amazon SageMaker Model Cards"]
      ]},
      { type: "trap", items: ["« D'où viennent les données d'entraînement de ce modèle ? » → lineage + catalog + Model Cards. « D'où vient cette réponse ? » → citation des sources (RAG)."] }
    ]},
    { task: "5.1", obj: ["5.1.c"], title: "Data engineering sécurisé", blocks: [
      { type: "table", head: ["Pratique", "Exemples"], rows: [
        ["<b>Assessing data quality</b>", "Profiler et valider : valeurs manquantes, doublons, formats (AWS Glue Data Quality, AWS Glue DataBrew)"],
        ["<b>Privacy-enhancing technologies</b> (PET)", "Anonymisation, pseudonymisation, <b>masquage</b>, tokenisation, chiffrement, confidentialité différentielle. Supprimer les PII inutiles avant l'entraînement"],
        ["<b>Data access control</b>", "IAM à moindre privilège, permissions fines par table, colonne ou ligne avec <b>AWS Lake Formation</b>, politiques de bucket S3"],
        ["<b>Data integrity</b>", "Versionnage S3, sommes de contrôle, verrouillage (S3 Object Lock), validation dans les pipelines, pour se protéger de l'altération et du poisoning"]
      ]},
      { type: "p", text: "Les traitements de données à grande échelle (ex. <b>Amazon EMR</b> avec Spark, AWS Glue) doivent eux aussi appliquer chiffrement, contrôle d'accès et journalisation. Les jeux de données tiers (ex. via <b>AWS Data Exchange</b>) doivent être vérifiés : licence, qualité, provenance." }
    ]},
    { task: "5.1", obj: ["5.1.d"], title: "Sécurité et confidentialité des systèmes d'IA", blocks: [
      { type: "table", head: ["Enjeu", "Mesures"], rows: [
        ["<b>Application security</b>", "Authentification, validation des entrées, moindre privilège pour les outils des agents"],
        ["<b>Threat detection</b>", "Surveiller les comportements anormaux (journaux, alarmes CloudWatch, analyse des appels d'API)"],
        ["<b>Vulnerability management</b>", "<b>Amazon Inspector</b> analyse en continu les vulnérabilités logicielles (EC2, images de conteneurs, Lambda)"],
        ["<b>Infrastructure protection</b>", "VPC, sous-réseaux privés, groupes de sécurité, PrivateLink"],
        ["<b>Prompt injection</b>", "Guardrails (Prompt Attack), séparation instructions/données, validation des actions des agents (Policy in AgentCore)"],
        ["<b>Encryption at rest and in transit</b>", "AWS KMS, TLS"],
        ["<b>Data leakage prevention</b>", "Masquer les PII (Guardrails), ne pas mettre de secrets dans les prompts, contrôler les sources RAG par utilisateur"],
        ["<b>Output filtering and validation</b>", "Filtres de contenu, vérification du format (JSON, schéma), règles métier"],
        ["<b>Audit trail and logging</b>", "<b>AWS CloudTrail</b> (qui a appelé quelle API), <b>logs d'invocation des modèles Bedrock</b> (prompts et réponses vers CloudWatch Logs ou S3), Amazon CloudWatch"],
        ["<b>Toxicity</b>", "Filtres de contenu de Guardrails, évaluation de la toxicité (Bedrock Model Evaluation)"]
      ]},
      { type: "trap", items: [
        "Vulnérabilités logicielles → <b>Inspector</b>. Données sensibles dans S3 → <b>Macie</b>. Qui a fait quoi via l'API → <b>CloudTrail</b>. Métriques et logs applicatifs → <b>CloudWatch</b>.",
        "Amazon GuardDuty, AWS WAF, AWS Security Hub et Amazon Cognito sont listés <b>hors périmètre</b> de l'examen : ils ne devraient pas être la bonne réponse."
      ]}
    ]},
    { task: "5.1", obj: ["5.1.e"], title: "Détecter les hallucinations et ancrer les réponses", blocks: [
      { type: "table", head: ["Technique", "Principe"], rows: [
        ["<b>RAG grounding</b>", "Fournir au modèle des sources fiables et lui demander de répondre <b>uniquement</b> à partir d'elles, avec citations"],
        ["<b>Contextual grounding check</b> (Guardrails)", "Score d'ancrage et de pertinence : bloquer les réponses non soutenues par les sources"],
        ["<b>Automated Reasoning checks</b> (Guardrails)", "Vérifier la réponse au regard de règles logiques formelles (ex. politique RH)"],
        ["<b>Output validation</b>", "Contrôles automatiques : format, valeurs plausibles, règles métier, vérification par un second modèle, relecture humaine"],
        ["<b>Confidence scoring</b>", "Associer un score de confiance (ancrage, pertinence, probabilité) et faire relire ou refuser en dessous d'un seuil"]
      ]},
      { type: "tip", text: "Ancrer (RAG) → Vérifier (grounding check, validation) → Mesurer la confiance → Escalader vers un humain si nécessaire." }
    ]},
    /* ======================= 5.2 ======================= */
    { task: "5.2", obj: ["5.2.a"], title: "Les services de gouvernance et de conformité", blocks: [
      { type: "table", head: ["Service", "Rôle", "Mot-clé"], rows: [
        ["<b>AWS Config</b>", "Enregistre la <b>configuration</b> des ressources et son historique, et évalue la conformité avec des <b>règles</b> (ex. bucket S3 non chiffré)", "configuration, règles, conformité continue"],
        ["<b>Amazon Inspector</b>", "Analyse automatique des <b>vulnérabilités</b> logicielles et de l'exposition réseau", "CVE, vulnérabilités"],
        ["<b>AWS Artifact</b>", "Portail en libre-service pour télécharger les <b>rapports de conformité d'AWS</b> (SOC, ISO…) et accepter des accords", "rapports d'audit AWS, accords"],
        ["<b>AWS CloudTrail</b>", "Journal des <b>appels d'API</b> et des actions des utilisateurs et des services : qui, quoi, quand", "audit, traçabilité"],
        ["<b>AWS Trusted Advisor</b>", "Recommandations de <b>bonnes pratiques</b> : coûts, sécurité, performance, tolérance aux pannes, quotas", "recommandations, best practices"],
        ["<b>Amazon CloudWatch</b>", "Métriques, logs, alarmes, tableaux de bord", "surveillance"],
        ["<b>AWS Well-Architected Tool</b>", "Revue d'une charge de travail selon les piliers Well-Architected, avec des <b>lentilles</b> (lenses) spécialisées comme ML ou GenAI", "revue d'architecture"],
        ["<b>AWS Budgets</b> / <b>AWS Cost Explorer</b>", "Gouvernance des <b>coûts</b> : budgets et alertes, analyse des dépenses (ex. coût des tokens)", "coûts"]
      ]},
      { type: "trap", items: [
        "Artifact = les rapports de conformité <b>d'AWS</b>. Il n'audite pas VOTRE compte.",
        "Config = l'<b>état</b> des ressources. CloudTrail = les <b>actions</b> (appels d'API).",
        "AWS Audit Manager (non listé dans le guide) automatise la collecte de preuves d'audit : utile en culture, mais les services cités ci-dessus sont prioritaires."
      ]}
    ]},
    { task: "5.2", obj: ["5.2.b"], title: "Stratégies de gouvernance des données", blocks: [
      { type: "table", head: ["Stratégie", "À retenir", "Exemples AWS"], rows: [
        ["<b>Data lifecycle</b>", "Collecte → stockage → usage → archivage → suppression", "Politiques de cycle de vie S3 (transition vers <b>Amazon S3 Glacier</b>, expiration)"],
        ["<b>Logging</b>", "Tracer les accès et les traitements", "CloudTrail, logs d'invocation Bedrock, CloudWatch Logs"],
        ["<b>Residency</b> (résidence)", "Garder les données dans une zone géographique imposée par la loi", "Choix de la <b>Région AWS</b>. Les données restent dans la Région choisie, sauf configuration contraire (ex. vérifier l'inférence inter-régions)"],
        ["<b>Monitoring</b>", "Surveiller la qualité, la dérive, les coûts et les accès", "CloudWatch, SageMaker Model Monitor, AWS Config"],
        ["<b>Observation</b>", "Observer le comportement réel du système (traces, sorties d'agents)", "AgentCore Observability, journaux"],
        ["<b>Retention</b>", "Conserver les données le temps nécessaire, ni plus ni moins", "Durée de rétention des logs, S3 Object Lock, expiration"]
      ]},
      { type: "trap", items: ["Une exigence « les données ne doivent pas quitter l'UE » concerne la <b>résidence</b> : choisissez une Région dans l'UE et vérifiez les fonctions qui traversent les Régions."] }
    ]},
    { task: "5.2", obj: ["5.2.c"], title: "Processus de gouvernance et Generative AI Security Scoping Matrix", blocks: [
      { type: "list", title: "Processus de gouvernance :", items: [
        "<b>Policies</b> : politiques d'usage acceptable de l'IA, de données, de sécurité.",
        "<b>Review cadence</b> : revues régulières (ex. trimestrielles) des modèles, des risques et des accès.",
        "<b>Review strategies</b> : revues techniques, juridiques, éthiques, comité de gouvernance de l'IA.",
        "<b>Governance frameworks</b> : par exemple la Generative AI Security Scoping Matrix d'AWS. D'autres cadres reconnus existent, comme le NIST AI RMF ou l'ISO/IEC 42001.",
        "<b>Transparency standards</b> : documentation (Model Cards), information des utilisateurs.",
        "<b>Team training requirements</b> : former les équipes à l'usage sûr et responsable de l'IA."
      ]},
      { type: "table", head: ["Scope", "Situation", "Exemple"], rows: [
        ["<b>1 · Consumer app</b>", "Utiliser une application GenAI <b>publique</b> grand public", "Un employé utilise un chatbot public"],
        ["<b>2 · Enterprise app</b>", "Utiliser une application SaaS d'entreprise avec des fonctions GenAI (contrat B2B)", "Outil SaaS avec assistant IA intégré"],
        ["<b>3 · Pre-trained models</b>", "Construire <b>votre</b> application sur un FM tiers existant (API), éventuellement avec RAG et agents", "Application sur Amazon Bedrock"],
        ["<b>4 · Fine-tuned models</b>", "<b>Fine-tuner</b> un FM existant avec vos données", "Modèle personnalisé dans Bedrock"],
        ["<b>5 · Self-trained models</b>", "Entraîner <b>votre propre</b> modèle de zéro", "Pré-entraînement sur vos données"]
      ]},
      { type: "tip", text: "Plus le scope augmente (1 → 5), plus <b>vous possédez et contrôlez</b> (modèle, données)… et plus <b>votre responsabilité</b> de sécurité et de gouvernance s'étend." },
      { type: "trap", items: ["Une app sur Bedrock <b>avec RAG</b> mais sans fine-tuning reste en <b>scope 3</b>. Le fine-tuning fait passer en scope 4."] }
    ]}
  ],
  flashcards: [
    { front: "Responsabilité partagée", back: "AWS : sécurité DU cloud. Client : sécurité DANS le cloud (données, IAM, configuration, usage)." },
    { front: "IAM", back: "Qui peut faire quoi sur quelles ressources (moindre privilège, rôles)." },
    { front: "AWS KMS", back: "Clés de chiffrement des données au repos." },
    { front: "Amazon Macie", back: "Découvrir et classer les données sensibles (PII) dans S3." },
    { front: "AWS PrivateLink", back: "Accéder à Bedrock ou SageMaker AI depuis un VPC sans passer par Internet." },
    { front: "AWS Secrets Manager", back: "Stocker et faire tourner les clés d'API et identifiants." },
    { front: "AgentCore Identity", back: "Identité, authentification et accès des agents (compatible avec les IdP existants)." },
    { front: "Policy in AgentCore", back: "Règles déterministes (compatibles Cedar) sur les appels d'outils des agents, évaluées avant exécution." },
    { front: "Data lineage", back: "Suivre l'origine et les transformations des données." },
    { front: "AWS Glue Data Catalog", back: "Catalogue des jeux de données et de leurs schémas." },
    { front: "AWS Lake Formation", back: "Permissions fines (tables, colonnes, lignes) sur le data lake." },
    { front: "Privacy-enhancing technologies", back: "Anonymisation, pseudonymisation, masquage, tokenisation, confidentialité différentielle." },
    { front: "Amazon Inspector", back: "Analyse des vulnérabilités logicielles (EC2, conteneurs, Lambda)." },
    { front: "AWS CloudTrail", back: "Journal des appels d'API : qui, quoi, quand." },
    { front: "Logs d'invocation Bedrock", back: "Enregistrer les prompts et réponses dans CloudWatch Logs ou S3, pour l'audit." },
    { front: "AWS Config", back: "Configuration des ressources et règles de conformité." },
    { front: "AWS Artifact", back: "Rapports de conformité d'AWS (SOC, ISO…) et accords." },
    { front: "AWS Trusted Advisor", back: "Recommandations : coût, sécurité, performance, tolérance aux pannes, quotas." },
    { front: "Well-Architected Tool", back: "Revue d'architecture selon les piliers, avec des lenses (ML, GenAI)." },
    { front: "Data residency", back: "Garder les données dans une zone imposée : choix de la Région AWS." },
    { front: "S3 Lifecycle → Glacier", back: "Archiver puis supprimer selon le cycle de vie des données." },
    { front: "Scoping Matrix : scope 3", back: "Votre app sur un FM pré-entraîné tiers (ex. Bedrock, éventuellement avec RAG)." },
    { front: "Scoping Matrix : scope 4", back: "FM fine-tuné avec vos données." },
    { front: "Scoping Matrix : scope 5", back: "Modèle entraîné de zéro par vous." },
    { front: "Confidence scoring", back: "Score de confiance : refuser ou faire relire sous un seuil." }
  ]
};

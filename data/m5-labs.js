/* Domaine 5 — Exercices pratiques */
window.MODULE_5 = window.MODULE_5 || {};
window.MODULE_5.labs = [
  { id: "m5-lab1", module: 5, task: "5.1", kind: "scenario", title: "Sécuriser une application GenAI de bout en bout",
    scenario: "Une mutuelle lance un assistant santé sur Amazon Bedrock avec RAG sur des documents internes (S3). Exigences : pas de trafic Internet vers Bedrock, aucune donnée de santé dans les réponses, clés d'API d'un service tiers protégées, traçabilité complète, données chiffrées avec des clés de l'entreprise. Listez les services à utiliser pour chaque exigence.",
    answer: "• Pas d'Internet : <b>AWS PrivateLink</b> (VPC endpoint Bedrock) dans un <b>Amazon VPC</b> privé.<br>• Données de santé : <b>Amazon Macie</b> pour les repérer dans S3 avant l'ingestion, puis <b>Guardrails</b> (filtres de PII, masquage) sur les réponses.<br>• Clés d'API : <b>AWS Secrets Manager</b>.<br>• Traçabilité : <b>AWS CloudTrail</b> (appels d'API) et <b>logs d'invocation Bedrock</b> (prompts et réponses), surveillés dans <b>Amazon CloudWatch</b>.<br>• Chiffrement : <b>AWS KMS</b> avec des clés gérées par le client (S3, Knowledge Base).<br>• Accès : rôles <b>IAM</b> à moindre privilège.",
    why: "C'est l'objectif 5.1.a appliqué à une architecture réelle." },

  { id: "m5-lab2", module: 5, task: "5.2", kind: "scenario", title: "Quel service de gouvernance ?",
    scenario: "Associez chaque besoin à un service :<br>1) Télécharger le rapport SOC 2 d'AWS pour un auditeur.<br>2) Savoir qui a supprimé une Knowledge Base hier à 14 h.<br>3) Être alerté si un bucket de données d'entraînement devient public.<br>4) Recevoir des recommandations de sécurité et de coût sur le compte.<br>5) Détecter une bibliothèque vulnérable dans l'image de conteneur de l'application.<br>6) Être alerté si les dépenses IA dépassent 200 $ par mois.",
    answer: "1) <b>AWS Artifact</b> · 2) <b>AWS CloudTrail</b> · 3) <b>AWS Config</b> (règle managée) · 4) <b>AWS Trusted Advisor</b> · 5) <b>Amazon Inspector</b> · 6) <b>AWS Budgets</b>.",
    why: "Ces 5 services de 5.2.a (plus Budgets) sont presque toujours dans les distracteurs les uns des autres." },

  { id: "m5-lab3", module: 5, task: "5.2", kind: "scenario", title: "Classer avec la Generative AI Security Scoping Matrix",
    scenario: "Indiquez le scope (1 à 5) de chaque cas :<br>a) Les commerciaux utilisent un chatbot grand public gratuit.<br>b) L'entreprise utilise un CRM SaaS qui intègre un assistant IA, sous contrat.<br>c) L'équipe crée un assistant interne sur Amazon Bedrock avec une Knowledge Base.<br>d) L'équipe fine-tune un modèle Bedrock sur ses rapports d'expertise.<br>e) Un labo de R&amp;D entraîne son propre modèle de zéro.",
    answer: "a) <b>Scope 1</b> (consumer app) · b) <b>Scope 2</b> (enterprise app) · c) <b>Scope 3</b> (pre-trained model, même avec RAG) · d) <b>Scope 4</b> (fine-tuned) · e) <b>Scope 5</b> (self-trained).",
    why: "Plus le scope est élevé, plus l'entreprise contrôle le modèle et les données, et plus sa responsabilité de sécurité est grande." },

  { id: "m5-lab4", module: 5, task: "5.1", kind: "console", title: "TP : retrouver vos appels Bedrock dans CloudTrail",
    cost: "La consultation de l'<b>Event history</b> de CloudTrail (90 derniers jours d'événements de gestion) est sans frais supplémentaires. Ne créez pas de trail ni de CloudTrail Lake pour ce TP (facturables). Si vous lancez un appel de modèle pour générer un événement, il est facturé en tokens.",
    steps: [
      "Faites une action dans Amazon Bedrock (ex. créer puis supprimer un guardrail de test, ou lister les modèles).",
      "Ouvrez <b>AWS CloudTrail</b>, puis <b>Event history</b>.",
      "Filtrez par <b>Event source</b> = bedrock.amazonaws.com.",
      "Ouvrez un événement et repérez : <b>userIdentity</b> (qui), <b>eventName</b> (quoi), <b>eventTime</b> (quand), <b>sourceIPAddress</b>."
    ],
    expected: "Vous retrouvez vos actions Bedrock avec l'identité IAM, l'heure et l'adresse IP : c'est la <b>piste d'audit</b> exigée par la gouvernance.",
    why: "Objectifs 5.1.d (audit trail) et 5.2.a (CloudTrail)." },

  { id: "m5-lab5", module: 5, task: "5.2", kind: "console", title: "TP : télécharger un rapport de conformité dans AWS Artifact",
    cost: "AWS Artifact est un service gratuit.",
    steps: [
      "Ouvrez <b>AWS Artifact</b> dans la console.",
      "Allez dans <b>Reports</b> et recherchez « SOC » ou « ISO ».",
      "Ouvrez la fiche d'un rapport et lisez les conditions (certains rapports demandent d'accepter des conditions de confidentialité avant le téléchargement).",
      "Observez aussi la section <b>Agreements</b> (accords disponibles selon le compte)."
    ],
    expected: "Vous accédez aux rapports de conformité <b>d'AWS</b>, utilisables comme preuves dans votre propre démarche de conformité.",
    why: "Objectif 5.2.a : distinguer Artifact (rapports d'AWS) de Config (conformité de VOS ressources)." }
];

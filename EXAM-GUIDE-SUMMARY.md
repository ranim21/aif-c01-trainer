# AWS Certified AI Practitioner (AIF-C01) — Résumé du guide d'examen officiel

> **Source de vérité du projet.** Tout contenu (cours, questions, niveaux) doit correspondre à ce fichier.
> Contenu recopié fidèlement depuis les pages officielles AWS (texte des objectifs laissé en anglais, comme à l'examen).

## Sources (consultées le 2026-11-02)
| Source | URL |
|---|---|
| Guide d'examen officiel (page principale) | https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html |
| Domaine 1 | https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01-domain1.html |
| Domaine 2 | https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01-domain2.html |
| Domaine 3 | https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01-domain3.html |
| Domaine 4 | https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01-domain4.html |
| Domaine 5 | https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01-domain5.html |
| Services in-scope | https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-in-scope-services.html |
| Services out-of-scope | https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-out-of-scope-services.html |
| Révisions | https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html |
| Page de certification | https://aws.amazon.com/certification/certified-ai-practitioner/ |

Note : la page de certification renvoie maintenant (« Review the exam guide ») vers la page HTML de docs.aws.amazon.com. Elle ne propose plus de PDF.

**Version du guide : 1.2, publiée le 29 octobre 2026.** Historique : 1.0 (26 mars 2026), 1.1 (30 avril 2026), 1.2 (29 octobre 2026).
AWS indique que les mises à jour du guide sont publiées **environ un mois avant** d'être appliquées à l'examen.

---

## Format de l'examen
| Élément | Valeur | Source |
|---|---|---|
| Nombre de questions | **65** = **50 notées** + **15 non notées** (non identifiées) | guide + page certif |
| Durée | **90 minutes** | page certif |
| Score | échelle **100–1 000**, réussite à **700** | guide |
| Modèle de notation | **compensatoire** : pas besoin de réussir chaque domaine, seulement l'examen global | guide |
| Question sans réponse | comptée fausse ; **pas de pénalité** pour une mauvaise réponse | guide |
| Prix | 100 USD | page certif |
| Modalités | centre Pearson VUE ou en ligne (surveillé) | page certif |
| Langues | dont anglais et français (France) | page certif |
| Validité | 3 ans | page certif |

### Types de questions (officiels)
- **Multiple choice** : 1 bonne réponse et 3 distracteurs.
- **Multiple response** : au moins 2 bonnes réponses parmi au moins 5 options. Il faut toutes les cocher pour avoir le point.
- **Ordering** : 3 à 5 éléments à sélectionner et à mettre dans le bon ordre.
- **Matching** : associer des réponses à une liste de 3 à 7 énoncés. Toutes les paires doivent être justes.

### Candidat cible
- Jusqu'à 6 mois d'exposition aux technologies AI/ML sur AWS. Il **utilise** des solutions AI/ML sans forcément les **construire**.
- Connaissances AWS recommandées : services de base (EC2, S3, Lambda, Bedrock, SageMaker AI) et leurs cas d'usage, modèle de responsabilité partagée, IAM, modèles de tarification AWS.

### Hors périmètre pour le candidat (tâches)
Coder des modèles ou des algorithmes ; data engineering et feature engineering ; réglage d'hyperparamètres et optimisation de modèles ; construire et déployer des pipelines ou une infrastructure ; analyse mathématique ou statistique ; mettre en œuvre des protocoles de sécurité ou de conformité ; développer des frameworks de gouvernance.

---

## Domaines et pondérations (du contenu noté)
| # | Domaine | Poids | Task statements |
|---|---|---|---|
| 1 | Fundamentals of AI and ML | **20 %** | 1.1, 1.2, 1.3 |
| 2 | Fundamentals of GenAI | **24 %** | 2.1, 2.2, 2.3 |
| 3 | Applications of Foundation Models | **28 %** | 3.1, 3.2, 3.3, 3.4 |
| 4 | Guidelines for Responsible AI | **14 %** | 4.1, 4.2 |
| 5 | Security, Compliance, and Governance for AI Solutions | **14 %** | 5.1, 5.2 |

Cela fait 14 task statements au total.

---

## Domaine 1 — Fundamentals of AI and ML (20 %)

### 1.1 Explain basic AI concepts and terminologies.
- Define basic AI terms (AI, ML, deep learning, neural networks, computer vision, NLP, model, algorithm, training and inferencing, bias, fairness, fit, LLM, GenAI, **agentic AI**).
- Describe the similarities and differences between AI, ML, GenAI, deep learning, and agentic AI.
- Describe various types of inferencing (batch, real-time, asynchronous, serverless).
- Describe the different types of data in AI models (labeled/unlabeled, tabular, time-series, image, text, structured/unstructured).
- Describe different types of AI/ML learning (supervised, unsupervised, reinforcement learning methods).

### 1.2 Identify practical use cases for AI.
- Recognize applications where AI/ML can provide value (assist human decision making, solution scalability, automation).
- Determine when AI/ML solutions are not appropriate (cost-benefit analyses, situations when a specific outcome is needed instead of a prediction).
- Select the appropriate AI/ML techniques for specific use cases (regression, classification, clustering).
- Identify examples of real-world AI applications (computer vision, NLP, speech recognition, recommendation systems, fraud detection, forecasting, knowledge bases, agentic AI).
- Explain the capabilities of AWS managed AI/ML services (SageMaker AI, Transcribe, Translate, Comprehend, Lex, Polly).
- Identify when traditional ML models or foundation models (FMs) are appropriate for a specific use case (regulatory concerns, explainability requirements, operational constraints).

### 1.3 Describe the AI/ML development lifecycle.
- Describe and differentiate components of an AI/ML pipeline.
- Describe sources of FM models (open source pre-trained models, training custom models).
- Describe methods to use a model in production (managed API service, self-hosted API).
- Identify relevant AWS services and features for each stage of an AI/ML pipeline (Amazon Bedrock, **Amazon Quick**, **Kiro**, SageMaker AI).
- Describe fundamental concepts of MLOps (experimentation, repeatable processes, scalable systems, managing technical debt, achieving production readiness, model monitoring, model re-training).
- Describe model performance metrics (accuracy, precision, recall, F1 score) and business metrics (cost per user, development costs, customer feedback, ROI).

## Domaine 2 — Fundamentals of GenAI (24 %)

### 2.1 Explain the basic concepts of generative AI.
- Define foundational GenAI concepts (tokens, chunking, embeddings, vectors, prompt engineering, transformer-based LLMs, FMs, multi-modal models, diffusion models).
- Identify potential use cases for GenAI models (image/video/audio generation, summarization, AI assistants, translation, code generation, customer service agents, search, recommendation engines).
- Describe the FM lifecycle (data selection, model selection, pre-training, fine-tuning, evaluation, deployment, feedback).
- Describe the token-based pricing model and its effect on cost and performance for inference.
- Describe the role of **context engineering** in FM applications.
- Define foundational **agentic AI** concepts (multi-agent system patterns, **Model Context Protocol (MCP)** and its role in connecting agents to external systems, multi-agent communication patterns, memory management, tool usage, workflow orchestration).

### 2.2 Understand the capabilities and limitations of GenAI for solving business problems.
- Describe the advantages of GenAI (adaptability, responsiveness, conversational capabilities, ability to generate content).
- Identify disadvantages of GenAI solutions (hallucinations, interpretability, inaccuracy, nondeterminism).
- Identify factors to consider when selecting GenAI models (model types, performance requirements, capabilities, constraints, compliance, cost, latency, model complexity).
- Determine business value and metrics for GenAI applications (cross-domain performance, ROI, efficiency, conversion rate, average revenue per user, accuracy, customer lifetime value).

### 2.3 Describe AWS infrastructure and technologies for building GenAI applications.
- Identify AWS services and features to develop GenAI applications (Amazon Bedrock, SageMaker AI, SageMaker JumpStart, **Amazon Quick**, **Kiro**, **Strands Agents**, **Amazon Bedrock AgentCore**).
- Describe the advantages of using AWS GenAI services (accessibility, lower barrier to entry, efficiency, cost-effectiveness, speed to market, ability to meet business objectives).
- Describe the benefits of AWS infrastructure for GenAI applications (security, compliance, responsibility, safety).
- Describe cost tradeoffs of AWS GenAI services (responsiveness, availability, redundancy, performance, regional coverage, token-based pricing, provisioned throughput, custom models).

## Domaine 3 — Applications of Foundation Models (28 %)

### 3.1 Describe design considerations for applications that use FMs.
- Identify selection criteria to choose FMs (cost, modality, latency, multi-lingual, model size, model complexity, customization, input/output length, **prompt caching**).
- Describe the effect of inference parameters on model responses (temperature, input/output length).
- Define RAG and describe its business applications (Amazon Bedrock Knowledge Bases).
- Identify AWS services that help store embeddings within vector databases (OpenSearch Service, Aurora, Neptune, RDS for PostgreSQL).
- Explain the cost tradeoffs of FM customization approaches (pre-training, fine-tuning, in-context learning, RAG, **model distillation**).
- Define the role of AI agents and describe AI agents' business applications.

### 3.2 Choose effective prompt engineering techniques.
- Define the concepts and constructs of prompt engineering (context, instruction, negative prompts).
- Define techniques for prompt engineering (chain-of-thought, zero-shot, single-shot, few-shot, prompt templates).
- Identify and describe the benefits and best practices (response quality improvement, experimentation, guardrails, discovery, specificity and concision, using multiple comments).
- Define potential risks and limitations (exposure, poisoning, hijacking, jailbreaking).
- Describe prompt versioning and management strategies that use **Amazon Bedrock Prompt Management**.

### 3.3 Describe the training and fine-tuning process for FMs.
- Describe the key elements of training an FM (pre-training, fine-tuning, continuous pre-training, distillation).
- Define methods for fine-tuning an FM (instruction tuning, adapting models for specific domains, transfer learning, continuous pre-training).
- Describe how to prepare data to fine-tune an FM (data curation, governance, size, labeling, representativeness, RLHF).

### 3.4 Describe methods to evaluate FM performance.
- Determine approaches to evaluate FM performance (human-in-the-loop evaluation, benchmark datasets, Amazon Bedrock Model Evaluation).
- Identify relevant metrics (ROUGE, BLEU, BERTScore, **LLM-as-a-judge**).
- Determine whether an FM effectively meets business objectives (productivity, user engagement, task engineering).
- Identify approaches to evaluate the performance of applications built with FMs (RAG, agents, workflows).
- Identify business objective alignment metrics (task completion rate, user satisfaction, cost per interaction).

## Domaine 4 — Guidelines for Responsible AI (14 %)

### 4.1 Explain the development of AI systems that are responsible.
- Identify features of responsible AI (bias, fairness, inclusivity, robustness, safety, veracity).
- Explain how to use tools to identify features of responsible AI (Amazon Bedrock Guardrails).
- Define responsible practices to select a model (environmental considerations, sustainability).
- Identify legal risks of working with GenAI (IP infringement claims, biased model outputs, loss of customer trust, end user risk, hallucinations).
- Identify characteristics of datasets (inclusivity, diversity, curated data sources, balanced datasets).
- Describe effects of bias and variance (effects on demographic groups, inaccuracy, overfitting, underfitting).
- Describe tools to detect and monitor bias, trustworthiness, and truthfulness (analyzing label quality, human audits, subgroup analysis).

### 4.2 Recognize the importance of transparent and explainable models.
- Describe the differences between models that are transparent and explainable and models that are not.
- Describe tools to identify transparent and explainable models (SageMaker Model Cards, Bedrock Model Evaluations, open source models, data, licensing).
- Identify tradeoffs between model safety and transparency (measure interpretability and performance).
- Describe principles of human-centered design for explainable AI (user-feedback mechanisms, AI decision transparency).

## Domaine 5 — Security, Compliance, and Governance for AI Solutions (14 %)

### 5.1 Explain methods to secure AI systems.
- Identify AWS services and features to secure AI systems (IAM roles, policies, and permissions; encryption; Amazon Macie; AWS PrivateLink; AWS shared responsibility model; **Amazon Bedrock AgentCore Identity**; **Policy in AgentCore**; Amazon Bedrock Guardrails).
- Describe source citation and documenting data origins (data lineage, data cataloging, SageMaker Model Cards).
- Describe best practices for secure data engineering (assessing data quality, privacy-enhancing technologies, data access control, data integrity).
- Describe security and privacy considerations for AI systems (application security, threat detection, vulnerability management, infrastructure protection, prompt injection, encryption at rest and in transit, data leakage prevention, output filtering and validation, audit trail and logging for AI interactions, toxicity).
- Describe hallucination detection methods and grounding techniques (RAG grounding, output validation, confidence scoring).

### 5.2 Recognize governance and compliance regulations for AI systems.
- Identify AWS services and features to assist with governance and compliance (AWS Config, Amazon Inspector, AWS Artifact, AWS CloudTrail, AWS Trusted Advisor).
- Describe data governance strategies (data lifecycles, logging, residency, monitoring, observation, retention).
- Describe processes to follow governance protocols (policies, review cadence, review strategies, governance frameworks such as the **Generative AI Security Scoping Matrix**, transparency standards, team training requirements).

---

## Services AWS in-scope (liste officielle, non exhaustive)
- **Analytics** : AWS Data Exchange, Amazon EMR, AWS Glue, AWS Glue DataBrew, AWS Lake Formation, Amazon OpenSearch Service, Amazon Quick, Amazon Redshift
- **Cloud Financial Management** : AWS Budgets, AWS Cost Explorer
- **Compute** : Amazon EC2, AWS Lambda
- **Containers** : Amazon ECS, Amazon EKS
- **Database** : Amazon Aurora, Amazon DocumentDB, Amazon DynamoDB, Amazon ElastiCache, Amazon Neptune, Amazon RDS
- **Developer Tools** : Kiro, Strands Agents
- **Machine Learning** : Amazon Bedrock, Amazon Bedrock AgentCore, Amazon Comprehend, Amazon Lex, Amazon Nova, Amazon Personalize, Amazon Polly, Amazon Rekognition, Amazon SageMaker AI, Amazon SageMaker JumpStart, Amazon Textract, Amazon Transcribe, Amazon Translate, AWS Transform
- **Management and Governance** : AWS CloudTrail, Amazon CloudWatch, AWS Config, AWS Trusted Advisor, AWS Well-Architected Tool
- **Networking** : Amazon CloudFront, Amazon VPC
- **Security, Identity, and Compliance** : AWS Artifact, IAM, Amazon Inspector, AWS KMS, Amazon Macie, AWS Secrets Manager
- **Storage** : Amazon S3, Amazon S3 Glacier

## Services out-of-scope (extrait pertinent)
- **ML** : AWS HealthImaging, AWS HealthOmics
- **Security** : ACM, CloudHSM, **Amazon Cognito**, Amazon Detective, Directory Service, Firewall Manager, **Amazon GuardDuty**, Payment Cryptography, Private CA, RAM, **AWS Security Hub**, Amazon Security Lake, AWS Shield, AWS Signer, Verified Permissions, **AWS WAF**
- **Management** : AWS Control Tower, Health Dashboard, Launch Wizard, License Manager, Managed Grafana, Managed Prometheus, Resilience Hub, Resource Explorer, Resource Groups, Incident Manager, Service Catalog, Service Quotas, Telco Network Builder, User Notifications
- Autres : AWS Clean Rooms, CloudSearch, MSK, AppFlow, MQ, SWF, SES, Supply Chain, Wickr, Elastic Beanstalk, EC2 Image Builder, Lightsail, ROSA, AWS Support, Keyspaces, Timestream, AppConfig, Application Composer, CloudShell, FIS, X-Ray, WorkSpaces/AppStream, Amplify, Device Farm, Location Service, l'ensemble d'IoT, les services Elemental Media et IVS, Migration & Transfer, Cloud Map, Direct Connect, Global Accelerator, Route 53, IPAM, AWS Backup, Elastic Disaster Recovery.
- La révision 1.2 a **retiré** de la liste out-of-scope : Elastic Transcoder, Elemental MediaStore, IoT 1-Click, IoT Analytics, IoT Events, Nimble Studio (services retirés par AWS, d'après la page).

## Règles dérivées pour le projet
1. **Examen blanc** : 65 questions, 90 min, proportions 20/24/28/14/14. Score sur 1 000 avec réussite à 700. Le vrai score est mis à l'échelle et inconnu : notre conversion est **une estimation**.
2. **Types de questions** : single (4 options, 1 correcte), multiple (au moins 5 options, au moins 2 correctes, crédit seulement si tout est juste), ordering (3 à 5 éléments), matching (3 à 7 paires). « Scenario » n'est pas un type officiel, c'est un **style** de question (mise en situation) qu'on applique aux 4 formats.
3. Un niveau de jeu par task statement : 3 + 3 + 4 + 2 + 2 = **14 niveaux de base**, plus des niveaux bonus.
4. Les services out-of-scope ne doivent **jamais** être une bonne réponse. Ils peuvent servir de distracteurs avec parcimonie.

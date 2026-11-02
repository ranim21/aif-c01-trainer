# À vérifier dans la documentation AWS

Les points listés ici ne sont pas confirmés par le guide officiel (voir EXAM-GUIDE-SUMMARY.md), ou risquent d'avoir changé récemment.
Pour chacun : vérifier sur docs.aws.amazon.com, puis cocher.

## Périmètre
- [x] **Version du guide en vigueur à la date de l'examen** : v1.2 (publiée le 2026-10-29, appliquée vers fin novembre). Examen le 2026-12-15, donc v1.2.
- [ ] Services cités dans le prompt du projet mais **absents de la liste in-scope** (et absents de la liste out-of-scope) : **Amazon Kendra**, **Amazon Q** (Business/Developer), **AWS Audit Manager**. Les listes ne sont pas exhaustives. Ces services sont couverts en « culture complémentaire » et marqués comme tels.
- [ ] **Amazon Quick** : nom exact, rapport avec Amazon Q Business / QuickSight, fonctionnalités principales.
- [ ] **Kiro**, **Strands Agents**, **Amazon Bedrock AgentCore** (Runtime, Memory, Gateway, Identity, Policy, Observability…), **AWS Transform**, **Amazon Nova** : fonctionnalités exactes à confirmer avant d'écrire les questions des Phases 2 et 3.
- [ ] **Policy in AgentCore** : nom exact et rôle.

## Faits techniques (complété au fil des phases)

### Monde 1
- [ ] **Amazon Quick** : présenté dans le cours comme un « espace de travail agentique pour les équipes métier : BI (successeur de QuickSight), recherche, automatisation de workflows ». Sources consultées : billet du AWS News Blog sur le lancement d'Amazon Quick Suite (octobre 2025) et articles tiers. Le renommage en « Amazon Quick » n'est confirmé que par une source tierce, plus le guide d'examen qui utilise ce nom. Questions concernées : m1-038, m1-039.
- [ ] **Kiro** : présenté comme un « IDE agentique d'AWS, développement guidé par des spécifications (exigences → conception → tâches) ». Sources : articles tiers, la documentation officielle (kiro.dev) n'a pas été lue. Question concernée : m1-038.
- [ ] **SageMaker AI Asynchronous inference** : gros payloads et traitement long, file d'attente, mise à l'échelle jusqu'à 0 instance. Le cours ne cite volontairement aucune limite chiffrée (taille, durée). Question m1-004.
- [ ] **SageMaker Serverless inference** : présenté comme limité pour les gros payloads et les traitements longs, sans chiffre. Question m1-004 (option fausse).
- [ ] **TP console** (m1-lab5 à lab7) : noms exacts des menus de la console (« Real-time analysis » dans Comprehend, « Label detection » dans Rekognition) et conditions actuelles de l'offre gratuite AWS (le programme Free Tier a changé en 2025 : vérifier votre compte).

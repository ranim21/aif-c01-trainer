/* Domaine 4 — Guidelines for Responsible AI (14 %) — Cours + flashcards */
window.MODULE_4 = window.MODULE_4 || {};
window.MODULE_4.course = {
  intro: "Une IA utile doit aussi être juste, sûre, transparente et explicable. Ce domaine (14 %) couvre les caractéristiques d'une IA responsable, les risques juridiques, la qualité des données, le biais et la variance, ainsi que les outils AWS pour détecter, surveiller et documenter.",
  sections: [
    /* ======================= 4.1 ======================= */
    { task: "4.1", obj: ["4.1.a"], title: "Les caractéristiques d'une IA responsable", blocks: [
      { type: "table", head: ["Caractéristique", "Définition", "Exemple de problème"], rows: [
        ["<b>Bias</b> / <b>Fairness</b> (équité)", "Résultats équitables pour tous les groupes (genre, âge, origine…)", "Un modèle de crédit qui refuse plus souvent un groupe à profil égal"],
        ["<b>Inclusivity</b>", "Le système fonctionne pour <b>tous</b> les utilisateurs visés (langues, accents, handicaps)", "Reconnaissance vocale inefficace pour certains accents"],
        ["<b>Robustness</b>", "Performance stable face aux variations, au bruit et aux entrées inattendues ou adverses", "Le modèle change de réponse à cause d'une simple faute de frappe"],
        ["<b>Safety</b> (sûreté)", "Ne produit pas de contenu nuisible ou dangereux", "Instructions dangereuses, contenu haineux"],
        ["<b>Veracity</b> (véracité)", "Les sorties sont exactes et vraies", "Hallucinations présentées comme des faits"],
        ["Autres dimensions AWS", "Explicabilité, confidentialité et sécurité, contrôlabilité, gouvernance, transparence", ""]
      ]},
      { type: "trap", items: ["Robustesse = <b>stabilité face aux perturbations</b>. Véracité = <b>exactitude</b>. Ne les confondez pas."] }
    ]},
    { task: "4.1", obj: ["4.1.b"], title: "Amazon Bedrock Guardrails", blocks: [
      { type: "p", text: "Guardrails applique des garde-fous <b>configurables</b> aux <b>entrées</b> des utilisateurs et aux <b>sorties</b> des modèles, de façon cohérente quel que soit le FM. On peut aussi l'utiliser sans appeler de modèle, grâce à l'API <b>ApplyGuardrail</b>." },
      { type: "table", head: ["Filtre", "Rôle"], rows: [
        ["<b>Content filters</b>", "Détecter et filtrer les contenus nuisibles : Hate, Insults, Sexual, Violence, Misconduct, <b>Prompt Attack</b>, avec une intensité réglable par catégorie"],
        ["<b>Denied topics</b>", "Bloquer des sujets interdits définis par l'entreprise (ex. conseils d'investissement)"],
        ["<b>Word filters</b>", "Bloquer des mots ou expressions (grossièretés, noms de concurrents)"],
        ["<b>Sensitive information filters</b>", "Bloquer ou <b>masquer</b> les PII (numéro de sécurité sociale, adresse…) et des motifs personnalisés (regex)"],
        ["<b>Contextual grounding check</b>", "Détecter les réponses <b>non ancrées</b> dans les sources (hallucinations) ou hors sujet, notamment en RAG"],
        ["<b>Automated Reasoning checks</b>", "Vérifier l'exactitude d'une réponse au regard de <b>règles logiques</b> définies, pour détecter les hallucinations et les hypothèses implicites"]
      ]},
      { type: "tip", text: "Guardrails = les « barrières de sécurité » autour du modèle : on filtre ce qui entre ET ce qui sort." },
      { type: "trap", items: ["Guardrails ne <b>réentraîne pas</b> le modèle et ne <b>chiffre</b> pas les données : il filtre et masque."] }
    ]},
    { task: "4.1", obj: ["4.1.c"], title: "Choisir un modèle de façon responsable : environnement et durabilité", blocks: [
      { type: "list", items: [
        "Préférer le <b>plus petit modèle</b> qui répond au besoin : moins de calcul, donc moins d'énergie (et moins de coût).",
        "<b>Réutiliser</b> des FM pré-entraînés (prompting, RAG, fine-tuning léger) plutôt qu'entraîner de zéro.",
        "Utiliser du matériel efficace (ex. AWS Trainium et AWS Inferentia) et des services managés mutualisés.",
        "Tenir compte de la Région (mix énergétique) et éviter les calculs inutiles (batch, mise en cache).",
        "Évaluer aussi l'équité, la sûreté, la licence et la transparence du modèle (documentation, cartes de modèle)."
      ]},
      { type: "trap", items: ["« Le plus gros modèle » n'est jamais le choix responsable par défaut : il consomme plus de ressources pour souvent peu de gain."] }
    ]},
    { task: "4.1", obj: ["4.1.d"], title: "Les risques juridiques de la GenAI", blocks: [
      { type: "table", head: ["Risque", "Exemple", "Atténuation"], rows: [
        ["<b>Intellectual property</b> infringement claims", "Le modèle reproduit un texte, du code ou une image protégés", "Vérifier les licences et la provenance des données, filtrer les sorties, relecture humaine"],
        ["<b>Biased model outputs</b>", "Recommandations discriminatoires", "Données équilibrées, analyse par sous-groupes, SageMaker Clarify"],
        ["<b>Loss of customer trust</b>", "Réponses offensantes ou fausses rendues publiques", "Guardrails, tests, transparence sur l'usage de l'IA"],
        ["<b>End user risk</b>", "Un conseil médical ou financier erroné cause un préjudice", "Avertissements, limites d'usage, humain dans la boucle"],
        ["<b>Hallucinations</b>", "Fausses informations présentées comme vraies (ex. jurisprudence inventée)", "RAG, contextual grounding, validation"]
      ]}
    ]},
    { task: "4.1", obj: ["4.1.e"], title: "Les caractéristiques d'un bon dataset", blocks: [
      { type: "table", head: ["Caractéristique", "Pourquoi"], rows: [
        ["<b>Inclusivity</b>", "Tous les groupes concernés sont présents"],
        ["<b>Diversity</b>", "Variété de situations, de langues, de formats, de sources"],
        ["<b>Curated data sources</b>", "Sources fiables, vérifiées, avec des droits d'usage clairs"],
        ["<b>Balanced datasets</b>", "Classes et groupes en proportions adaptées, pour éviter qu'un groupe minoritaire soit mal appris"]
      ]},
      { type: "trap", items: ["Plus de données ne règle pas un dataset <b>déséquilibré</b> : il faut rééquilibrer ou compléter les groupes sous-représentés."] }
    ]},
    { task: "4.1", obj: ["4.1.f"], title: "Les effets du biais et de la variance", blocks: [
      { type: "table", head: ["", "High bias (underfitting)", "High variance (overfitting)"], rows: [
        ["Symptôme", "Erreurs élevées partout", "Très bon en entraînement, mauvais sur les nouvelles données"],
        ["Effet", "Inexactitude générale, tendances ignorées", "Instabilité, mauvaise généralisation"],
        ["Effet sur les groupes démographiques", "Un modèle trop simple peut ignorer les spécificités d'un groupe et le pénaliser", "Un modèle qui « apprend par cœur » les biais d'un échantillon peut les amplifier pour les groupes peu représentés"]
      ]},
      { type: "p", text: "Le <b>biais</b> au sens éthique (traitement injuste d'un groupe) peut venir des <b>données</b> (sous-représentation, étiquettes biaisées), des <b>choix de conception</b> ou de l'<b>usage</b> du modèle." },
      { type: "trap", items: ["Attention au double sens de « bias » : statistique (underfitting) et éthique (injustice). Lisez le contexte de la question."] }
    ]},
    { task: "4.1", obj: ["4.1.g"], title: "Détecter et surveiller le biais et la véracité", blocks: [
      { type: "table", head: ["Méthode / outil", "Rôle"], rows: [
        ["<b>Analyzing label quality</b>", "Vérifier que les étiquettes sont justes et cohérentes : des étiquettes biaisées produisent un modèle biaisé"],
        ["<b>Human audits</b>", "Revue humaine régulière d'échantillons de sorties (ex. Amazon Augmented AI pour la revue humaine)"],
        ["<b>Subgroup analysis</b>", "Mesurer la performance <b>par groupe</b> (âge, genre, région) pour repérer les écarts"],
        ["<b>Amazon SageMaker Clarify</b>", "Détecter le biais <b>avant</b> l'entraînement (dans les données) et <b>après</b> (dans les prédictions), et expliquer les prédictions (importance des variables)"],
        ["<b>SageMaker Model Monitor</b> (avec Clarify)", "Surveiller en production la dérive du biais et de l'importance des variables"],
        ["<b>Bedrock Model Evaluation</b>", "Évaluer l'exactitude, la robustesse et la toxicité des FM"]
      ]},
      { type: "tip", text: "Biais dans les données ou les prédictions d'un modèle ML → <b>SageMaker Clarify</b>. Contenu nuisible d'un FM → <b>Bedrock Guardrails</b>." }
    ]},
    /* ======================= 4.2 ======================= */
    { task: "4.2", obj: ["4.2.a"], title: "Transparence et explicabilité", blocks: [
      { type: "table", head: ["", "Modèle transparent / explicable", "Modèle « boîte noire »"], rows: [
        ["Exemples", "Régression linéaire ou logistique, arbre de décision", "Réseau de neurones profond, LLM"],
        ["Compréhension", "On voit <b>comment</b> la décision est prise (coefficients, règles)", "Le raisonnement interne n'est pas lisible directement"],
        ["Avantages", "Confiance, audit, conformité réglementaire", "Souvent plus performant sur des tâches complexes"],
        ["Outils", "Lecture directe du modèle", "Explications <b>a posteriori</b> : importance des variables (ex. SHAP via SageMaker Clarify), citations de sources"]
      ]},
      { type: "p", text: "<b>Transparence</b> : être clair sur le fonctionnement, les données, les limites et l'usage du système. <b>Explicabilité</b> : pouvoir expliquer <b>pourquoi</b> une décision ou une sortie a été produite." }
    ]},
    { task: "4.2", obj: ["4.2.b"], title: "Outils pour documenter et identifier les modèles transparents", blocks: [
      { type: "table", head: ["Outil / ressource", "Rôle"], rows: [
        ["<b>Amazon SageMaker Model Cards</b>", "Documenter un modèle : usage prévu, risques, données d'entraînement, résultats d'évaluation, considérations éthiques. Fiche de référence pour la gouvernance et l'audit"],
        ["<b>Amazon Bedrock Model Evaluations</b>", "Résultats d'évaluation comparables (exactitude, robustesse, toxicité) pour choisir un modèle en connaissance de cause"],
        ["<b>Open source models</b>", "Poids, architecture et parfois données consultables : plus de transparence"],
        ["<b>Data</b> (documentation des données)", "Provenance, composition et limites des données d'entraînement"],
        ["<b>Licensing</b>", "Conditions d'utilisation du modèle et des données (usage commercial, restrictions)"],
        ["<b>AWS AI Service Cards</b>", "Documents de transparence publiés par AWS sur ses services d'IA : cas d'usage prévus, limites, bonnes pratiques"]
      ]},
      { type: "trap", items: ["Model Cards = <b>documentation</b> (transparence, gouvernance). Clarify = <b>mesure</b> du biais et explicabilité. Model Monitor = <b>surveillance</b> en production."] }
    ]},
    { task: "4.2", obj: ["4.2.c"], title: "Compromis entre sûreté, transparence, interprétabilité et performance", blocks: [
      { type: "list", items: [
        "<b>Interpretability vs performance</b> : les modèles les plus interprétables sont souvent moins performants sur les tâches complexes, et inversement.",
        "<b>Safety vs transparency</b> : révéler tous les détails d'un modèle (données, filtres) peut aider des attaquants à le contourner. À l'inverse, trop de secret réduit la confiance et l'auditabilité.",
        "Il faut <b>mesurer</b> l'interprétabilité et la performance, puis choisir selon le contexte : un domaine réglementé (crédit, santé) favorise l'explicabilité.",
        "Les filtres de sûreté (Guardrails) peuvent bloquer des réponses légitimes (faux positifs) : il faut les calibrer."
      ]},
      { type: "trap", items: ["Quand la loi exige d'<b>expliquer chaque décision</b>, la bonne réponse privilégie un modèle interprétable, même un peu moins précis."] }
    ]},
    { task: "4.2", obj: ["4.2.d"], title: "Conception centrée sur l'humain pour une IA explicable", blocks: [
      { type: "list", items: [
        "<b>AI decision transparency</b> : indiquer à l'utilisateur qu'il interagit avec une IA et pourquoi une décision a été prise (facteurs principaux, sources).",
        "<b>User-feedback mechanisms</b> : boutons de notation, signalement d'erreur, possibilité de contester une décision.",
        "<b>Human-in-the-loop</b> : un humain revoit les décisions sensibles ou peu sûres (ex. Amazon Augmented AI).",
        "Explications adaptées au <b>public</b> (client, expert, auditeur), dans un langage simple.",
        "Afficher le niveau de confiance et les limites du système."
      ]},
      { type: "tip", text: "Centré sur l'humain = l'utilisateur <b>comprend</b>, peut <b>réagir</b> (feedback, recours) et un humain peut <b>reprendre la main</b>." }
    ]}
  ],
  flashcards: [
    { front: "Fairness", back: "Résultats équitables pour tous les groupes." },
    { front: "Robustness", back: "Performance stable face au bruit et aux entrées inattendues ou adverses." },
    { front: "Veracity", back: "Exactitude des sorties (pas d'hallucinations)." },
    { front: "Inclusivity", back: "Le système fonctionne pour tous les utilisateurs visés." },
    { front: "Bedrock Guardrails : 6 filtres", back: "Content filters, denied topics, word filters, sensitive info (PII), contextual grounding, automated reasoning." },
    { front: "Contextual grounding check", back: "Détecte les réponses non ancrées dans les sources (hallucinations) ou hors sujet." },
    { front: "ApplyGuardrail API", back: "Utiliser Guardrails sans appeler de modèle Bedrock (ex. avec un autre modèle)." },
    { front: "Choix responsable d'un modèle", back: "Le plus petit qui suffit, réutiliser des FM, matériel efficace (Trainium/Inferentia)." },
    { front: "Risques juridiques GenAI", back: "Propriété intellectuelle, biais, perte de confiance, risque pour l'utilisateur final, hallucinations." },
    { front: "Balanced dataset", back: "Proportions adaptées des classes et des groupes." },
    { front: "Subgroup analysis", back: "Mesurer la performance par groupe démographique." },
    { front: "SageMaker Clarify", back: "Détecter le biais (avant et après entraînement) et expliquer les prédictions." },
    { front: "SageMaker Model Cards", back: "Documenter usage prévu, risques, données, évaluations d'un modèle." },
    { front: "AWS AI Service Cards", back: "Documents de transparence d'AWS sur ses services d'IA." },
    { front: "Amazon Augmented AI (A2I)", back: "Revue humaine des prédictions ML (human-in-the-loop)." },
    { front: "Transparence vs explicabilité", back: "Transparence : comment fonctionne le système. Explicabilité : pourquoi cette décision." },
    { front: "Interprétabilité vs performance", back: "Modèle simple = explicable ; modèle complexe = souvent plus performant." },
    { front: "Human-centered explainable AI", back: "Transparence des décisions, feedback utilisateur, humain dans la boucle." }
  ]
};

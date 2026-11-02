/* AWS AI Quest — métadonnées : domaines, task statements, badges, boutique.
   Source : EXAM-GUIDE-SUMMARY.md (guide officiel AIF-C01 v1.2). */
window.META = {
  examDefault: "2026-12-15",
  passThreshold: 0.70,
  exam: { total: 65, minutes: 90, passScore: 700 },
  worlds: [
    { id: 1, key: "MODULE_1", name: "Fondamentaux de l'IA et du ML", domain: "Fundamentals of AI and ML", weight: 20, emoji: "📘", color: "#232f3e", boss: { name: "Examen du domaine 1", emoji: "📝" },
      tasks: [
        { id: "1.1", title: "Explain basic AI concepts and terminologies", fr: "Concepts et vocabulaire de base de l'IA" },
        { id: "1.2", title: "Identify practical use cases for AI", fr: "Cas d'usage concrets de l'IA" },
        { id: "1.3", title: "Describe the AI/ML development lifecycle", fr: "Cycle de vie d'un projet AI/ML" } ] },
    { id: 2, key: "MODULE_2", name: "Fondamentaux de la GenAI", domain: "Fundamentals of GenAI", weight: 24, emoji: "✨", color: "#232f3e", boss: { name: "Examen du domaine 2", emoji: "📝" },
      tasks: [
        { id: "2.1", title: "Explain the basic concepts of generative AI", fr: "Concepts de base de l'IA générative" },
        { id: "2.2", title: "Understand the capabilities and limitations of GenAI for solving business problems", fr: "Forces et limites de la GenAI pour le business" },
        { id: "2.3", title: "Describe AWS infrastructure and technologies for building GenAI applications", fr: "Services et infrastructure AWS pour la GenAI" } ] },
    { id: 3, key: "MODULE_3", name: "Applications des foundation models", domain: "Applications of Foundation Models", weight: 28, emoji: "🧩", color: "#232f3e", boss: { name: "Examen du domaine 3", emoji: "📝" },
      tasks: [
        { id: "3.1", title: "Describe design considerations for applications that use foundation models", fr: "Concevoir une application à base de FM" },
        { id: "3.2", title: "Choose effective prompt engineering techniques", fr: "Techniques de prompt engineering" },
        { id: "3.3", title: "Describe the training and fine-tuning process for FMs", fr: "Entraînement et fine-tuning des FM" },
        { id: "3.4", title: "Describe methods to evaluate FM performance", fr: "Évaluer la performance d'un FM" } ] },
    { id: 4, key: "MODULE_4", name: "IA responsable", domain: "Guidelines for Responsible AI", weight: 14, emoji: "⚖️", color: "#232f3e", boss: { name: "Examen du domaine 4", emoji: "📝" },
      tasks: [
        { id: "4.1", title: "Explain the development of AI systems that are responsible", fr: "Développer une IA responsable" },
        { id: "4.2", title: "Recognize the importance of transparent and explainable models", fr: "Transparence et explicabilité" } ] },
    { id: 5, key: "MODULE_5", name: "Sécurité, conformité et gouvernance", domain: "Security, Compliance, and Governance for AI Solutions", weight: 14, emoji: "🔐", color: "#232f3e", boss: { name: "Examen du domaine 5", emoji: "📝" },
      tasks: [
        { id: "5.1", title: "Explain methods to secure AI systems", fr: "Sécuriser un système d'IA" },
        { id: "5.2", title: "Recognize governance and compliance regulations for AI systems", fr: "Gouvernance et conformité" } ] }
  ],
  playerTitles: [
    { minLevel: 1, title: "Stagiaire IA", emoji: "🐣" },
    { minLevel: 3, title: "Apprenti ML", emoji: "🧪" },
    { minLevel: 6, title: "Praticien Cloud", emoji: "☁️" },
    { minLevel: 9, title: "Ingénieur Prompt", emoji: "✍️" },
    { minLevel: 12, title: "Architecte GenAI", emoji: "🏗️" },
    { minLevel: 15, title: "Maître AIF-C01", emoji: "👑" }
  ],
  avatars: ["🦊", "🐱", "🐼", "🦉", "🐧", "🐸", "🦄", "🐯"],
  shop: [
    { id: "av_robot", kind: "avatar", value: "🤖", name: "Robot", price: 80 },
    { id: "av_alien", kind: "avatar", value: "👽", name: "Alien", price: 80 },
    { id: "av_ninja", kind: "avatar", value: "🥷", name: "Ninja", price: 120 },
    { id: "av_mage", kind: "avatar", value: "🧙", name: "Mage", price: 120 },
    { id: "av_astro", kind: "avatar", value: "🧑‍🚀", name: "Astronaute", price: 150 },
    { id: "av_cloud", kind: "avatar", value: "☁️", name: "Nuage", price: 250 },
    { id: "av_grad", kind: "avatar", value: "🧑‍🎓", name: "Diplômé·e", price: 400 },
    { id: "th_ocean", kind: "theme", value: "ocean", name: "Océan", price: 100 },
    { id: "th_sunset", kind: "theme", value: "sunset", name: "Coucher de soleil", price: 100 },
    { id: "th_forest", kind: "theme", value: "forest", name: "Forêt", price: 100 },
    { id: "th_neon", kind: "theme", value: "neon", name: "Néon", price: 200 },
    { id: "jk_fifty", kind: "joker", value: "fifty", name: "Joker 50/50", price: 30 },
    { id: "jk_hint", kind: "joker", value: "hint", name: "Joker Indice", price: 20 },
    { id: "jk_skip", kind: "joker", value: "skip", name: "Joker Passer", price: 40 }
  ],
  badges: [
    { id: "first_step", emoji: "👣", name: "Premier pas", desc: "Terminer un premier niveau" },
    { id: "first_star3", emoji: "🌟", name: "Perfection", desc: "Obtenir 3 étoiles sur un niveau" },
    { id: "combo5", emoji: "🔥", name: "En feu", desc: "Enchaîner 5 bonnes réponses" },
    { id: "combo10", emoji: "☄️", name: "Inarrêtable", desc: "Enchaîner 10 bonnes réponses" },
    { id: "boss1", emoji: "📘", name: "Domaine 1 validé", desc: "Réussir l'examen du domaine 1" },
    { id: "boss2", emoji: "✨", name: "Domaine 2 validé", desc: "Réussir l'examen du domaine 2" },
    { id: "boss3", emoji: "🧩", name: "Domaine 3 validé", desc: "Réussir l'examen du domaine 3" },
    { id: "boss4", emoji: "⚖️", name: "Domaine 4 validé", desc: "Réussir l'examen du domaine 4" },
    { id: "boss5", emoji: "🔐", name: "Domaine 5 validé", desc: "Réussir l'examen du domaine 5" },
    { id: "world1_3stars", emoji: "🏅", name: "Domaine 1 parfait", desc: "3 étoiles sur toutes les leçons du domaine 1" },
    { id: "q100", emoji: "💯", name: "Centurion", desc: "Répondre à 100 questions" },
    { id: "q500", emoji: "📚", name: "Rat de bibliothèque", desc: "Répondre à 500 questions" },
    { id: "streak3", emoji: "📅", name: "Régulier", desc: "Série de 3 jours" },
    { id: "streak7", emoji: "🗓️", name: "Discipliné", desc: "Série de 7 jours" },
    { id: "daily_goal", emoji: "🎯", name: "Objectif atteint", desc: "Atteindre l'objectif du jour" },
    { id: "dungeon_clear", emoji: "🗝️", name: "Évadé du donjon", desc: "Maîtriser 10 questions du Donjon des erreurs" },
    { id: "hardcore_win", emoji: "💀", name: "Hardcore", desc: "Finir une partie Hardcore à 70 % ou plus" },
    { id: "exam_done", emoji: "📝", name: "Candidat", desc: "Terminer un examen blanc" },
    { id: "exam_pass", emoji: "🎓", name: "Certifiable", desc: "Obtenir 700 ou plus à un examen blanc" },
    { id: "exam_850", emoji: "🏆", name: "Excellence", desc: "Obtenir 850 ou plus à un examen blanc" },
    { id: "no_joker", emoji: "🦾", name: "Sans filet", desc: "Réussir un examen de domaine sans joker" },
    { id: "speedy", emoji: "⚡", name: "Éclair", desc: "Gagner 5 bonus de rapidité dans une partie" },
    { id: "shopper", emoji: "🛍️", name: "Client fidèle", desc: "Acheter un objet dans la boutique" },
    { id: "scholar", emoji: "🎓", name: "Studieux", desc: "Ouvrir le cours de 5 task statements" },
    { id: "flash20", emoji: "🃏", name: "Mémoire vive", desc: "Réviser 20 flashcards" },
    { id: "level5", emoji: "⬆️", name: "Ça monte !", desc: "Atteindre le niveau de joueur 5" },
    { id: "level15", emoji: "👑", name: "Maître", desc: "Atteindre le niveau de joueur 15" }
  ]
};

# AWS AI Quest — jeu de préparation à l'AIF-C01

## Contexte
- Utilisateur : **débutant**. Examen AWS Certified AI Practitioner (AIF-C01) le **15 décembre 2026**.
- Langue : interface et explications en **français** ; questions et termes AWS en **anglais** comme à l'examen, avec la traduction FR entre parenthèses si elle aide.
- Source de vérité : **EXAM-GUIDE-SUMMARY.md** (guide officiel v1.2 du 2026-10-29, qui s'applique à l'examen du 15/12). En cas de doute sur un fait AWS, ne pas deviner : l'ajouter à **TODO-VERIFY.md**.
- Livrable : https://<pseudo-github>.github.io/aif-c01-trainer/, à ouvrir sur téléphone, installable (PWA), qui fonctionne hors ligne.

## Contraintes techniques
- Site statique : HTML, CSS, JS vanilla. Pas de framework, pas de build, aucune dépendance ni CDN, pas de backend. Aucune ressource externe.
- Mobile-first (portrait 375×667) : boutons d'au moins 44 px, pas de scroll horizontal, `viewport-fit=cover` et safe-area.
- PWA : `manifest.json`, `icons/` 192 et 512, `sw.js` avec cache versionné (`CACHE_VERSION`). **Incrémenter `CACHE_VERSION` à chaque déploiement.**
- Données : fichiers `data/*.js` qui définissent des variables globales (`window.MODULE_1 = {...}`).
- Sauvegarde : localStorage (try/catch, repli en mémoire), export/import JSON, reset avec confirmation intégrée à la page.
- Aucune donnée personnelle ni secret dans le code. Le dépôt est **public**.

## Architecture
```
index.html  manifest.json  sw.js  icons/
css/app.css
js/engine.js      logique pure (score, vies, combos, étoiles, XP, déblocage, examen, estimation) — exportable en Node
js/storage.js     persistance
js/ui.js, js/screens/*.js   écrans (carte, niveau, cours, boss, examen, dashboard, modes, boutique, badges)
data/meta.js      mondes, niveaux, badges, boutique
data/mN-course.js, mN-questions.js, mN-labs.js   (N = 1..5)
scripts/validate.js   scripts/test-engine.js   scripts/make-icons.js
```

## Format d'une question
`{ id, module, task, type: "single"|"multiple"|"ordering"|"matching", style?: "scenario", difficulty: "easy"|"medium"|"hard", question, options[], correct[], explanation, wrongExplanations{}, tip }`
- single : 4 options, 1 correcte. multiple : au moins 5 options, au moins 2 correctes (crédit seulement si tout est juste). ordering : 3 à 5 éléments, `correct` = ordre des index. matching : 3 à 7 paires.
- Chaque option fausse a une explication. La position de la bonne réponse varie, et la bonne réponse n'est pas systématiquement la plus longue.
- Un service out-of-scope n'est jamais une bonne réponse.

## Règles de qualité
- Exactitude avant tout. Ne jamais inventer un service ou une fonctionnalité AWS.
- Avant de dire « terminé » : `node scripts/validate.js`, `node scripts/test-engine.js`, vérification syntaxique de tous les JS, aucune URL externe, manifest et SW valides, contrôle visuel 375×667 si possible.
- Un commit par phase. Arrêt pour le « ok » de l'utilisateur entre chaque phase.

## Phases
1. Squelette mobile + PWA + moteur complet + validate.js + Monde 1 + déploiement
2–5. Mondes 2 à 5 (cours, questions, exercices, boss)
6. Relecture, examen blanc de contrôle, rapport de couverture, README

## Déploiement (GitHub Pages)
1. `git add -A && git commit -m "..." && git push` (branche `main`)
2. Première fois : `gh repo create aif-c01-trainer --public --source=. --push`, puis `gh api -X POST repos/{owner}/aif-c01-trainer/pages -f "source[branch]=main" -f "source[path]=/"`
3. Attendre le build : `gh api repos/{owner}/aif-c01-trainer/pages/builds/latest`. Vérifier avec `curl -I https://{owner}.github.io/aif-c01-trainer/`
4. Dire à l'utilisateur de rafraîchir (nouvelle version du cache SW).
5. En cas d'échec : expliquer et proposer Netlify Drop ou Cloudflare Pages. Pas de contournement risqué.

## Environnement (Windows)
- Bash = Git Bash. `python` n'est pas dans le PATH : utiliser `/c/Users/Wisse/anaconda3/python.exe` si besoin.
- gh et Node.js : à installer par l'utilisateur via winget (pas encore fait au 2026-11-02).

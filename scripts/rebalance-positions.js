#!/usr/bin/env node
/* Rééquilibre la position de la bonne réponse des questions « single » dans les fichiers de données
   (A, B, C, D en rotation), en permutant les options et en réindexant wrongExplanations.
   Usage : node scripts/rebalance-positions.js data/m5-questions.js [...]
   Le jeu mélange déjà l'affichage. Ce script sert seulement à garder des fichiers de données propres. */
"use strict";
const fs = require("fs");
for (const file of process.argv.slice(2)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let k = 0, changed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*\{ id: "m\d-\d{3}".*type: "single"/.test(lines[i])) continue;
    // Repère les lignes options / correct / wrongExplanations de ce bloc
    let o = -1, c = -1, w = -1;
    for (let j = i + 1; j < Math.min(i + 12, lines.length); j++) {
      if (o < 0 && /^\s*options: \[/.test(lines[j])) o = j;
      if (c < 0 && /^\s*correct: \[/.test(lines[j])) c = j;
      if (w < 0 && /^\s*wrongExplanations: \{/.test(lines[j])) w = j;
    }
    if (o < 0 || c < 0 || w < 0) throw new Error(file + ":" + (i + 1) + " bloc non reconnu");
    const opts = JSON.parse(lines[o].replace(/^\s*options: /, "").replace(/,\s*$/, ""));
    const cur = JSON.parse(lines[c].replace(/^\s*correct: /, "").replace(/,\s*$/, ""))[0];
    const we = JSON.parse(lines[w].replace(/^\s*wrongExplanations: /, "").replace(/,\s*$/, ""));
    const target = k++ % opts.length;
    if (cur === target) continue;
    [opts[cur], opts[target]] = [opts[target], opts[cur]];
    const nwe = {};
    Object.keys(we).forEach((key) => { const n = +key === target ? cur : +key; nwe[String(n)] = we[key]; });
    const sorted = {}; Object.keys(nwe).sort((a, b) => a - b).forEach((x) => { sorted[x] = nwe[x]; });
    const indent = (s) => s.match(/^\s*/)[0];
    lines[o] = indent(lines[o]) + "options: " + JSON.stringify(opts).replace(/","/g, "\", \"") + ",";
    lines[c] = indent(lines[c]) + "correct: [" + target + "],";
    lines[w] = indent(lines[w]) + "wrongExplanations: " + JSON.stringify(sorted).replace(/^\{/, "{ ").replace(/\}$/, " }").replace(/","/g, "\", \"").replace(/":"/g, "\": \"") + ",";
    changed++;
  }
  fs.writeFileSync(file, lines.join("\n"));
  console.log(file + " : " + changed + " question(s) réordonnée(s)");
}

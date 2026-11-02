#!/usr/bin/env node
/* Valide le contenu pédagogique (data/*.js) : structure, cohérence, couverture, équilibre.
   Usage : node scripts/validate.js   → code de sortie 1 s'il y a des erreurs. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const ctx = { window: {} }; vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f });
load("data/meta.js");
load("data/objectives.js");
const META = ctx.window.META;
const OBJ = META.objectives;
const objQ = {}, objS = {};
fs.readdirSync(path.join(ROOT, "data")).filter((f) => /^m\d-.*\.js$/.test(f)).sort().forEach((f) => load("data/" + f));

const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const MIN_Q = { 1: 30, 2: 30, 3: 40, 4: 30, 5: 30 };
const TYPES = ["single", "multiple", "ordering", "matching"], DIFFS = ["easy", "medium", "hard"];
const NUMWORDS = { 2: "TWO", 3: "THREE", 4: "FOUR" };
const ids = new Set(), texts = new Map();
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const isPerm = (arr, n) => Array.isArray(arr) && arr.length === n && new Set(arr).size === n && arr.every((x) => Number.isInteger(x) && x >= 0 && x < n);
let report = [];

META.worlds.forEach((w) => {
  const mod = ctx.window[w.key];
  if (!mod) { report.push(`Monde ${w.id} : (pas encore de contenu)`); return; }
  const qs = mod.questions || [];
  const taskIds = w.tasks.map((t) => t.id);
  const byTask = {}, byDiff = {}, byType = {}, scen = { n: 0 };
  let longest = 0, singles = 0; const posCount = {};

  qs.forEach((q, n) => {
    const where = `${q.id || "#" + n}`;
    ["id", "module", "task", "type", "difficulty", "question", "options", "correct", "explanation", "wrongExplanations", "tip"].forEach((k) => {
      if (q[k] == null || q[k] === "" || (Array.isArray(q[k]) && !q[k].length)) err(`${where} : champ manquant « ${k} »`);
    });
    if (ids.has(q.id)) err(`${where} : id en double`); ids.add(q.id);
    if (!new RegExp(`^m${w.id}-\\d{3}$`).test(q.id)) err(`${where} : format d'id attendu m${w.id}-NNN`);
    if (q.module !== w.id) err(`${where} : module ${q.module} ≠ ${w.id}`);
    if (!taskIds.includes(q.task)) err(`${where} : task « ${q.task} » inconnue pour le monde ${w.id}`);
    if (!OBJ[q.obj]) err(`${where} : objectif « ${q.obj} » inconnu (voir data/objectives.js)`);
    else if (q.obj.slice(0, 3) !== q.task) err(`${where} : objectif ${q.obj} hors de la task ${q.task}`);
    else objQ[q.obj] = (objQ[q.obj] || 0) + 1;
    if (!TYPES.includes(q.type)) err(`${where} : type invalide « ${q.type} »`);
    if (!DIFFS.includes(q.difficulty)) err(`${where} : difficulté invalide`);
    if (q.style && q.style !== "scenario") err(`${where} : style invalide`);
    const t = norm(q.question);
    if (texts.has(t)) err(`${where} : question en double avec ${texts.get(t)}`); texts.set(t, q.id);
    const opts = q.options || [], nO = opts.length, cor = q.correct || [];
    if (new Set(opts.map(norm)).size !== nO) err(`${where} : options en double`);
    const we = q.wrongExplanations || {};
    const needWE = (i) => { if (!we[i] || !String(we[i]).trim()) err(`${where} : wrongExplanations manquante pour l'option ${i}`); };
    if (q.type === "single") {
      if (nO !== 4) err(`${where} : single doit avoir 4 options (a ${nO})`);
      if (cor.length !== 1) err(`${where} : single doit avoir exactement 1 bonne réponse`);
    }
    if (q.type === "multiple") {
      if (nO < 5) err(`${where} : multiple doit avoir ≥ 5 options`);
      if (cor.length < 2) err(`${where} : multiple doit avoir ≥ 2 bonnes réponses`);
      const word = NUMWORDS[cor.length];
      if (!word || !q.question.includes(`(Select ${word}.)`)) err(`${where} : l'énoncé doit contenir « (Select ${word || cor.length}.) »`);
    }
    if (q.type === "single" || q.type === "multiple") {
      if (new Set(cor).size !== cor.length) err(`${where} : correct[] contient des doublons`);
      cor.forEach((c) => { if (!Number.isInteger(c) || c < 0 || c >= nO) err(`${where} : index correct invalide ${c}`); });
      opts.forEach((_, i) => { if (!cor.includes(i)) needWE(i); });
      Object.keys(we).forEach((k) => { if (cor.includes(+k)) err(`${where} : wrongExplanations donnée pour une bonne réponse (${k})`); });
    }
    if (q.type === "single") {
      singles++;
      posCount[cor[0]] = (posCount[cor[0]] || 0) + 1;
      // Indice involontaire : la bonne réponse est NETTEMENT la plus longue (≥ 20 % de plus que la suivante)
      const L = opts.map((o) => o.length), others = L.filter((_, i) => i !== cor[0]);
      if (L[cor[0]] >= 1.2 * Math.max(...others)) longest++;
    }
    if (q.type === "ordering") {
      if (nO < 3 || nO > 5) err(`${where} : ordering doit avoir 3 à 5 éléments`);
      if (!isPerm(cor, nO)) err(`${where} : correct[] doit être une permutation des index`);
      if (cor.every((c, i) => c === i)) err(`${where} : les éléments sont déjà dans le bon ordre`);
      opts.forEach((_, i) => needWE(i));
    }
    if (q.type === "matching") {
      if (nO < 3 || nO > 7) err(`${where} : matching doit avoir 3 à 7 éléments`);
      if (!Array.isArray(q.targets) || q.targets.length !== nO) err(`${where} : targets[] doit avoir autant d'entrées que options[]`);
      if (!isPerm(cor, nO)) err(`${where} : correct[] doit associer chaque élément à une cible distincte`);
      if (cor.every((c, i) => c === i)) err(`${where} : cibles dans le même ordre que les éléments (trop facile)`);
      opts.forEach((_, i) => needWE(i));
    }
    const blob = JSON.stringify(q);
    if (/https?:\/\//i.test(blob)) err(`${where} : URL externe interdite dans une question`);
    byTask[q.task] = (byTask[q.task] || 0) + 1;
    byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;
    byType[q.type] = (byType[q.type] || 0) + 1;
    if (q.style === "scenario") scen.n++;
  });

  // Couverture & équilibre
  if (qs.length < MIN_Q[w.id]) err(`Monde ${w.id} : ${qs.length} questions (minimum ${MIN_Q[w.id]})`);
  taskIds.forEach((t) => { if (!byTask[t]) err(`Monde ${w.id} : aucune question pour la task ${t}`); else if (byTask[t] < 6) warn(`Monde ${w.id} : seulement ${byTask[t]} questions pour la task ${t}`); });
  const hm = (byDiff.hard || 0) + (byDiff.medium || 0);
  if (hm < 15) err(`Monde ${w.id} : boss impossible, seulement ${hm} questions medium/hard (15 requises)`);
  if ((byDiff.hard || 0) < 8) warn(`Monde ${w.id} : seulement ${byDiff.hard || 0} questions hard pour le boss`);
  if (qs.length < 10) err(`Monde ${w.id} : niveau bonus impossible (< 10 questions)`);
  DIFFS.forEach((d) => { if (!byDiff[d]) warn(`Monde ${w.id} : aucune question ${d}`); });
  TYPES.forEach((t) => { if (!byType[t]) warn(`Monde ${w.id} : aucune question de type ${t}`); });
  if (singles && longest / singles > 0.15) warn(`Monde ${w.id} : la bonne réponse est nettement la plus longue (+20 %) dans ${Math.round(longest / singles * 100)} % des single (> 15 %)`);
  // Positions dans le fichier : informatif seulement, car l'ordre des options est mélangé à chaque affichage (jeu et examen).
  Object.keys(posCount).forEach((p) => { if (singles >= 8 && posCount[p] / singles > 0.6) warn(`Monde ${w.id} : bonne réponse en position ${"ABCD"[p]} dans ${Math.round(posCount[p] / singles * 100)} % des single du fichier`); });

  // Cours, flashcards, exercices
  const c = mod.course;
  if (!c) err(`Monde ${w.id} : cours manquant`);
  else {
    taskIds.forEach((t) => { if (!c.sections.some((s) => s.task === t)) err(`Monde ${w.id} : aucune section de cours pour la task ${t}`); });
    c.sections.forEach((s, i) => {
      if (!taskIds.includes(s.task)) err(`Monde ${w.id} : section ${i} task inconnue ${s.task}`);
      if (!s.blocks.length) err(`Monde ${w.id} : section « ${s.title} » vide`);
      if (!Array.isArray(s.obj) || !s.obj.length) err(`Monde ${w.id} : section « ${s.title} » sans objectif (obj)`);
      else s.obj.forEach((o) => { if (!OBJ[o] || o.slice(0, 3) !== s.task) err(`Monde ${w.id} : section « ${s.title} » objectif invalide ${o}`); else objS[o] = (objS[o] || 0) + 1; });
    });
    if (!c.sections.some((s) => s.blocks.some((b) => b.type === "trap"))) err(`Monde ${w.id} : aucun encadré « Pièges à l'examen »`);
    if (!c.flashcards || c.flashcards.length < 10) warn(`Monde ${w.id} : moins de 10 flashcards`);
    if (/https?:\/\//i.test(JSON.stringify(c))) err(`Monde ${w.id} : URL externe dans le cours`);
  }
  const labs = mod.labs || [];
  if (labs.length < 5) err(`Monde ${w.id} : ${labs.length} exercices (minimum 5)`);
  labs.forEach((l) => {
    if (!taskIds.includes(l.task)) err(`${l.id} : task inconnue`);
    if (l.kind === "console" && (!l.cost || !l.steps || !l.steps.length || !l.expected)) err(`${l.id} : TP console incomplet (cost, steps, expected requis)`);
    if (l.kind === "scenario" && (!l.scenario || !l.answer)) err(`${l.id} : scénario incomplet`);
  });
  if (!labs.some((l) => l.kind === "console")) warn(`Monde ${w.id} : aucun TP console`);

  report.push(`Monde ${w.id} · ${w.name} : ${qs.length} questions (min ${MIN_Q[w.id]}), ${scen.n} scénarios, ${labs.length} exercices, ${(c && c.flashcards || []).length} flashcards`);
  report.push(`   par task : ${taskIds.map((t) => `${t}=${byTask[t] || 0}`).join("  ")}`);
  report.push(`   par difficulté : ${DIFFS.map((d) => `${d}=${byDiff[d] || 0}`).join("  ")}`);
  report.push(`   par type : ${TYPES.map((t) => `${t}=${byType[t] || 0}`).join("  ")}`);
  report.push(`   single : bonne réponse nettement la plus longue ${singles ? Math.round(longest / singles * 100) : 0} % · positions ${["A", "B", "C", "D"].map((L, i) => `${L}=${posCount[i] || 0}`).join(" ")}  (affichage mélangé en jeu)`);
});

// ===== Couverture du programme officiel =====
const objIds = Object.keys(OBJ);
const builtWorlds = META.worlds.filter((w) => ctx.window[w.key]).map((w) => String(w.id));
let covered = 0;
const lines = [];
objIds.forEach((o) => {
  const ok = (objS[o] || 0) >= 1 && (objQ[o] || 0) >= 2;
  if (ok) covered++;
  if (builtWorlds.includes(o[0]) && !ok) err(`Objectif ${o} insuffisamment couvert : ${objS[o] || 0} section(s), ${objQ[o] || 0} question(s) (min 1 et 2) — ${OBJ[o]}`);
  lines.push(`   ${ok ? "✅" : "⬜"} ${o}  ${objS[o] || 0} sect. · ${objQ[o] || 0} q.`);
});
report.push(`\nCouverture du programme officiel : ${covered}/${objIds.length} objectifs (${Math.round(covered / objIds.length * 100)} %)`);
if (process.argv.includes("--objectives")) report.push(lines.join("\n"));
// Services in-scope mentionnés dans les cours / questions / exercices
const corpus = META.worlds.map((w) => JSON.stringify(ctx.window[w.key] || {})).join(" ");
const missingSvc = META.inScopeServices.filter((s) => !corpus.includes(s));
report.push(`Services in-scope mentionnés : ${META.inScopeServices.length - missingSvc.length}/${META.inScopeServices.length}` + (missingSvc.length ? ` — manquants : ${missingSvc.join(", ")}` : ""));
if (builtWorlds.length === META.worlds.length && missingSvc.length) err("Services in-scope jamais mentionnés : " + missingSvc.join(", "));
console.log("=== Validation du contenu AWS AI Quest ===\n" + report.join("\n"));
if (warnings.length) console.log("\n⚠️  Avertissements (" + warnings.length + ") :\n - " + warnings.join("\n - "));
if (errors.length) { console.log("\n❌ Erreurs (" + errors.length + ") :\n - " + errors.join("\n - ")); process.exit(1); }
console.log("\n✅ Aucune erreur.");

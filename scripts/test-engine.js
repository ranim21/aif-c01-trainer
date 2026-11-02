#!/usr/bin/env node
/* Tests unitaires du moteur (score, vies, combos, déblocage, étoiles, XP, donjon, examen, sauvegarde). */
"use strict";
const assert = require("assert"), fs = require("fs"), path = require("path"), vm = require("vm");
const E = require("../js/engine.js");
const ctx = { window: {} }; vm.createContext(ctx);
["data/meta.js", "data/m1-course.js", "data/m1-questions.js", "data/m1-labs.js"].forEach((f) => vm.runInContext(fs.readFileSync(path.join(__dirname, "..", f), "utf8"), ctx));
const META = ctx.window.META, MODULES = { 1: ctx.window.MODULE_1 };
let passed = 0;
function test(name, fn) { try { fn(); passed++; console.log("  ✓ " + name); } catch (e) { console.error("  ✗ " + name + "\n    " + e.message); process.exitCode = 1; } }
const Q = (id, diff, type, correct, extra) => Object.assign({ id, module: 1, task: "1.1", type: type || "single", difficulty: diff || "easy", options: ["a", "b", "c", "d", "e"], correct: correct || [0] }, extra || {});

console.log("Moteur :");
test("isCorrect single / multiple (ordre indifférent) / ordering / matching", () => {
  assert.ok(E.isCorrect(Q("x", "easy", "single", [2]), [2]));
  assert.ok(!E.isCorrect(Q("x", "easy", "single", [2]), [1]));
  assert.ok(E.isCorrect(Q("x", "easy", "multiple", [0, 3]), [3, 0]));
  assert.ok(!E.isCorrect(Q("x", "easy", "multiple", [0, 3]), [0]));
  assert.ok(!E.isCorrect(Q("x", "easy", "multiple", [0, 3]), [0, 3, 4]));
  assert.ok(E.isCorrect(Q("x", "easy", "ordering", [2, 0, 1]), [2, 0, 1]));
  assert.ok(!E.isCorrect(Q("x", "easy", "ordering", [2, 0, 1]), [0, 2, 1]));
  assert.ok(E.isCorrect(Q("x", "easy", "matching", [1, 2, 0]), [1, 2, 0]));
  assert.ok(!E.isCorrect(Q("x", "easy", "single", [0]), null));
});
test("points par difficulté et combos x2/x3/x5", () => {
  const qs = []; for (let i = 0; i < 12; i++) qs.push(Q("q" + i, "medium"));
  const s = E.createSession({ mode: "free", questions: qs });
  const pts = [];
  for (let i = 0; i < 12; i++) { pts.push(E.answerQuestion(s, [0]).points); E.nextQuestion(s); }
  assert.deepStrictEqual(pts.slice(0, 3), [20, 20, 40]);   // 3e bonne → x2
  assert.strictEqual(pts[4], 60);                          // 5e → x3
  assert.strictEqual(pts[9], 100);                         // 10e → x5
  assert.strictEqual(s.maxStreak, 12);
});
test("une erreur casse le combo et retire un cœur ; 3 erreurs = échec", () => {
  const qs = [Q("a"), Q("b"), Q("c"), Q("d")];
  const s = E.createSession({ mode: "level", questions: qs });
  assert.strictEqual(s.lives, 3);
  E.answerQuestion(s, [0]); E.nextQuestion(s);
  E.answerQuestion(s, [1]); assert.strictEqual(s.lives, 2); assert.strictEqual(s.streak, 0); E.nextQuestion(s);
  E.answerQuestion(s, [1]); E.nextQuestion(s);
  E.answerQuestion(s, [1]);
  assert.ok(s.failed && s.finished);
  const r = E.sessionResult(s); assert.ok(!r.passed); assert.strictEqual(r.stars, 0);
});
test("hardcore : 1 vie, points doublés, pas de jokers ; boss : 5 vies", () => {
  const s = E.createSession({ mode: "hardcore", questions: [Q("a", "hard"), Q("b")] });
  assert.strictEqual(s.lives, 1);
  assert.strictEqual(E.answerQuestion(s, [0]).points, 60);
  assert.ok(!E.canUseJoker(s, "hint", { hint: 5 }));
  assert.strictEqual(E.createSession({ mode: "boss", questions: [Q("a")] }).lives, 5);
});
test("bonus de rapidité seulement avec chrono", () => {
  const s = E.createSession({ mode: "free", questions: [Q("a", "hard"), Q("b", "hard")], timer: true, timerSeconds: 40 });
  const o = E.answerQuestion(s, [0], 4000); assert.ok(o.speedBonus > 0); assert.strictEqual(s.speedBonuses, 1);
  const s2 = E.createSession({ mode: "free", questions: [Q("a", "hard")] });
  assert.strictEqual(E.answerQuestion(s2, [0], 1000).speedBonus, 0);
});
test("étoiles : 70 % = 1, 85 % = 2, 95 % = 3", () => {
  assert.strictEqual(E.stars(0.69), 0); assert.strictEqual(E.stars(0.70), 1); assert.strictEqual(E.stars(0.85), 2); assert.strictEqual(E.stars(0.95), 3); assert.strictEqual(E.stars(1), 3);
});
test("jokers : 50/50 retire la moitié des fausses, limite par niveau, inventaire décrémenté, passer", () => {
  const inv = { fifty: 2, hint: 1, skip: 1 };
  const q = Q("a", "easy", "single", [1], { options: ["a", "b", "c", "d"] });
  const s = E.createSession({ mode: "level", questions: [q, Q("b"), Q("c")] });
  const r = E.useJoker(s, "fifty", inv, E.rngFrom(3));
  assert.strictEqual(r.hide.length, 1); assert.ok(!r.hide.includes(1));
  assert.strictEqual(inv.fifty, 1);
  assert.strictEqual(E.useJoker(s, "fifty", inv), null, "1 seul 50/50 par niveau");
  const h = E.useJoker(s, "hint", inv); assert.strictEqual(h.hide.length, 1); assert.ok(!h.hide.includes(1));
  assert.strictEqual(E.useJoker(s, "skip", inv).kind, "skip"); assert.strictEqual(s.skipped, 1);
  const ord = Q("o", "easy", "ordering", [2, 0, 1], { options: ["x", "y", "z"] });
  const s2 = E.createSession({ mode: "level", questions: [ord] });
  assert.ok(!E.canUseJoker(s2, "fifty", { fifty: 1 }), "pas de 50/50 sur ordering");
  assert.deepStrictEqual(E.useJoker(s2, "hint", { hint: 1 }).reveal, { position: 0, option: 2 });
});
test("question passée exclue du pourcentage", () => {
  const s = E.createSession({ mode: "level", questions: [Q("a"), Q("b"), Q("c")] });
  E.answerQuestion(s, [0]); E.nextQuestion(s);
  E.useJoker(s, "skip", { skip: 1 }); E.nextQuestion(s);
  E.answerQuestion(s, [0]); E.nextQuestion(s);
  const r = E.sessionResult(s);
  assert.strictEqual(r.pct, 1); assert.strictEqual(r.answered, 2); assert.ok(r.passed);
});

console.log("Progression :");
const levels = E.buildLevels(META, MODULES);
test("niveaux : 1 par task + bonus + boss par monde ; mondes sans contenu indisponibles", () => {
  const w1 = levels.filter((l) => l.world === 1);
  assert.deepStrictEqual(w1.map((l) => l.kind), ["task", "task", "task", "mix", "boss"]);
  assert.strictEqual(levels.length, 14 + 5 * 2);
  assert.ok(levels.filter((l) => l.world === 2).every((l) => !l.available));
});
test("déblocage séquentiel au seuil de 70 %", () => {
  const st = E.newState();
  assert.ok(E.isUnlocked(st, levels, "w1-1.1"));
  assert.ok(!E.isUnlocked(st, levels, "w1-1.2"));
  const qs = E.questionsForLevel(levels[0], MODULES, E.rngFrom(1));
  const s = E.createSession({ mode: "level", levelId: "w1-1.1", world: 1, questions: qs });
  qs.forEach((q, i) => { E.answerQuestion(s, i < 2 ? (q.type === "single" ? [(q.correct[0] + 1) % 4] : []) : q.correct.slice()); E.nextQuestion(s); });
  const r = E.sessionResult(s);
  assert.ok(r.pct >= 0.7 && r.pct < 0.85, "pct = " + r.pct);
  const rw = E.applyResult(st, r, { levels, today: "2026-11-02" });
  assert.ok(rw.firstClear);
  assert.ok(E.isUnlocked(st, levels, "w1-1.2"));
  assert.strictEqual(st.levels["w1-1.1"].stars, 1);
  assert.ok(st.badges.first_step);
  assert.ok(!E.worldUnlocked(st, levels, 2));
});
test("le boss pioche 15 questions en privilégiant hard", () => {
  const boss = levels.find((l) => l.id === "w1-boss");
  const qs = E.questionsForLevel(boss, MODULES, E.rngFrom(7));
  assert.strictEqual(qs.length, 15);
  const allHard = MODULES[1].questions.filter((q) => q.difficulty === "hard").length;
  assert.strictEqual(qs.filter((q) => q.difficulty === "hard").length, Math.min(15, allHard));
  assert.ok(qs.every((q) => q.difficulty !== "easy"));
});
test("XP → niveau de joueur et titres", () => {
  assert.strictEqual(E.levelFromXp(0), 1); assert.strictEqual(E.levelFromXp(119), 1); assert.strictEqual(E.levelFromXp(120), 2);
  assert.strictEqual(E.levelFromXp(E.xpForLevel(15)), 15);
  assert.strictEqual(E.titleFor(1, META.playerTitles).title, "Stagiaire IA");
  assert.strictEqual(E.titleFor(15, META.playerTitles).title, "Maître AIF-C01");
  assert.strictEqual(E.titleFor(7, META.playerTitles).title, "Praticien Cloud");
});
test("série quotidienne et objectif du jour", () => {
  const st = E.newState();
  E.touchStreak(st, "2026-11-01"); E.touchStreak(st, "2026-11-02"); E.touchStreak(st, "2026-11-02");
  assert.strictEqual(st.streak.count, 2);
  E.touchStreak(st, "2026-11-05"); assert.strictEqual(st.streak.count, 1);
  const qs = []; for (let i = 0; i < 20; i++) qs.push(Q("g" + i));
  const s = E.createSession({ mode: "free", questions: qs });
  qs.forEach(() => { E.answerQuestion(s, [0]); E.nextQuestion(s); });
  const rw = E.applyResult(st, E.sessionResult(s), { levels, today: "2026-11-06" });
  assert.ok(rw.goalReached); assert.ok(st.badges.daily_goal);
});
test("donjon des erreurs : erreur → boîte 0, réussites successives → maîtrisée", () => {
  const st = E.newState(), q = Q("m1-001");
  const run = (ok, mode, day) => { const s = E.createSession({ mode, questions: [q] }); E.answerQuestion(s, ok ? [0] : [1]); E.nextQuestion(s); E.applyResult(st, E.sessionResult(s), { levels, today: day }); };
  run(false, "level", "2026-11-02");
  assert.deepStrictEqual(E.dungeonDue(st, "2026-11-02"), ["m1-001"]);
  run(true, "dungeon", "2026-11-02"); assert.strictEqual(st.dungeon["m1-001"].box, 1);
  assert.deepStrictEqual(E.dungeonDue(st, "2026-11-02"), []);
  assert.deepStrictEqual(E.dungeonDue(st, "2026-11-03"), ["m1-001"]);
  run(true, "level", "2026-11-03"); assert.strictEqual(st.dungeon["m1-001"].box, 1, "hors donjon : pas de promotion");
  run(true, "dungeon", "2026-11-03"); run(true, "dungeon", "2026-11-06"); run(true, "dungeon", "2026-11-13");
  assert.ok(!st.dungeon["m1-001"]); assert.strictEqual(st.dungeonMastered, 1);
});
test("boutique : achat, pièces insuffisantes, déjà possédé, jokers cumulables", () => {
  const st = E.newState(); st.coins = 100;
  const av = META.shop.find((i) => i.id === "av_robot"), jk = META.shop.find((i) => i.id === "jk_hint");
  assert.ok(E.buy(st, av).ok); assert.strictEqual(st.coins, 20);
  assert.ok(!E.buy(st, av).ok);
  assert.ok(E.buy(st, jk).ok); assert.strictEqual(st.jokers.hint, 4);
  assert.ok(!E.buy(st, jk).ok);
  assert.ok(st.badges.shopper);
});
test("au moins 20 badges, ids uniques", () => {
  assert.ok(META.badges.length >= 20);
  assert.strictEqual(new Set(META.badges.map((b) => b.id)).size, META.badges.length);
});

console.log("Examen blanc :");
test("quotas 65 questions = 13/16/18/9/9", () => {
  assert.deepStrictEqual(E.examQuotas(META, 65), { 1: 13, 2: 16, 3: 18, 4: 9, 5: 9 });
});
test("examen partiel si des mondes manquent ; durée au prorata", () => {
  const ex = E.buildExam(META, MODULES, E.rngFrom(5));
  assert.ok(ex.partial); assert.strictEqual(ex.questions.length, 13); assert.strictEqual(ex.minutes, 18);
  assert.strictEqual(new Set(ex.questions.map((q) => q.id)).size, 13);
});
test("score sur 1000 (70 % = 700), réussite à 700, détail par domaine", () => {
  const qs = []; for (let i = 0; i < 10; i++) qs.push(Q("e" + i));
  const resp = qs.map((_, i) => (i < 7 ? [0] : [1]));
  const sc = E.scoreExam(qs, resp);
  assert.strictEqual(sc.score, 700); assert.ok(sc.passed); assert.deepStrictEqual(sc.byModule[1], { a: 10, c: 7 });
  assert.strictEqual(E.scoreExam(qs, qs.map(() => null)).score, 100);
  assert.ok(!E.scoreExam(qs, qs.map((_, i) => (i < 6 ? [0] : null))).passed);
});
test("probabilité de réussite : 50 % sans données, monte avec de bons résultats", () => {
  const st = E.newState();
  const p0 = E.passProbability(st, META);
  assert.ok(Math.abs(p0.expected - 0.5) < 1e-9); assert.ok(p0.probability < 0.05);
  META.worlds.forEach((w) => { st.stats.byModule[String(w.id)] = { a: 200, c: 180, recent: Array(30).fill(1).map((x, i) => (i < 27 ? 1 : 0)) }; });
  const p1 = E.passProbability(st, META);
  assert.ok(p1.expected > 0.75 && p1.probability > 0.7, JSON.stringify(p1));
});

console.log("Sauvegarde :");
test("migrate complète un ancien état sans perdre les données", () => {
  const old = { profile: { name: "Ana", avatar: "🐱" }, settings: { sound: false }, stats: { answered: 5, correct: 3 }, jokers: { fifty: 0 }, xp: 300 };
  const m = E.migrate(JSON.parse(JSON.stringify(old)));
  assert.strictEqual(m.profile.name, "Ana"); assert.strictEqual(m.xp, 300); assert.strictEqual(m.settings.sound, false);
  assert.strictEqual(m.settings.examDate, "2026-12-15"); assert.ok(m.stats.byTask); assert.strictEqual(m.jokers.hint, 3); assert.strictEqual(m.jokers.fifty, 0);
  assert.ok(E.migrate(null).profile);
});
test("storage.js : aller-retour, repli mémoire, export/import, reset", () => {
  const mk = (failing) => {
    const store = {};
    const ls = { setItem: (k, v) => { if (failing) throw new Error("quota"); store[k] = v; }, getItem: (k) => (k in store ? store[k] : null), removeItem: (k) => { delete store[k]; } };
    const win = { Engine: E, localStorage: ls }; const c = { window: win }; vm.createContext(c);
    vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "js", "storage.js"), "utf8"), c);
    return win.Store;
  };
  const S = mk(false); const st = E.newState(); st.xp = 42; st.profile.name = "Zoé";
  S.save(st); assert.strictEqual(S.load().xp, 42); assert.ok(S.isPersistent());
  const imported = S.importJSON(S.exportJSON(st)); assert.strictEqual(imported.profile.name, "Zoé");
  assert.throws(() => S.importJSON('{"foo":1}'));
  S.reset(); assert.strictEqual(S.load().xp, 0);
  const F = mk(true); assert.ok(!F.isPersistent()); F.save(st); assert.strictEqual(F.load().xp, 42, "repli en mémoire");
});

console.log(`\n${passed} test(s) réussi(s)` + (process.exitCode ? " — ÉCHECS ci-dessus" : " ✅"));

/* AWS AI Quest — moteur de jeu (logique pure, sans DOM).
   Utilisable dans le navigateur (window.Engine) et dans Node (require). */
(function (root) {
  "use strict";

  var BASE_POINTS = { easy: 10, medium: 20, hard: 30 };
  var PASS = 0.70;
  var LEITNER_DAYS = [0, 1, 3, 7];           // délai avant revue selon la boîte
  var DAILY_GOAL = 20;                        // questions par jour
  var JOKER_START = { fifty: 3, hint: 3, skip: 3 };

  /* ---------- Utilitaires ---------- */
  function rngFrom(seed) {                    // PRNG déterministe (tests)
    var s = (seed >>> 0) || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s % 1e9) / 1e9; };
  }
  function shuffle(arr, rng) {
    rng = rng || Math.random;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function todayStr(d) { d = d || new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function dayNum(str) { var p = str.split("-"); return Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000); }
  function daysBetween(a, b) { return dayNum(b) - dayNum(a); }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  /* ---------- État du joueur ---------- */
  function newState() {
    return {
      v: 1,
      profile: { name: "", avatar: "🦊", createdAt: todayStr() },
      settings: { sound: true, vibration: true, timer: false, theme: "auto", colorTheme: "default", examDate: "2026-12-15", timerSeconds: 45 },
      xp: 0, coins: 50,
      levels: {},                     // levelId -> { best, stars, passed, plays }
      stats: { answered: 0, correct: 0, byQ: {}, byTask: {}, byModule: {} },
      dungeon: {}, dungeonMastered: 0,
      history: [], exams: [],
      badges: {}, owned: {}, jokers: { fifty: JOKER_START.fifty, hint: JOKER_START.hint, skip: JOKER_START.skip },
      streak: { count: 0, last: null },
      daily: { date: null, count: 0, goalReached: false },
      courseOpened: {}, flashSeen: 0,
      examInProgress: null,
      friends: {}                     // pseudo (minuscules) -> carte de score reçue via un lien d'invitation
    };
  }
  function migrate(s) {
    var base = newState();
    if (!s || typeof s !== "object") return base;
    for (var k in base) if (!(k in s)) s[k] = base[k];
    for (var k2 in base.settings) if (!(k2 in s.settings)) s.settings[k2] = base.settings[k2];
    for (var k3 in base.stats) if (!(k3 in s.stats)) s.stats[k3] = base.stats[k3];
    for (var k4 in base.jokers) if (!(k4 in s.jokers)) s.jokers[k4] = base.jokers[k4];
    s.v = 1;
    return s;
  }

  /* ---------- XP & niveaux de joueur ---------- */
  function xpForLevel(L) { return 60 * (L - 1) * L; }           // XP cumulée pour atteindre le niveau L
  function levelFromXp(xp) { var L = 1; while (xpForLevel(L + 1) <= xp) L++; return L; }
  function titleFor(level, titles) {
    var t = titles[0];
    for (var i = 0; i < titles.length; i++) if (level >= titles[i].minLevel) t = titles[i];
    return t;
  }
  function levelProgress(xp) {
    var L = levelFromXp(xp), a = xpForLevel(L), b = xpForLevel(L + 1);
    return { level: L, current: xp - a, needed: b - a, ratio: (xp - a) / (b - a) };
  }

  /* ---------- Carte : construction des niveaux ---------- */
  function moduleQuestions(modules, worldId) {
    var m = modules && modules[worldId];
    return (m && m.questions) ? m.questions : [];
  }
  function buildLevels(meta, modules) {
    var out = [];
    meta.worlds.forEach(function (w) {
      var qs = moduleQuestions(modules, w.id);
      var available = qs.length > 0;
      w.tasks.forEach(function (t) {
        out.push({ id: "w" + w.id + "-" + t.id, world: w.id, kind: "task", task: t.id, title: "Leçon " + t.id + " · " + t.fr, available: available && qs.some(function (q) { return q.task === t.id; }) });
      });
      out.push({ id: "w" + w.id + "-mix", world: w.id, kind: "mix", title: "Révision du domaine", available: available });
      out.push({ id: "w" + w.id + "-boss", world: w.id, kind: "boss", title: w.boss.name, available: available });
    });
    return out;
  }
  function isUnlocked(state, levels, levelId) {
    var i = levels.findIndex(function (l) { return l.id === levelId; });
    if (i < 0) return false;
    if (!levels[i].available) return false;
    if (i === 0) return true;
    var prev = state.levels[levels[i - 1].id];
    return !!(prev && prev.passed);
  }
  function worldUnlocked(state, levels, worldId) {
    var first = levels.find(function (l) { return l.world === worldId; });
    return first ? isUnlocked(state, levels, first.id) : false;
  }

  function questionsForLevel(level, modules, rng) {
    var qs = moduleQuestions(modules, level.world);
    if (level.kind === "task") return shuffle(qs.filter(function (q) { return q.task === level.task; }), rng);
    if (level.kind === "mix") return shuffle(qs, rng).slice(0, 10);
    if (level.kind === "boss") {
      var order = { hard: 0, medium: 1, easy: 2 };
      var byDiff = shuffle(qs, rng).sort(function (a, b) { return order[a.difficulty] - order[b.difficulty]; });
      return shuffle(byDiff.slice(0, 15), rng);
    }
    return [];
  }

  /* ---------- Correction ---------- */
  function sameArray(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
  function isCorrect(q, resp) {
    if (!resp) return false;
    if (q.type === "single" || q.type === "multiple") {
      var r = resp.slice().sort(function (x, y) { return x - y; });
      var c = q.correct.slice().sort(function (x, y) { return x - y; });
      return sameArray(r, c);
    }
    return sameArray(resp, q.correct);       // ordering : ordre des index ; matching : cible pour chaque élément
  }

  function stars(pct) { return pct >= 0.95 ? 3 : pct >= 0.85 ? 2 : pct >= PASS ? 1 : 0; }
  function comboMultiplier(streak) { return streak >= 10 ? 5 : streak >= 5 ? 3 : streak >= 3 ? 2 : 1; }

  /* ---------- Session de jeu (niveau, boss, modes libres) ---------- */
  function createSession(opts) {
    var mode = opts.mode || "level";
    var lives = opts.lives != null ? opts.lives : (mode === "hardcore" ? 1 : mode === "boss" ? 5 : mode === "free" || mode === "dungeon" ? Infinity : 3);
    return {
      mode: mode, levelId: opts.levelId || null, world: opts.world || null, label: opts.label || "",
      questions: opts.questions.slice(), idx: 0,
      lives: lives, maxLives: lives,
      score: 0, streak: 0, maxStreak: 0, correctCount: 0, answeredCount: 0, skipped: 0, speedBonuses: 0,
      jokersUsed: { fifty: 0, hint: 0, skip: 0 }, jokerLimit: opts.jokerLimit != null ? opts.jokerLimit : 1,
      allowJokers: mode !== "hardcore", timer: !!opts.timer, timerSeconds: opts.timerSeconds || 45,
      pointsMultiplier: mode === "hardcore" ? 2 : 1,
      log: [], finished: false, failed: false
    };
  }
  function currentQuestion(s) { return s.finished ? null : s.questions[s.idx] || null; }

  function answerQuestion(s, resp, ms) {
    var q = currentQuestion(s);
    if (!q) return null;
    var ok = isCorrect(q, resp);
    var points = 0, speed = 0, mult = 1;
    s.answeredCount++;
    if (ok) {
      s.correctCount++; s.streak++; s.maxStreak = Math.max(s.maxStreak, s.streak);
      mult = comboMultiplier(s.streak);
      var base = BASE_POINTS[q.difficulty] || 10;
      if (s.timer && ms != null) {
        var limit = s.timerSeconds * 1000;
        if (ms < limit) { speed = Math.round(base * 0.5 * (1 - ms / limit)); if (speed > 0 && ms < limit / 2) s.speedBonuses++; }
      }
      points = (base * mult + speed) * s.pointsMultiplier;
      s.score += points;
    } else {
      s.streak = 0;
      if (s.lives !== Infinity) s.lives--;
    }
    s.log.push({ id: q.id, module: q.module, task: q.task, ok: ok, resp: resp, points: points });
    var outcome = { correct: ok, points: points, multiplier: mult, speedBonus: speed, lives: s.lives, streak: s.streak };
    if (s.lives !== Infinity && s.lives <= 0) { s.failed = true; s.finished = true; }
    return outcome;
  }
  function nextQuestion(s) {
    if (s.finished) return null;
    s.idx++;
    if (s.idx >= s.questions.length) s.finished = true;
    return currentQuestion(s);
  }
  function canUseJoker(s, kind, inventory) {
    if (!s.allowJokers || s.finished) return false;
    if ((inventory[kind] || 0) <= 0) return false;
    if (s.jokersUsed[kind] >= s.jokerLimit) return false;
    var q = currentQuestion(s);
    if (kind === "fifty" && !(q.type === "single" || q.type === "multiple")) return false;
    return true;
  }
  /* Retourne ce que l'UI doit faire. Décrémente l'inventaire. */
  function useJoker(s, kind, inventory, rng) {
    if (!canUseJoker(s, kind, inventory)) return null;
    var q = currentQuestion(s);
    inventory[kind]--; s.jokersUsed[kind]++;
    if (kind === "skip") {
      s.skipped++;
      s.log.push({ id: q.id, module: q.module, task: q.task, ok: null, skipped: true, points: 0 });
      return { kind: "skip" };
    }
    var wrong = q.options.map(function (_, i) { return i; }).filter(function (i) { return q.correct.indexOf(i) < 0; });
    if (kind === "fifty") return { kind: "fifty", hide: shuffle(wrong, rng).slice(0, Math.floor(wrong.length / 2)) };
    // Indice
    if (q.type === "single" || q.type === "multiple") return { kind: "hint", hide: shuffle(wrong, rng).slice(0, 1), task: q.task };
    if (q.type === "ordering") return { kind: "hint", reveal: { position: 0, option: q.correct[0] }, task: q.task };
    return { kind: "hint", reveal: { option: 0, target: q.correct[0] }, task: q.task };
  }
  function sessionResult(s) {
    var denom = s.answeredCount;
    var pct = denom > 0 ? s.correctCount / denom : 0;
    var completed = !s.failed && s.finished;
    var passed = !s.failed && pct >= PASS && denom > 0;
    return {
      mode: s.mode, levelId: s.levelId, world: s.world, label: s.label,
      pct: pct, correct: s.correctCount, answered: denom, skipped: s.skipped,
      points: s.score, maxStreak: s.maxStreak, failed: s.failed, passed: passed,
      stars: passed ? stars(pct) : 0, speedBonuses: s.speedBonuses,
      jokersUsedTotal: s.jokersUsed.fifty + s.jokersUsed.hint + s.jokersUsed.skip,
      log: s.log, completed: completed
    };
  }

  /* ---------- Statistiques, donjon (Leitner), série ---------- */
  function bump(map, key, ok) {
    var e = map[key] || (map[key] = { a: 0, c: 0, recent: [] });
    e.a++; if (ok) e.c++;
    e.recent.push(ok ? 1 : 0); if (e.recent.length > 30) e.recent.shift();
  }
  function recordAnswer(state, entry, today) {
    if (entry.skipped) return;
    state.stats.answered++; if (entry.ok) state.stats.correct++;
    var q = state.stats.byQ[entry.id] || (state.stats.byQ[entry.id] = { a: 0, c: 0 });
    q.a++; if (entry.ok) q.c++; q.last = today;
    bump(state.stats.byTask, entry.task, entry.ok);
    bump(state.stats.byModule, String(entry.module), entry.ok);
  }
  function dungeonUpdate(state, entry, today, inDungeon) {
    if (entry.skipped) return;
    var d = state.dungeon[entry.id];
    if (!entry.ok) {
      state.dungeon[entry.id] = { box: 0, due: dayNum(today) + 0, misses: ((d && d.misses) || 0) + 1 };
      return;
    }
    if (d && inDungeon) {
      d.box++;
      if (d.box >= LEITNER_DAYS.length) { delete state.dungeon[entry.id]; state.dungeonMastered++; }
      else d.due = dayNum(today) + LEITNER_DAYS[d.box];
    }
  }
  function dungeonDue(state, today) {
    var n = dayNum(today);
    return Object.keys(state.dungeon).filter(function (id) { return state.dungeon[id].due <= n; });
  }
  function touchStreak(state, today) {
    var st = state.streak;
    if (st.last === today) return;
    if (st.last && daysBetween(st.last, today) === 1) st.count++;
    else st.count = 1;
    st.last = today;
  }
  function touchDaily(state, today, n) {
    if (state.daily.date !== today) state.daily = { date: today, count: 0, goalReached: false };
    state.daily.count += n;
    var newly = false;
    if (!state.daily.goalReached && state.daily.count >= DAILY_GOAL) { state.daily.goalReached = true; newly = true; }
    return newly;
  }

  /* Applique un résultat de session à l'état. Retourne les récompenses. */
  function applyResult(state, res, ctx) {
    ctx = ctx || {};
    var today = ctx.today || todayStr();
    var levels = ctx.levels || [];
    var levelBefore = levelFromXp(state.xp);
    res.log.forEach(function (e) { recordAnswer(state, e, today); dungeonUpdate(state, e, today, res.mode === "dungeon"); });
    var answered = res.log.filter(function (e) { return !e.skipped; }).length;
    var coins = Math.floor(res.points / 10);
    var firstClear = false;
    if (res.levelId) {
      var L = state.levels[res.levelId] || (state.levels[res.levelId] = { best: 0, stars: 0, passed: false, plays: 0 });
      L.plays++;
      if (res.passed && !L.passed) firstClear = true;
      if (res.passed) L.passed = true;
      if (res.pct > L.best && !res.failed) L.best = res.pct;
      if (res.stars > L.stars) { coins += 10 * (res.stars - L.stars); L.stars = res.stars; }
      if (firstClear) coins += res.mode === "boss" ? 100 : 20;
    }
    var xpGain = res.points + (firstClear ? (res.mode === "boss" ? 200 : 50) : 0);
    state.xp += xpGain; state.coins += coins;
    if (answered > 0) touchStreak(state, today);
    var goalNow = touchDaily(state, today, answered);
    if (goalNow) state.coins += 25;
    state.history.push({ t: Date.now(), d: today, mode: res.mode, label: res.label, pct: Math.round(res.pct * 100), points: res.points, world: res.world });
    if (state.history.length > 200) state.history.shift();
    var levelAfter = levelFromXp(state.xp);
    var newBadges = checkBadges(state, { result: res, levels: levels, goalNow: goalNow });
    return { xpGain: xpGain, coins: coins + (goalNow ? 25 : 0), leveledUp: levelAfter > levelBefore, newLevel: levelAfter, firstClear: firstClear, goalReached: goalNow, newBadges: newBadges };
  }

  /* ---------- Badges ---------- */
  function award(state, id, out) { if (!state.badges[id]) { state.badges[id] = Date.now(); out.push(id); } }
  function checkBadges(state, ctx) {
    var out = [], r = ctx.result, levels = ctx.levels || [];
    var lvl = levelFromXp(state.xp);
    if (Object.keys(state.levels).some(function (k) { return state.levels[k].passed; })) award(state, "first_step", out);
    if (Object.keys(state.levels).some(function (k) { return state.levels[k].stars >= 3; })) award(state, "first_star3", out);
    if (r) {
      if (r.maxStreak >= 5) award(state, "combo5", out);
      if (r.maxStreak >= 10) award(state, "combo10", out);
      if (r.mode === "boss" && r.passed) { award(state, "boss" + r.world, out); if (r.jokersUsedTotal === 0) award(state, "no_joker", out); }
      if (r.mode === "hardcore" && r.pct >= PASS && !r.failed && r.answered >= 5) award(state, "hardcore_win", out);
      if (r.speedBonuses >= 5) award(state, "speedy", out);
      if (r.mode === "exam") { award(state, "exam_done", out); if (r.score >= 700) award(state, "exam_pass", out); if (r.score >= 850) award(state, "exam_850", out); }
    }
    var w1 = levels.filter(function (l) { return l.world === 1; });
    if (w1.length && w1.every(function (l) { return state.levels[l.id] && state.levels[l.id].stars >= 3; })) award(state, "world1_3stars", out);
    if (state.stats.answered >= 100) award(state, "q100", out);
    if (state.stats.answered >= 500) award(state, "q500", out);
    if (state.streak.count >= 3) award(state, "streak3", out);
    if (state.streak.count >= 7) award(state, "streak7", out);
    if (state.daily.goalReached) award(state, "daily_goal", out);
    if (state.dungeonMastered >= 10) award(state, "dungeon_clear", out);
    if (Object.keys(state.owned).length > 0) award(state, "shopper", out);
    if (Object.keys(state.courseOpened).length >= 5) award(state, "scholar", out);
    if (state.flashSeen >= 20) award(state, "flash20", out);
    if (lvl >= 5) award(state, "level5", out);
    if (lvl >= 15) award(state, "level15", out);
    return out;
  }

  /* ---------- Boutique ---------- */
  function buy(state, item) {
    if (state.coins < item.price) return { ok: false, reason: "Pas assez de pièces" };
    if (item.kind !== "joker" && state.owned[item.id]) return { ok: false, reason: "Déjà possédé" };
    state.coins -= item.price;
    if (item.kind === "joker") state.jokers[item.value] = (state.jokers[item.value] || 0) + 1;
    else state.owned[item.id] = true;
    return { ok: true, newBadges: checkBadges(state, {}) };
  }

  /* ---------- Examen blanc ---------- */
  function examQuotas(meta, total) {
    var raw = meta.worlds.map(function (w) { return { id: w.id, exact: total * w.weight / 100 }; });
    raw.forEach(function (r) { r.n = Math.floor(r.exact); r.frac = r.exact - r.n; });
    var left = total - raw.reduce(function (s, r) { return s + r.n; }, 0);
    raw.slice().sort(function (a, b) { return b.frac - a.frac; }).slice(0, left).forEach(function (r) { r.n++; });
    var q = {}; raw.forEach(function (r) { q[r.id] = r.n; }); return q;
  }
  function buildExam(meta, modules, rng, total) {
    total = total || meta.exam.total;
    var quotas = examQuotas(meta, total), picked = [], missing = [];
    meta.worlds.forEach(function (w) {
      var qs = moduleQuestions(modules, w.id);
      if (qs.length < quotas[w.id]) missing.push({ world: w.id, have: qs.length, need: quotas[w.id] });
      picked = picked.concat(shuffle(qs, rng).slice(0, quotas[w.id]));
    });
    picked = shuffle(picked, rng);
    var minutes = Math.round(meta.exam.minutes * picked.length / meta.exam.total);
    return { questions: picked, quotas: quotas, missing: missing, minutes: Math.max(minutes, 1), partial: missing.length > 0 };
  }
  /* Score estimé : conversion linéaire prudente (70 % de bonnes réponses ≈ 700).
     Le vrai score AWS est mis à l'échelle et inconnu : ceci n'est qu'une estimation. */
  function scoreExam(questions, responses) {
    var byModule = {}, correct = 0;
    questions.forEach(function (q, i) {
      var ok = isCorrect(q, responses[i]);
      if (ok) correct++;
      var m = byModule[q.module] || (byModule[q.module] = { a: 0, c: 0 });
      m.a++; if (ok) m.c++;
    });
    var pct = questions.length ? correct / questions.length : 0;
    var score = Math.max(100, Math.round(1000 * pct));
    return { correct: correct, total: questions.length, pct: pct, score: score, passed: score >= 700, byModule: byModule };
  }

  /* ---------- Estimation de la probabilité de réussite ----------
     1) Pour chaque domaine m : taux récent r_m = moyenne des 30 dernières réponses (lissage de Laplace (c+1)/(n+2)).
     2) Confiance k_m = N_m / (N_m + 15), N_m = nombre TOTAL de réponses du domaine : peu de réponses → proche de 50 %.
        a_m = k_m * r_m + (1 - k_m) * 0.5
     3) Score attendu E = Σ poids_m × a_m  (poids officiels 20/24/28/14/14).
     4) Probabilité P = 1 / (1 + exp(-(E - 0.70) / 0.05)) : courbe en S centrée sur 70 %. */
  function passProbability(state, meta) {
    var E = 0, per = [];
    meta.worlds.forEach(function (w) {
      var e = state.stats.byModule[String(w.id)];
      var n = e ? e.recent.length : 0;
      var c = e ? e.recent.reduce(function (s, x) { return s + x; }, 0) : 0;
      var r = (c + 1) / (n + 2);
      var N = e ? e.a : 0;
      var k = N / (N + 15);
      var a = k * r + (1 - k) * 0.5;
      per.push({ world: w.id, n: n, total: N, rate: n ? c / n : null, adjusted: a });
      E += (w.weight / 100) * a;
    });
    var p = 1 / (1 + Math.exp(-(E - 0.70) / 0.05));
    return { probability: p, expected: E, perModule: per };
  }
  function weakTasks(state, minAttempts) {
    minAttempts = minAttempts || 3;
    return Object.keys(state.stats.byTask).map(function (t) {
      var e = state.stats.byTask[t];
      var n = e.recent.length, c = e.recent.reduce(function (s, x) { return s + x; }, 0);
      return { task: t, n: n, rate: n ? c / n : 0 };
    }).filter(function (x) { return x.n >= minAttempts; }).sort(function (a, b) { return a.rate - b.rate; });
  }

  /* ---------- Amis : lien-défi sans serveur ----------
     Le lien contient une « carte de score » encodée (base64url du JSON). Ce n'est pas signé :
     c'est un jeu entre amis, pas un classement officiel. Tout est validé et borné au décodage. */
  function fnv(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); }
  function b64encode(str) {
    var b = typeof Buffer !== "undefined" ? Buffer.from(str, "utf8").toString("base64") : btoa(unescape(encodeURIComponent(str)));
    return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64decode(b) {
    b = String(b).replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "=";
    return typeof Buffer !== "undefined" ? Buffer.from(b, "base64").toString("utf8") : decodeURIComponent(escape(atob(b)));
  }
  function totalStars(state) { return Object.keys(state.levels).reduce(function (a, k) { return a + (state.levels[k].stars || 0); }, 0); }
  function bestExam(state) { return state.exams.filter(function (e) { return !e.partial; }).reduce(function (a, e) { return Math.max(a, e.score); }, 0); }
  function scoreCard(state) {
    return { n: state.profile.name, a: state.profile.avatar, x: state.xp, s: totalStars(state), b: Object.keys(state.badges).length,
      e: bestExam(state), q: state.stats.answered, d: todayStr() };
  }
  function makeInviteCode(state) {
    var c = scoreCard(state), json = JSON.stringify(c);
    return b64encode(JSON.stringify({ v: 1, c: c, k: fnv(json) }));
  }
  function parseInviteCode(code) {
    var o;
    try { o = JSON.parse(b64decode(code)); } catch (e) { return null; }
    if (!o || o.v !== 1 || !o.c || typeof o.c !== "object") return null;
    if (fnv(JSON.stringify(o.c)) !== o.k) return null;
    var c = o.c, num = function (x, max) { x = Math.floor(Number(x)); return isFinite(x) ? clamp(x, 0, max) : 0; };
    var name = String(c.n || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 20);
    var av = Array.from(String(c.a || "🙂")).slice(0, 4).join("");
    if (!name) return null;
    return { n: name, a: av, x: num(c.x, 1e7), s: num(c.s, 999), b: num(c.b, 999), e: num(c.e, 1000), q: num(c.q, 1e6),
      d: /^\d{4}-\d{2}-\d{2}$/.test(c.d) ? c.d : todayStr() };
  }
  function addFriend(state, card) {
    if (!card) return { ok: false, reason: "Lien d'invitation invalide" };
    if (card.n.toLowerCase() === String(state.profile.name).toLowerCase()) return { ok: false, reason: "C'est ton propre lien 😄" };
    var key = card.n.toLowerCase(), prev = state.friends[key];
    state.friends[key] = card;
    return { ok: true, updated: !!prev };
  }
  /* Classement : moi + amis (+ autres profils de l'appareil), trié selon by = "x" (XP), "s" (étoiles) ou "e" (examen) */
  function leaderboard(state, others, by) {
    by = by || "x";
    var me = scoreCard(state); me.me = true;
    var seen = {}; seen[me.n.toLowerCase()] = true;
    var rows = [me];
    (others || []).concat(Object.keys(state.friends).map(function (k) { return state.friends[k]; })).forEach(function (c) {
      var k = c.n.toLowerCase(); if (seen[k]) return; seen[k] = true; rows.push(c);
    });
    rows.sort(function (a, b) { return (b[by] - a[by]) || (b.x - a.x) || a.n.localeCompare(b.n); });
    rows.forEach(function (r, i) { r.rank = i + 1; r.level = levelFromXp(r.x); });
    return rows;
  }

  var Engine = {
    BASE_POINTS: BASE_POINTS, PASS: PASS, DAILY_GOAL: DAILY_GOAL, LEITNER_DAYS: LEITNER_DAYS,
    rngFrom: rngFrom, shuffle: shuffle, todayStr: todayStr, dayNum: dayNum, daysBetween: daysBetween, clamp: clamp,
    newState: newState, migrate: migrate,
    xpForLevel: xpForLevel, levelFromXp: levelFromXp, titleFor: titleFor, levelProgress: levelProgress,
    buildLevels: buildLevels, isUnlocked: isUnlocked, worldUnlocked: worldUnlocked, questionsForLevel: questionsForLevel,
    isCorrect: isCorrect, stars: stars, comboMultiplier: comboMultiplier,
    createSession: createSession, currentQuestion: currentQuestion, answerQuestion: answerQuestion, nextQuestion: nextQuestion,
    canUseJoker: canUseJoker, useJoker: useJoker, sessionResult: sessionResult,
    applyResult: applyResult, recordAnswer: recordAnswer, dungeonDue: dungeonDue, touchStreak: touchStreak,
    checkBadges: checkBadges, buy: buy,
    examQuotas: examQuotas, buildExam: buildExam, scoreExam: scoreExam,
    passProbability: passProbability, weakTasks: weakTasks,
    scoreCard: scoreCard, makeInviteCode: makeInviteCode, parseInviteCode: parseInviteCode, addFriend: addFriend, leaderboard: leaderboard, totalStars: totalStars
  };
  if (typeof module !== "undefined" && module.exports) module.exports = Engine;
  else root.Engine = Engine;
})(typeof window !== "undefined" ? window : this);

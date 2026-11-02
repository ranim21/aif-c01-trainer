/* AWS AI Quest — écrans */
(function (root) {
  "use strict";
  var E = root.Engine, U = root.UI, META = root.META;
  var esc = U.esc, $ = U.$, $all = U.$all;
  var LETTERS = "ABCDEFGHIJ";
  var S = {};               // écrans
  var timerHandle = null;

  function A() { return root.App; }
  function st() { return root.App.state; }
  function main() { return $("#main"); }
  function setHTML(html) { var m = main(); m.innerHTML = html; m.scrollTop = 0; root.scrollTo(0, 0); }
  function clearTimer() { if (timerHandle) { clearInterval(timerHandle); timerHandle = null; } }
  function worldOf(id) { return META.worlds.find(function (w) { return w.id === id; }); }
  function taskInfo(taskId) {
    for (var i = 0; i < META.worlds.length; i++) { var t = META.worlds[i].tasks.find(function (x) { return x.id === taskId; }); if (t) return t; }
    return { id: taskId, title: "", fr: "" };
  }
  function starsStr(n) { return "★★★".slice(0, n) + "☆☆☆".slice(0, 3 - n); }
  function pct(x) { return Math.round(x * 100) + " %"; }
  function fmtTime(sec) { sec = Math.max(0, Math.floor(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ":" + (s < 10 ? "0" : "") + s; }

  /* =============== Onboarding =============== */
  S.onboarding = function () {
    var s = st(), pick = s.profile.avatar || META.avatars[0];
    setHTML('<div class="card center"><div style="font-size:3rem">🚀</div><h1>Bienvenue dans AWS AI Quest !</h1>' +
      '<p>Traverse 5 mondes, bats les boss et décroche ta certification <b>AWS Certified AI Practitioner (AIF-C01)</b> du premier coup.</p></div>' +
      '<div class="card"><h2>Ton avatar</h2><div class="avatar-pick" id="ava">' +
      META.avatars.map(function (a) { return '<button type="button" data-a="' + a + '" class="' + (a === pick ? "sel" : "") + '" aria-label="Avatar ' + a + '">' + a + "</button>"; }).join("") +
      '</div><h2 style="margin-top:16px">Ton pseudo</h2><input class="input" id="pseudo" maxlength="20" placeholder="ex. CloudNinja" autocomplete="off">' +
      '<h2 style="margin-top:16px">Date de ton examen</h2><input class="input" id="exdate" type="date" value="' + esc(s.settings.examDate) + '">' +
      '<p class="small muted" style="margin-top:12px">🔒 Ta progression est enregistrée <b>sur cet appareil et dans ce navigateur</b> uniquement. Aucune donnée n\'est envoyée sur Internet.</p>' +
      '<button class="btn primary block" id="go" style="margin-top:8px">C\'est parti !</button></div>');
    $("#ava").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; pick = b.dataset.a; $all("#ava button").forEach(function (x) { x.classList.toggle("sel", x === b); }); };
    $("#go").onclick = function () {
      var name = $("#pseudo").value.trim();
      if (!name) { U.toast("Choisis un pseudo 🙂"); $("#pseudo").focus(); return; }
      s.profile.name = name; s.profile.avatar = pick;
      if ($("#exdate").value) s.settings.examDate = $("#exdate").value;
      A().save(); U.sfx("win"); U.confetti(40); A().go("map");
    };
  };

  /* =============== Carte =============== */
  S.map = function () {
    var s = st(), app = A(), today = E.todayStr();
    var daily = s.daily.date === today ? s.daily.count : 0;
    var dleft = E.daysBetween(today, s.settings.examDate);
    var due = E.dungeonDue(s, today).length;
    var html = "";
    if (!app.isStandalone() && !s.settings.installDismissed) {
      html += '<div class="card flat"><div class="row"><div style="font-size:1.8rem">📲</div><div class="grow"><b>Installe le jeu sur ton téléphone</b><div class="small muted">Accès en un geste, même hors ligne.</div></div>' +
        '<button class="icon-btn" id="noInstall" aria-label="Masquer">✕</button></div><button class="btn small block" id="howInstall" style="margin-top:10px">Comment l\'installer ?</button></div>';
    }
    html += '<div class="card"><div class="row"><div class="grow"><b>🎯 Objectif du jour</b><div class="small muted">' + Math.min(daily, E.DAILY_GOAL) + " / " + E.DAILY_GOAL + " questions" + (s.daily.goalReached && s.daily.date === today ? " ✅" : "") + '</div></div>' +
      '<div class="stat"><b>🔥 ' + s.streak.count + '</b><span class="small muted">jour' + (s.streak.count > 1 ? "s" : "") + '</span></div>' +
      '<div class="stat"><b>📅 ' + (dleft >= 0 ? dleft : "—") + '</b><span class="small muted">J-examen</span></div></div>' +
      '<div class="progress" style="margin-top:10px"><i style="width:' + Math.min(100, daily / E.DAILY_GOAL * 100) + '%"></i></div>' +
      (due ? '<button class="btn block" style="margin-top:12px" data-go="dungeon">🗝️ ' + due + ' question' + (due > 1 ? "s" : "") + ' à revoir dans le Donjon</button>' : "") + "</div>";

    META.worlds.forEach(function (w) {
      var lv = app.levels.filter(function (l) { return l.world === w.id; });
      var avail = lv.some(function (l) { return l.available; });
      var open = E.worldUnlocked(s, app.levels, w.id);
      var starsGot = lv.reduce(function (a, l) { return a + ((s.levels[l.id] && s.levels[l.id].stars) || 0); }, 0);
      html += '<section class="world ' + (open ? "" : "locked") + '"><div class="world-head" style="background:linear-gradient(135deg,' + w.color + ',' + w.color + 'aa)">' +
        '<span class="big">' + w.emoji + '</span><div class="grow"><b>Monde ' + w.id + " · " + esc(w.name) + '</b><small>' + esc(w.domain) + " · " + w.weight + ' % de l\'examen</small></div>' +
        '<div class="center small"><b>' + starsGot + "/" + lv.length * 3 + '</b><br>★</div></div>';
      if (!avail) { html += '<div class="card flat center muted small" style="margin-top:8px">🚧 Ce monde arrive dans une prochaine mise à jour.</div></section>'; return; }
      html += '<div class="row" style="margin:10px 0 0"><button class="btn small" data-course="' + w.id + '">📚 Cours</button><button class="btn small" data-labs="' + w.id + '">🧪 Exercices</button><button class="btn small" data-flash="' + w.id + '">🃏 Flashcards</button></div>';
      html += '<div class="path">';
      lv.forEach(function (l, i) {
        var rec = s.levels[l.id], unlocked = E.isUnlocked(s, app.levels, l.id);
        var cls = "node" + (l.kind === "boss" ? " boss" : "") + (rec && rec.passed ? " done" : unlocked ? " open" : " locked");
        var icon = !unlocked ? "🔒" : l.kind === "boss" ? w.boss.emoji : l.kind === "mix" ? "🎲" : (rec && rec.passed ? "✅" : "⚔️");
        if (i > 0) html += '<div class="connector"></div>';
        html += '<div class="node-row"><button class="' + cls + '" data-level="' + l.id + '" aria-label="' + esc(l.title) + '">' + icon + '</button>' +
          '<div class="node-info"><b>' + esc(l.title) + '</b><span class="stars" style="color:var(--accent)">' + starsStr((rec && rec.stars) || 0) + '</span>' +
          (rec && rec.best ? ' <span class="small muted">meilleur ' + pct(rec.best) + "</span>" : "") + "</div></div>";
      });
      html += "</div></section>";
    });
    html += '<p class="small muted center">🔒 Progression enregistrée sur cet appareil et ce navigateur.</p>';
    setHTML(html);
    var m = main();
    m.onclick = function (e) {
      var t = e.target.closest("[data-level],[data-course],[data-labs],[data-flash],[data-go],#howInstall,#noInstall");
      if (!t) return;
      if (t.id === "howInstall") return S.installHelp();
      if (t.id === "noInstall") { s.settings.installDismissed = true; app.save(); return S.map(); }
      if (t.dataset.go) return app.go(t.dataset.go);
      if (t.dataset.course) return app.go("course/" + t.dataset.course);
      if (t.dataset.labs) return app.go("labs/" + t.dataset.labs);
      if (t.dataset.flash) return app.go("flash/" + t.dataset.flash);
      if (t.dataset.level) S.levelSheet(t.dataset.level);
    };
  };

  S.levelSheet = function (levelId) {
    var app = A(), s = st(), l = app.levels.find(function (x) { return x.id === levelId; });
    if (!E.isUnlocked(s, app.levels, levelId)) { U.toast("🔒 Réussis d'abord le niveau précédent (70 % minimum)."); U.sfx("ko"); return; }
    var rec = s.levels[levelId], w = worldOf(l.world);
    var nq = E.questionsForLevel(l, app.modules).length;
    var desc = l.kind === "boss" ? "15 questions parmi les plus difficiles du monde. 5 cœurs. Fais tomber sa barre de vie et atteins 70 % pour débloquer le monde suivant !"
      : l.kind === "mix" ? "10 questions tirées au hasard dans tout le monde. Parfait pour consolider."
      : esc(taskInfo(l.task).title) + "<br><span class='muted'>" + nq + " questions · 3 cœurs</span>";
    U.modal('<h2>' + (l.kind === "boss" ? w.boss.emoji + " " : "") + esc(l.title) + "</h2><p>" + desc + "</p>" +
      (rec ? '<p class="small">Meilleur score : <b>' + pct(rec.best) + '</b> · <span style="color:var(--accent)">' + starsStr(rec.stars) + "</span> · " + rec.plays + " partie(s)</p>" : "") +
      '<p class="small muted">Étoiles : 70 % = ★ · 85 % = ★★ · 95 % = ★★★</p>' +
      '<div class="grid2" style="margin-top:12px">' + (l.kind === "task" ? '<button class="btn" id="lvCourse">📚 Cours</button>' : '<button class="btn" id="lvClose">Fermer</button>') +
      '<button class="btn primary" id="lvPlay">⚔️ Jouer</button></div>',
      function (m) {
        $("#lvPlay", m).onclick = function () { U.closeModal(); S.startLevel(levelId); };
        var c = $("#lvCourse", m); if (c) c.onclick = function () { U.closeModal(); app.go("course/" + l.world + "/" + l.task); };
        var x = $("#lvClose", m); if (x) x.onclick = U.closeModal;
      });
  };

  S.startLevel = function (levelId) {
    var app = A(), s = st(), l = app.levels.find(function (x) { return x.id === levelId; });
    var qs = E.questionsForLevel(l, app.modules);
    app.session = E.createSession({ mode: l.kind === "boss" ? "boss" : "level", levelId: l.id, world: l.world, label: l.title, questions: qs, timer: s.settings.timer, timerSeconds: s.settings.timerSeconds });
    app.go("play");
  };

  /* =============== Widget de réponse (partagé quiz / examen) =============== */
  function newQState(q) {
    var idx = q.options.map(function (_, i) { return i; });
    var qs = { perm: E.shuffle(idx), sel: [], order: [], match: q.options.map(function () { return -1; }), hidden: [], locked: [] };
    if (q.type === "matching") qs.tperm = E.shuffle(q.targets.map(function (_, i) { return i; }));
    return qs;
  }
  function responseOf(q, qs) {
    if (q.type === "ordering") return qs.order.slice();
    if (q.type === "matching") return qs.match.slice();
    return qs.sel.slice();
  }
  function isComplete(q, qs) {
    if (q.type === "single") return qs.sel.length === 1;
    if (q.type === "multiple") return qs.sel.length === q.correct.length;
    if (q.type === "ordering") return qs.order.length === q.options.length;
    return qs.match.every(function (x) { return x >= 0; });
  }
  function typeHint(q) {
    if (q.type === "multiple") return "Sélectionne " + q.correct.length + " réponses";
    if (q.type === "ordering") return "Touche les éléments dans le bon ordre";
    if (q.type === "matching") return "Associe chaque élément à sa description";
    return "Une seule bonne réponse";
  }
  /* reveal = afficher la correction */
  function widgetHTML(q, qs, reveal) {
    var h = "";
    if (q.type === "single" || q.type === "multiple") {
      h += '<div class="options">';
      qs.perm.forEach(function (i, p) {
        var cls = "option";
        if (qs.sel.indexOf(i) >= 0) cls += " selected";
        if (reveal) {
          var isC = q.correct.indexOf(i) >= 0, chosen = qs.sel.indexOf(i) >= 0;
          if (isC && chosen) cls += " correct"; else if (!isC && chosen) cls += " wrong"; else if (isC) cls += " missed correct";
        } else if (qs.hidden.indexOf(i) >= 0) cls += " gone";
        h += '<button class="' + cls + '" data-opt="' + i + '"' + (reveal ? " disabled" : "") + '><span class="letter">' + LETTERS[p] + '</span><span>' + esc(q.options[i]) + "</span></button>";
      });
      h += "</div>";
    } else if (q.type === "ordering") {
      h += '<p class="small muted">Ton ordre :</p><div class="options">';
      if (!qs.order.length) h += '<div class="muted small center" style="padding:10px;border:2px dashed var(--line);border-radius:14px">Touche les éléments ci-dessous…</div>';
      qs.order.forEach(function (i, k) {
        var cls = "order-item" + (reveal ? (q.correct[k] === i ? " correct" : " wrong") : "");
        h += '<div class="' + cls + '"><span class="num">' + (k + 1) + '</span><span class="txt">' + esc(q.options[i]) + "</span>" +
          (reveal || qs.locked.indexOf(i) >= 0 ? "" : '<button class="icon-btn" data-unorder="' + k + '" aria-label="Retirer">↩︎</button>') + "</div>";
      });
      h += "</div>";
      if (!reveal) {
        var rest = qs.perm.filter(function (i) { return qs.order.indexOf(i) < 0; });
        if (rest.length) {
          h += '<p class="small muted" style="margin-top:12px">À placer :</p><div class="options">';
          rest.forEach(function (i) { h += '<button class="option" data-order="' + i + '"><span class="letter">+</span><span>' + esc(q.options[i]) + "</span></button>"; });
          h += "</div>";
        }
      } else {
        h += '<p class="small" style="margin-top:10px"><b>Bon ordre :</b></p><ol>' + q.correct.map(function (i) { return "<li>" + esc(q.options[i]) + "</li>"; }).join("") + "</ol>";
      }
    } else if (q.type === "matching") {
      h += '<div class="options">';
      qs.perm.forEach(function (i) {
        var cls = "match-item" + (reveal ? (qs.match[i] === q.correct[i] ? " correct" : " wrong") : "");
        h += '<div class="' + cls + '"><b>' + esc(q.options[i]) + "</b>";
        if (reveal) {
          h += '<div class="small">' + (qs.match[i] >= 0 ? "Ta réponse : " + esc(q.targets[qs.match[i]]) : "Sans réponse") + "</div>";
          if (qs.match[i] !== q.correct[i]) h += '<div class="small"><b>✔ ' + esc(q.targets[q.correct[i]]) + "</b></div>";
        } else {
          h += '<select data-match="' + i + '"' + (qs.locked.indexOf(i) >= 0 ? " disabled" : "") + ' aria-label="Associer ' + esc(q.options[i]) + '"><option value="-1">— Choisir —</option>' +
            qs.tperm.map(function (t) { return '<option value="' + t + '"' + (qs.match[i] === t ? " selected" : "") + ">" + esc(q.targets[t]) + "</option>"; }).join("") + "</select>";
        }
        h += "</div>";
      });
      h += "</div>";
    }
    return h;
  }
  /* Gère les interactions ; onChange appelé après chaque modification */
  function bindWidget(container, q, qs, onChange) {
    container.onclick = function (e) {
      var b = e.target.closest("[data-opt],[data-order],[data-unorder]");
      if (!b || b.disabled) return;
      if (b.dataset.opt != null) {
        var i = +b.dataset.opt;
        if (q.type === "single") qs.sel = [i];
        else {
          var k = qs.sel.indexOf(i);
          if (k >= 0) qs.sel.splice(k, 1);
          else if (qs.sel.length < q.correct.length) qs.sel.push(i);
          else { U.toast("Maximum " + q.correct.length + " réponses. Désélectionne d'abord."); return; }
        }
      } else if (b.dataset.order != null) qs.order.push(+b.dataset.order);
      else if (b.dataset.unorder != null) qs.order.splice(+b.dataset.unorder, 1);
      U.sfx("click"); onChange();
    };
    container.onchange = function (e) {
      var sel = e.target.closest("select[data-match]");
      if (sel) { qs.match[+sel.dataset.match] = +sel.value; onChange(); }
    };
  }
  function explanationHTML(q, qs, ok) {
    var h = "<p>" + q.explanation + "</p>";
    var we = q.wrongExplanations || {};
    if (q.type === "single" || q.type === "multiple") {
      var wrongs = q.options.map(function (_, i) { return i; }).filter(function (i) { return q.correct.indexOf(i) < 0; });
      h += "<p><b>Pourquoi les autres réponses sont fausses :</b></p><ul>" + wrongs.map(function (i) {
        return "<li><i>" + esc(q.options[i]) + "</i> : " + esc(we[i] || "") + (qs && qs.sel.indexOf(i) >= 0 ? " <b>(ton choix)</b>" : "") + "</li>";
      }).join("") + "</ul>";
    } else {
      h += "<p><b>Détail par élément :</b></p><ul>" + q.options.map(function (o, i) { return "<li><i>" + esc(o) + "</i> : " + esc(we[i] || "") + "</li>"; }).join("") + "</ul>";
    }
    h += '<div class="tip">💡 <b>Astuce :</b> ' + esc(q.tip) + "</div>";
    return h;
  }

  /* =============== Partie (niveau, boss, modes) =============== */
  S.play = function () {
    var app = A(), s = app.session;
    if (!s) return app.go("map");
    if (s.finished && !s.answered) return S.result();
    var q = s.questions[s.idx];
    if (!s.qs || s.qs.id !== q.id) { s.qs = newQState(q); s.qs.id = q.id; s.answered = null; s.t0 = Date.now(); }
    var qs = s.qs, ans = s.answered;
    document.body.classList.add("fullscreen");
    var total = s.questions.length;
    var hearts = s.lives === Infinity ? "∞" : "❤️".repeat(Math.max(0, s.lives)) + "🤍".repeat(Math.max(0, s.maxLives - s.lives));
    var h = '<div class="quiz-top"><button class="icon-btn" id="quit" aria-label="Quitter">✕</button><div class="grow"><div class="progress"><i style="width:' + (s.idx / total * 100) + '%"></i></div></div><span class="hearts" aria-label="Vies">' + hearts + "</span></div>";
    if (s.mode === "boss") {
      var w = worldOf(s.world), hp = 1 - s.correctCount / total;
      h += '<div class="boss-box"><span class="face' + (ans && ans.correct ? " hit" : "") + '">' + w.boss.emoji + '</span><div class="small"><b>' + esc(w.boss.name) + '</b></div><div class="hp"><i style="width:' + (hp * 100) + '%"></i></div></div>';
    }
    if (s.timer && !ans) h += '<div class="timer-bar"><i id="tbar" style="width:100%"></i></div>';
    h += '<div class="meta-line"><span>Question ' + (s.idx + 1) + "/" + total + " · " + q.task + ' <span class="pill ' + q.difficulty + '">' + q.difficulty + "</span></span>" +
      '<span><b>' + s.score + " pts</b>" + (s.streak >= 3 ? ' <span class="combo">🔥 x' + E.comboMultiplier(s.streak) + "</span>" : "") + "</span></div>";
    h += '<div class="question">' + esc(q.question) + '</div><p class="small muted" style="margin-top:-6px">' + typeHint(q) + "</p>";
    h += '<div id="widget">' + widgetHTML(q, qs, !!ans) + "</div>";
    if (!ans) {
      if (s.allowJokers) {
        var inv = st().jokers;
        h += '<div class="jokers">' +
          '<button class="btn" data-j="fifty"' + (E.canUseJoker(s, "fifty", inv) ? "" : " disabled") + '>✂️ 50/50 (' + inv.fifty + ")</button>" +
          '<button class="btn" data-j="hint"' + (E.canUseJoker(s, "hint", inv) ? "" : " disabled") + '>💡 Indice (' + inv.hint + ")</button>" +
          '<button class="btn" data-j="skip"' + (E.canUseJoker(s, "skip", inv) ? "" : " disabled") + '>⏭️ Passer (' + inv.skip + ")</button></div>";
      }
      if (qs.hintText) h += '<div class="notice">💡 ' + qs.hintText + "</div>";
      h += '<div class="sticky-next"><button class="btn primary block" id="validate"' + (isComplete(q, qs) ? "" : " disabled") + ">Valider</button></div>";
    } else {
      h += '<div class="feedback ' + (ans.correct ? "ok" : "ko") + '"><h3>' + (ans.correct ? pickMsg(OK_MSGS) + " +" + ans.points + " pts" + (ans.multiplier > 1 ? " (combo x" + ans.multiplier + ")" : "") + (ans.speedBonus ? " ⚡+" + ans.speedBonus : "") : (ans.timeout ? "⏰ Temps écoulé !" : pickMsg(KO_MSGS))) + "</h3>" + explanationHTML(q, qs, ans.correct) + "</div>";
      h += '<div class="sticky-next"><button class="btn primary block" id="next">' + (s.finished || s.idx + 1 >= total ? "Voir le résultat" : "Continuer ➜") + "</button></div>";
    }
    setHTML(h);
    if (!ans) bindWidget($("#widget"), q, qs, function () { $("#widget").innerHTML = widgetHTML(q, qs, false); var v = $("#validate"); if (v) v.disabled = !isComplete(q, qs); });
    $("#quit").onclick = function () {
      U.confirmBox("Quitter la partie ?", "Ta progression dans ce niveau sera perdue (les réponses déjà données ne comptent pas).", "Quitter", function () { clearTimer(); app.session = null; document.body.classList.remove("fullscreen"); app.go("map"); }, true);
    };
    $all("[data-j]").forEach(function (b) { b.onclick = function () { useJoker(b.dataset.j); }; });
    var v = $("#validate"); if (v) v.onclick = function () { submit(false); };
    var n = $("#next"); if (n) n.onclick = function () {
      if (s.finished) return S.result();
      E.nextQuestion(s); s.qs = null;
      if (s.finished) return S.result();
      S.play();
    };
    clearTimer();
    if (s.timer && !ans) {
      var limit = s.timerSeconds;
      timerHandle = setInterval(function () {
        var el = (Date.now() - s.t0) / 1000, bar = $("#tbar");
        if (bar) bar.style.width = Math.max(0, 100 - el / limit * 100) + "%";
        if (el >= limit) { clearTimer(); submit(true); }
      }, 250);
    }
  };
  var OK_MSGS = ["✅ Bien joué !", "✅ Exact !", "✅ Bravo, tu gères !", "✅ Parfait !", "✅ Le cloud n'a plus de secrets pour toi !"];
  var KO_MSGS = ["❌ Pas tout à fait…", "❌ Raté, mais tu vas retenir celle-là !", "❌ Oups ! Lis bien l'explication", "❌ Presque ! L'examen piège souvent ici"];
  function pickMsg(a) { return a[Math.floor(Math.random() * a.length)]; }

  function submit(timeout) {
    var app = A(), s = app.session, q = E.currentQuestion(s), qs = s.qs;
    clearTimer();
    var resp = timeout ? (isComplete(q, qs) ? responseOf(q, qs) : []) : responseOf(q, qs);
    var out = E.answerQuestion(s, resp, Date.now() - s.t0);
    out.timeout = timeout && !out.correct;
    s.answered = out;
    U.sfx(out.correct ? "ok" : "ko");
    S.play();
    if (!out.correct) { var w = $("#widget"); if (w) w.classList.add("shake"); }
    var fb = $(".feedback");
    if (fb && fb.scrollIntoView) setTimeout(function () { try { fb.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { fb.scrollIntoView(); } }, out.correct ? 350 : 600);
  }
  function useJoker(kind) {
    var app = A(), s = app.session, q = E.currentQuestion(s), qs = s.qs;
    var r = E.useJoker(s, kind, st().jokers);
    if (!r) return;
    app.save();
    if (r.kind === "skip") {
      clearTimer(); U.toast("⏭️ Question passée (sans perte de cœur)");
      E.nextQuestion(s); s.qs = null; s.answered = null; return S.play();
    }
    if (r.hide) r.hide.forEach(function (i) { if (qs.hidden.indexOf(i) < 0) qs.hidden.push(i); qs.sel = qs.sel.filter(function (x) { return x !== i; }); });
    if (r.kind === "hint") {
      var t = taskInfo(r.task);
      qs.hintText = "Cette question porte sur la task statement <b>" + esc(r.task) + "</b> : " + esc(t.fr) + ".";
      if (r.reveal && q.type === "ordering") { qs.order = [r.reveal.option].concat(qs.order.filter(function (x) { return x !== r.reveal.option; })); qs.locked.push(r.reveal.option); qs.hintText += " Le premier élément a été placé pour toi."; }
      if (r.reveal && q.type === "matching") { qs.match[r.reveal.option] = r.reveal.target; qs.locked.push(r.reveal.option); qs.hintText += " Une association a été faite pour toi."; }
      if (r.hide) qs.hintText += " Une mauvaise réponse a été retirée.";
    }
    S.play();
  }

  /* =============== Résultat =============== */
  S.result = function () {
    var app = A(), s = app.session;
    if (!s) return app.go("map");
    clearTimer();
    document.body.classList.remove("fullscreen");
    var r = E.sessionResult(s);
    if (!s.applied) { s.reward = E.applyResult(st(), r, { levels: app.levels }); s.applied = true; app.save(); app.renderTop(); }
    var rw = s.reward, w = s.world ? worldOf(s.world) : null;
    var title = r.failed ? "💔 Plus de cœurs !" : !s.levelId ? "🏁 Partie terminée !" : r.passed ? (s.mode === "boss" ? "🏆 " + w.boss.name + " est vaincu !" : "🎉 Niveau réussi !") : "😅 Pas encore…";
    var h = '<div class="card center"><h1>' + title + "</h1>";
    if (s.levelId) h += '<div style="font-size:2.4rem;color:var(--accent);letter-spacing:4px">' + starsStr(r.stars) + "</div>";
    h += '<div class="grid2" style="margin:12px 0"><div class="stat"><b>' + pct(r.pct) + '</b><span class="small muted">' + r.correct + "/" + r.answered + ' bonnes</span></div><div class="stat"><b>' + r.points + '</b><span class="small muted">points</span></div>' +
      '<div class="stat"><b>+' + rw.xpGain + '</b><span class="small muted">XP</span></div><div class="stat"><b>+' + rw.coins + ' 💰</b><span class="small muted">pièces</span></div></div>';
    if (r.maxStreak >= 3) h += '<p>🔥 Meilleur combo : <b>' + r.maxStreak + "</b></p>";
    if (!r.passed && s.levelId) h += '<p class="muted">Il faut 70 % sans perdre tous tes cœurs. Relis le cours puis retente : tu y es presque !</p>';
    if (rw.firstClear && s.mode === "boss") h += '<p><b>🌍 Monde suivant débloqué !</b></p>';
    if (rw.goalReached) h += '<p>🎯 Objectif du jour atteint ! +25 💰</p>';
    if (rw.leveledUp) { var t = E.titleFor(rw.newLevel, META.playerTitles); h += '<p style="font-size:1.1rem">⬆️ <b>Niveau ' + rw.newLevel + "</b> : " + t.emoji + " " + t.title + "</p>"; }
    if (rw.newBadges.length) h += '<p>Nouveaux badges : ' + rw.newBadges.map(function (id) { var b = META.badges.find(function (x) { return x.id === id; }); return b ? b.emoji + " " + b.name : id; }).join(", ") + "</p>";
    h += "</div>";
    var wrong = r.log.filter(function (e) { return e.ok === false; });
    if (wrong.length) h += '<div class="card"><h2>📌 À retenir (' + wrong.length + ' erreur' + (wrong.length > 1 ? "s" : "") + ")</h2><p class=\"small muted\">Ces questions sont ajoutées au Donjon des erreurs pour être rejouées plus tard.</p>" +
      wrong.map(function (e) { var q = app.qById[e.id]; return '<details class="section"><summary>' + esc(q.question.slice(0, 90)) + (q.question.length > 90 ? "…" : "") + '</summary><div class="body">' + correctAnswerHTML(q) + explanationHTML(q, null, false) + "</div></details>"; }).join("") + "</div>";
    h += '<div class="grid2"><button class="btn" id="again">🔁 Rejouer</button><button class="btn primary" id="toMap">🗺️ Carte</button></div>';
    setHTML(h);
    if (r.passed || rw.leveledUp) { U.sfx("win"); U.confetti(rw.leveledUp || s.mode === "boss" ? 120 : 60); }
    if (rw.newBadges.length) U.toast("🏅 Nouveau badge débloqué !");
    $("#toMap").onclick = function () { app.session = null; app.go("map"); };
    $("#again").onclick = function () {
      var lid = s.levelId, mode = s.mode, opts = s.replay;
      app.session = null;
      if (lid) S.startLevel(lid); else if (opts) startCustom(opts); else app.go("modes");
      void mode;
    };
  };
  function correctAnswerHTML(q) {
    if (q.type === "ordering") return "<p><b>Bon ordre :</b> " + q.correct.map(function (i) { return esc(q.options[i]); }).join(" → ") + "</p>";
    if (q.type === "matching") return "<p><b>Bonnes paires :</b></p><ul>" + q.options.map(function (o, i) { return "<li>" + esc(o) + " → " + esc(q.targets[q.correct[i]]) + "</li>"; }).join("") + "</ul>";
    return "<p><b>Bonne réponse :</b> " + q.correct.map(function (i) { return esc(q.options[i]); }).join(" + ") + "</p>";
  }

  /* =============== Cours =============== */
  S.course = function (worldId, task) {
    var app = A(), w = worldOf(+worldId), mod = app.modules[+worldId], s = st();
    if (!mod || !mod.course) { U.toast("Cours bientôt disponible"); return app.go("map"); }
    var secs = mod.course.sections.filter(function (x) { return !task || x.task === task; });
    var tasks = w.tasks.filter(function (t) { return !task || t.id === task; });
    tasks.forEach(function (t) { s.courseOpened[t.id] = true; });
    var nb = E.checkBadges(s, { levels: app.levels }); app.save();
    if (nb.length) U.toast("🏅 Nouveau badge : Studieux !");
    var h = '<div class="row" style="margin-bottom:10px"><button class="icon-btn" id="back" aria-label="Retour">←</button><h1 class="grow" style="margin:0">' + w.emoji + " Cours · Monde " + w.id + "</h1></div>";
    if (!task) h += '<div class="card"><p>' + mod.course.intro + '</p><p class="small muted">Touche une section pour l\'ouvrir.</p></div>';
    tasks.forEach(function (t) {
      h += '<h2 style="margin-top:18px">' + t.id + " · " + esc(t.fr) + '</h2><p class="small muted" style="margin-top:-6px"><i>' + esc(t.title) + "</i></p>";
      secs.filter(function (x) { return x.task === t.id; }).forEach(function (sec, i) {
        h += '<details class="section"' + (task && i === 0 ? " open" : "") + "><summary>" + esc(sec.title) + '</summary><div class="body">' + U.renderBlocks(sec.blocks) + "</div></details>";
      });
      var lvl = app.levels.find(function (l) { return l.task === t.id; });
      if (lvl) h += '<button class="btn primary block" data-play="' + lvl.id + '" style="margin-bottom:8px">⚔️ Jouer le niveau ' + t.id + "</button>";
    });
    setHTML(h);
    $("#back").onclick = function () { history.back(); };
    main().onclick = function (e) { var b = e.target.closest("[data-play]"); if (b) S.levelSheet(b.dataset.play); };
  };

  /* =============== Exercices =============== */
  S.labs = function (worldId) {
    var app = A(), w = worldOf(+worldId), mod = app.modules[+worldId];
    if (!mod || !mod.labs) { U.toast("Exercices bientôt disponibles"); return app.go("map"); }
    var h = '<div class="row" style="margin-bottom:10px"><button class="icon-btn" id="back" aria-label="Retour">←</button><h1 class="grow" style="margin:0">🧪 Exercices · Monde ' + w.id + "</h1></div>" +
      '<p class="muted small">Scénarios « quel service et pourquoi ? » et TP guidés dans la console AWS. Réfléchis avant de révéler la réponse !</p>';
    mod.labs.forEach(function (l) {
      h += '<details class="section"><summary>' + (l.kind === "console" ? "🖥️ " : "🧩 ") + esc(l.title) + ' <span class="pill">' + l.task + '</span></summary><div class="body">';
      if (l.kind === "console") {
        h += '<div class="box trap"><b>💰 Coûts</b><br>' + l.cost + "</div><p><b>Étapes :</b></p><ol>" + l.steps.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol>" +
          '<button class="btn small" data-reveal>👀 Résultat attendu</button><div class="hidden"><div class="box tip"><b>Résultat attendu</b><br>' + l.expected + '</div><p><b>Pourquoi c\'est utile :</b> ' + l.why + "</p></div>";
      } else {
        h += "<p>" + l.scenario + '</p><button class="btn small" data-reveal>👀 Voir la réponse</button><div class="hidden"><div class="box tip">' + l.answer + "</div><p><b>Méthode :</b> " + l.why + "</p></div>";
      }
      h += "</div></details>";
    });
    setHTML(h);
    $("#back").onclick = function () { history.back(); };
    main().onclick = function (e) { var b = e.target.closest("[data-reveal]"); if (b) { b.nextElementSibling.classList.remove("hidden"); b.remove(); } };
  };

  /* =============== Flashcards =============== */
  S.flash = function (worldId) {
    var app = A(), cards = [];
    Object.keys(app.modules).forEach(function (k) {
      if (worldId && +worldId !== +k) return;
      var c = app.modules[k].course; if (c && c.flashcards) cards = cards.concat(c.flashcards);
    });
    if (!cards.length) { U.toast("Pas encore de flashcards"); return app.go("modes"); }
    cards = E.shuffle(cards);
    var i = 0;
    function draw() {
      var c = cards[i];
      setHTML('<div class="row" style="margin-bottom:6px"><button class="icon-btn" id="back" aria-label="Retour">←</button><h1 class="grow" style="margin:0">🃏 Flashcards</h1><span class="muted">' + (i + 1) + "/" + cards.length + "</span></div>" +
        '<p class="small muted">Touche la carte pour la retourner, puis glisse vers la gauche ou la droite pour changer de carte.</p>' +
        '<div class="flash" id="card"><div class="inner"><div class="face front">' + c.front + '</div><div class="face back">' + c.back + "</div></div></div>" +
        '<div class="grid2"><button class="btn" id="prev">← Précédente</button><button class="btn primary" id="nxt">Suivante →</button></div>');
      var card = $("#card");
      card.onclick = function () { card.classList.toggle("flipped"); };
      $("#back").onclick = function () { history.back(); };
      $("#prev").onclick = function () { go(-1); };
      $("#nxt").onclick = function () { go(1); };
      U.onSwipe(card, function (d) { go(d === "left" ? 1 : -1); });
    }
    function go(d) {
      var s = st(); s.flashSeen++; var nb = E.checkBadges(s, { levels: app.levels }); app.save();
      if (nb.length) U.toast("🏅 Nouveau badge : Mémoire vive !");
      i = (i + d + cards.length) % cards.length; draw();
    }
    draw();
  };

  /* =============== Modes libres =============== */
  S.modes = function () {
    var app = A(), s = st(), due = E.dungeonDue(s, E.todayStr()).length, inDungeon = Object.keys(s.dungeon).length;
    var avail = META.worlds.filter(function (w) { return app.modules[w.id] && app.modules[w.id].questions; });
    var h = '<h1>🎯 Modes de jeu</h1>' +
      '<div class="card"><h2>🏋️ Entraînement libre</h2><p class="small muted">Choisis le monde, la task statement et la difficulté. Pas de cœurs, à ton rythme.</p>' +
      '<label class="small">Monde</label><select class="input" id="fWorld"><option value="0">Tous les mondes disponibles</option>' + avail.map(function (w) { return '<option value="' + w.id + '">' + w.emoji + " Monde " + w.id + "</option>"; }).join("") + "</select>" +
      '<label class="small">Task statement</label><select class="input" id="fTask"></select>' +
      '<div class="grid2"><div><label class="small">Difficulté</label><select class="input" id="fDiff"><option value="">Toutes</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>' +
      '<div><label class="small">Nombre</label><select class="input" id="fNum"><option>10</option><option>20</option><option value="999">Toutes</option></select></div></div>' +
      '<button class="btn primary block" id="fGo" style="margin-top:12px">Lancer</button></div>' +
      '<div class="card"><h2>🗝️ Donjon des erreurs</h2><p class="small muted">Tes questions ratées reviennent selon une répétition espacée (boîtes de Leitner : aujourd\'hui → 1 j → 3 j → 7 j). Réussis-les 4 fois pour t\'en libérer.</p>' +
      "<p><b>" + due + "</b> à revoir aujourd'hui · <b>" + inDungeon + "</b> au total · <b>" + s.dungeonMastered + "</b> maîtrisées</p>" +
      '<button class="btn block" id="dGo"' + (inDungeon ? "" : " disabled") + ">Entrer dans le donjon</button></div>" +
      '<div class="card"><h2>💀 Hardcore</h2><p class="small muted">15 questions au hasard, <b>1 seule vie</b>, pas de joker, <b>points doublés</b>.</p><button class="btn block" id="hGo">J\'ose !</button></div>' +
      '<div class="card"><h2>📝 Défi Final : examen blanc</h2><p class="small muted">65 questions dans les proportions officielles 20/24/28/14/14, 90 min, pas de correction avant la fin, marquage « à revoir ».</p>' +
      (s.examInProgress ? '<button class="btn primary block" id="eResume">▶️ Reprendre l\'examen en cours</button>' : '<button class="btn primary block" id="eGo">Commencer</button>') + "</div>" +
      '<div class="card"><h2>🃏 Flashcards</h2><button class="btn block" id="flGo">Réviser toutes les flashcards</button></div>';
    setHTML(h);
    function fillTasks() {
      var wid = +$("#fWorld").value, ts = [];
      META.worlds.forEach(function (w) { if ((!wid || w.id === wid) && app.modules[w.id] && app.modules[w.id].questions) ts = ts.concat(w.tasks); });
      $("#fTask").innerHTML = '<option value="">Toutes</option>' + ts.map(function (t) { return '<option value="' + t.id + '">' + t.id + " · " + esc(t.fr) + "</option>"; }).join("");
    }
    fillTasks();
    $("#fWorld").onchange = fillTasks;
    $("#fGo").onclick = function () { startCustom({ mode: "free", world: +$("#fWorld").value, task: $("#fTask").value, diff: $("#fDiff").value, n: +$("#fNum").value, label: "Entraînement libre" }); };
    $("#dGo").onclick = function () { startCustom({ mode: "dungeon", label: "Donjon des erreurs" }); };
    $("#hGo").onclick = function () { startCustom({ mode: "hardcore", n: 15, label: "Hardcore" }); };
    $("#flGo").onclick = function () { app.go("flash"); };
    var eg = $("#eGo"); if (eg) eg.onclick = S.examIntro;
    var er = $("#eResume"); if (er) er.onclick = function () { app.go("exam"); };
  };
  function startCustom(o) {
    var app = A(), s = st(), pool = app.allQuestions.slice();
    if (o.mode === "dungeon") {
      var due = E.dungeonDue(s, E.todayStr());
      var ids = due.length ? due : Object.keys(s.dungeon);
      if (!due.length) U.toast("Rien d'urgent : on révise quand même tout le donjon 💪");
      pool = ids.map(function (id) { return app.qById[id]; }).filter(Boolean);
    } else {
      if (o.world) pool = pool.filter(function (q) { return q.module === o.world; });
      if (o.task) pool = pool.filter(function (q) { return q.task === o.task; });
      if (o.diff) pool = pool.filter(function (q) { return q.difficulty === o.diff; });
    }
    if (!pool.length) { U.toast("Aucune question ne correspond à ces filtres."); return; }
    var qs = E.shuffle(pool).slice(0, o.n || 20);
    app.session = E.createSession({ mode: o.mode, label: o.label, questions: qs, timer: s.settings.timer && o.mode !== "dungeon", timerSeconds: s.settings.timerSeconds, jokerLimit: o.mode === "free" ? 3 : 1 });
    app.session.replay = o;
    app.go("play");
  }

  /* =============== Examen blanc =============== */
  S.examIntro = function () {
    var app = A(), plan = E.buildExam(META, app.modules);
    var miss = plan.missing.map(function (m) { var w = worldOf(m.world); return w.emoji + " Monde " + m.world + " : " + m.have + "/" + m.need; }).join("<br>");
    U.modal('<h2>📝 Défi Final</h2>' +
      (plan.partial ? '<div class="notice">⚠️ Tous les mondes ne sont pas encore disponibles. L\'examen sera <b>partiel</b> : ' + plan.questions.length + ' questions en ' + plan.minutes + " min.<br>" + miss + "</div>" : "") +
      "<ul><li><b>" + plan.questions.length + " questions</b>, <b>" + plan.minutes + " minutes</b></li><li>Pas de vies, pas de jokers, pas de correction avant la fin</li><li>Tu peux marquer une question « à revoir » 🚩 et naviguer librement</li><li>Score estimé sur 1000, réussite à <b>700</b></li></ul>" +
      '<p class="small muted">Sur le vrai examen, 15 des 65 questions ne sont pas notées et le score est mis à l\'échelle. Ici, le score est une <b>estimation</b> : 70 % de bonnes réponses ≈ 700.</p>' +
      '<div class="grid2"><button class="btn" id="xNo">Plus tard</button><button class="btn primary" id="xGo">Démarrer ⏱️</button></div>',
      function (m) {
        $("#xNo", m).onclick = U.closeModal;
        $("#xGo", m).onclick = function () {
          U.closeModal();
          var now = Date.now();
          st().examInProgress = { ids: plan.questions.map(function (q) { return q.id; }), resp: {}, flags: {}, cur: 0, start: now, end: now + plan.minutes * 60000, partial: plan.partial,
            perms: plan.questions.map(function (q) { var qs = newQState(q); return { perm: qs.perm, tperm: qs.tperm || null }; }) };
          app.save(); app.go("exam");
        };
      });
  };
  S.exam = function () {
    var app = A(), s = st(), ex = s.examInProgress;
    if (!ex) return app.go("modes");
    document.body.classList.add("fullscreen");
    var qsList = ex.ids.map(function (id) { return app.qById[id]; });
    if (qsList.some(function (q) { return !q; })) { s.examInProgress = null; app.save(); U.toast("L'examen en cours n'est plus valide (contenu mis à jour)."); return app.go("modes"); }
    var view = "q";
    function qstate(i) {
      var q = qsList[i], p = ex.perms[i], r = ex.resp[i];
      var qs = { perm: p.perm, tperm: p.tperm, sel: [], order: [], match: q.options.map(function () { return -1; }), hidden: [], locked: [] };
      if (r) { if (q.type === "ordering") qs.order = r.slice(); else if (q.type === "matching") qs.match = r.slice(); else qs.sel = r.slice(); }
      return qs;
    }
    function store(i, q, qs) {
      var r = responseOf(q, qs);
      var empty = q.type === "matching" ? r.every(function (x) { return x < 0; }) : r.length === 0;
      if (empty) delete ex.resp[i]; else ex.resp[i] = r;
      app.save();
    }
    function draw() {
      var i = ex.cur, q = qsList[i], qs = qstate(i), n = qsList.length;
      var answered = Object.keys(ex.resp).length;
      var h = '<div class="quiz-top"><button class="icon-btn" id="xQuit" aria-label="Quitter">✕</button><div class="grow center"><b id="clock">⏱️</b><div class="small muted">' + answered + "/" + n + ' répondues</div></div><button class="icon-btn" id="xGrid" aria-label="Vue d\'ensemble">▦</button></div>';
      if (view === "grid") {
        h += '<h2>Vue d\'ensemble</h2><p class="small muted">🚩 = à revoir · couleur = répondue</p><div class="exam-grid">' + qsList.map(function (_, k) {
          return '<button data-goto="' + k + '" class="' + (ex.resp[k] ? "answered " : "") + (ex.flags[k] ? "flagged " : "") + (k === i ? "current" : "") + '">' + (k + 1) + (ex.flags[k] ? "🚩" : "") + "</button>";
        }).join("") + '</div><button class="btn primary block" id="xSubmit" style="margin-top:16px">Terminer l\'examen</button>';
      } else {
        h += '<div class="meta-line"><span>Question ' + (i + 1) + "/" + n + '</span><button class="btn small" id="xFlag">' + (ex.flags[i] ? "🚩 Marquée" : "🏳️ À revoir") + "</button></div>" +
          '<div class="question">' + esc(q.question) + '</div><p class="small muted" style="margin-top:-6px">' + typeHint(q) + '</p><div id="widget">' + widgetHTML(q, qs, false) + "</div>" +
          '<div class="grid2 sticky-next"><button class="btn" id="xPrev"' + (i === 0 ? " disabled" : "") + '>← Préc.</button>' +
          (i === n - 1 ? '<button class="btn primary" id="xEnd">Terminer</button>' : '<button class="btn primary" id="xNext">Suiv. →</button>') + "</div>";
      }
      setHTML(h);
      tick();
      $("#xQuit").onclick = function () {
        U.confirmBox("Mettre en pause ?", "Ton examen est sauvegardé. Le chrono continue de tourner, comme le jour J ! Tu pourras le reprendre depuis l'onglet Modes.", "Mettre en pause", function () { clearTimer(); document.body.classList.remove("fullscreen"); app.go("modes"); });
      };
      $("#xGrid").onclick = function () { view = view === "grid" ? "q" : "grid"; draw(); };
      if (view === "grid") {
        main().querySelector(".exam-grid").onclick = function (e) { var b = e.target.closest("[data-goto]"); if (b) { ex.cur = +b.dataset.goto; view = "q"; app.save(); draw(); } };
        $("#xSubmit").onclick = confirmEnd;
        return;
      }
      bindWidget($("#widget"), q, qs, function () { store(i, q, qs); $("#widget").innerHTML = widgetHTML(q, qs, false); });
      $("#xFlag").onclick = function () { if (ex.flags[i]) delete ex.flags[i]; else ex.flags[i] = true; app.save(); draw(); };
      var p = $("#xPrev"); if (p) p.onclick = function () { ex.cur--; app.save(); draw(); };
      var nx = $("#xNext"); if (nx) nx.onclick = function () { ex.cur++; app.save(); draw(); };
      var en = $("#xEnd"); if (en) en.onclick = confirmEnd;
      U.onSwipe($("#widget").parentNode.querySelector(".question"), function (d) {
        if (d === "left" && ex.cur < n - 1) { ex.cur++; draw(); } else if (d === "right" && ex.cur > 0) { ex.cur--; draw(); }
      });
    }
    function confirmEnd() {
      var n = qsList.length, a = Object.keys(ex.resp).length, f = Object.keys(ex.flags).length;
      U.confirmBox("Terminer l'examen ?", (n - a ? "⚠️ <b>" + (n - a) + " question(s) sans réponse</b> (comptées fausses). " : "Toutes les questions ont une réponse. ") + (f ? f + " question(s) marquée(s) 🚩." : ""), "Terminer", finish);
    }
    function tick() {
      clearTimer();
      var upd = function () {
        var left = (ex.end - Date.now()) / 1000, c = $("#clock");
        if (c) { c.textContent = "⏱️ " + fmtTime(left); c.style.color = left < 300 ? "var(--ko)" : ""; }
        if (left <= 0) { clearTimer(); U.toast("⏰ Temps écoulé ! Correction automatique."); finish(); }
      };
      upd(); timerHandle = setInterval(upd, 1000);
    }
    function finish() {
      clearTimer();
      var responses = qsList.map(function (_, k) { return ex.resp[k] || null; });
      var sc = E.scoreExam(qsList, responses);
      var log = qsList.map(function (q, k) { return { id: q.id, module: q.module, task: q.task, ok: E.isCorrect(q, responses[k]), points: 0 }; });
      var res = { mode: "exam", levelId: null, world: null, label: "Examen blanc", pct: sc.pct, correct: sc.correct, answered: sc.total, points: sc.correct * 10, maxStreak: 0, failed: false, passed: sc.passed, stars: 0, speedBonuses: 0, jokersUsedTotal: 0, log: log, score: sc.score };
      var rw = E.applyResult(s, res, { levels: app.levels });
      s.exams.push({ t: Date.now(), d: E.todayStr(), score: sc.score, pct: Math.round(sc.pct * 100), n: sc.total, partial: !!ex.partial, byModule: sc.byModule });
      app.lastExam = { qs: qsList, responses: responses, perms: ex.perms, sc: sc, rw: rw, flags: ex.flags };
      s.examInProgress = null; app.save(); app.renderTop();
      app.go("examresult");
    }
    draw();
  };
  S.examResult = function () {
    var app = A(), L = app.lastExam;
    if (!L) return app.go("modes");
    document.body.classList.remove("fullscreen");
    var sc = L.sc, onlyWrong = false;
    function draw() {
      var h = '<div class="card center"><h1>' + (sc.passed ? "🎓 Certification obtenue !" : "📚 Pas encore…") + '</h1><div style="font-size:2.6rem;font-weight:800;color:' + (sc.passed ? "var(--ok)" : "var(--ko)") + '">' + sc.score + ' <span class="small muted">/ 1000</span></div>' +
        '<p>' + sc.correct + "/" + sc.total + " bonnes réponses (" + pct(sc.pct) + ") · seuil 700</p><p class=\"small muted\">Score estimé (70 % ≈ 700). Le vrai score AWS est mis à l'échelle.</p>" +
        (L.rw.newBadges.length ? "<p>🏅 " + L.rw.newBadges.map(function (id) { var b = META.badges.find(function (x) { return x.id === id; }); return b ? b.emoji + " " + b.name : id; }).join(", ") + "</p>" : "") + "</div>";
      h += '<div class="card"><h2>Par domaine</h2>' + META.worlds.map(function (w) {
        var m = sc.byModule[w.id]; if (!m) return "";
        var p = m.c / m.a;
        return '<div style="margin:8px 0"><div class="row small"><span class="grow">' + w.emoji + " D" + w.id + " · " + esc(w.domain) + "</span><b>" + m.c + "/" + m.a + '</b></div><div class="progress"><i style="width:' + p * 100 + "%;background:" + (p >= 0.7 ? "var(--ok)" : "var(--ko)") + '"></i></div></div>';
      }).join("") + "</div>";
      h += '<div class="card"><div class="row"><h2 class="grow" style="margin:0">Correction</h2><label class="small"><input type="checkbox" id="ow"' + (onlyWrong ? " checked" : "") + "> Erreurs seulement</label></div>";
      L.qs.forEach(function (q, k) {
        var ok = E.isCorrect(q, L.responses[k]);
        if (onlyWrong && ok) return;
        var qs = { perm: L.perms[k].perm, tperm: L.perms[k].tperm, sel: [], order: [], match: q.options.map(function () { return -1; }), hidden: [], locked: [] };
        var r = L.responses[k];
        if (r) { if (q.type === "ordering") qs.order = r.slice(); else if (q.type === "matching") qs.match = r.slice(); else qs.sel = r.slice(); }
        h += '<details class="section"><summary>' + (ok ? "✅" : "❌") + " " + (k + 1) + ". " + (L.flags[k] ? "🚩 " : "") + esc(q.question.slice(0, 70)) + '…</summary><div class="body"><p><b>' + esc(q.question) + "</b></p>" + widgetHTML(q, qs, true) + explanationHTML(q, qs, ok) + "</div></details>";
      });
      h += '</div><div class="grid2"><button class="btn" id="toStats">📊 Stats</button><button class="btn primary" id="toMap">🗺️ Carte</button></div>';
      setHTML(h);
      $("#ow").onchange = function () { onlyWrong = this.checked; draw(); };
      $("#toMap").onclick = function () { app.go("map"); };
      $("#toStats").onclick = function () { app.go("stats"); };
    }
    draw();
    if (sc.passed) { U.sfx("win"); U.confetti(150); }
  };

  /* =============== Tableau de bord =============== */
  S.stats = function () {
    var app = A(), s = st(), today = E.todayStr();
    var lp = E.levelProgress(s.xp), title = E.titleFor(lp.level, META.playerTitles);
    var prob = E.passProbability(s, META);
    var dleft = E.daysBetween(today, s.settings.examDate);
    var h = '<h1>📊 Tableau de bord</h1>';
    h += '<div class="card"><div class="row"><div style="font-size:2.4rem">' + title.emoji + '</div><div class="grow"><b>Niveau ' + lp.level + " · " + title.title + '</b><div class="xpbar"><i style="width:' + lp.ratio * 100 + '%"></i></div><span class="small muted">' + lp.current + "/" + lp.needed + " XP · total " + s.xp + " XP</span></div></div>" +
      '<div class="grid2" style="margin-top:12px"><div class="stat"><b>🔥 ' + s.streak.count + '</b><span class="small muted">jours de série</span></div><div class="stat"><b>📅 ' + (dleft >= 0 ? dleft : "—") + '</b><span class="small muted">jours avant l\'examen</span></div>' +
      '<div class="stat"><b>' + s.stats.answered + '</b><span class="small muted">questions répondues</span></div><div class="stat"><b>' + (s.stats.answered ? pct(s.stats.correct / s.stats.answered) : "—") + '</b><span class="small muted">de réussite globale</span></div></div></div>';
    h += '<div class="card"><h2>🎯 Probabilité de réussite estimée</h2><div style="font-size:2.2rem;font-weight:800;color:' + (prob.probability >= 0.7 ? "var(--ok)" : prob.probability >= 0.4 ? "var(--accent)" : "var(--ko)") + '">' + Math.round(prob.probability * 100) + ' %</div>' +
      '<p class="small">Score attendu : <b>' + Math.round(prob.expected * 100) + ' %</b> de bonnes réponses (il en faut environ 70 %).</p>' +
      (s.stats.answered < 60 ? '<p class="small muted">🌱 Encore peu de données : l\'estimation reste prudente. Elle montera au fil de tes parties, en particulier quand tu auras joué dans les 5 mondes.</p>' : "") +
      '<details class="section"><summary>Comment est-ce calculé ?</summary><div class="body small"><ol><li>Pour chaque domaine : ton taux de réussite sur tes 30 dernières réponses.</li><li>Avec peu de réponses, on reste prudent : on mélange ce taux avec 50 %, avec un poids N / (N + 15), où N est ton nombre total de réponses dans le domaine. Un domaine jamais travaillé compte donc pour 50 %.</li><li>On fait la moyenne pondérée selon les poids officiels 20/24/28/14/14.</li><li>On convertit en probabilité avec une courbe en S centrée sur 70 %.</li></ol><p>⚠️ C\'est une <b>estimation</b> pour te guider, pas une garantie : le vrai examen a ses propres questions et un score mis à l\'échelle.</p></div></details></div>';
    var vals = prob.perModule.map(function (p) { return p.rate == null ? 0 : p.rate; });
    h += '<div class="card"><h2>🕸️ Compétences par domaine</h2><div class="center">' + U.radar(vals, META.worlds.map(function (w) { return "D" + w.id; })) + "</div>" +
      prob.perModule.map(function (p) { var w = worldOf(p.world); return '<div class="row small"><span class="grow">' + w.emoji + " D" + w.id + " (" + w.weight + " %)</span><span>" + (p.rate == null ? "pas encore joué" : pct(p.rate) + " sur " + p.n) + "</span></div>"; }).join("") + "</div>";
    h += '<div class="card"><h2>🗺️ Progression par monde</h2>' + META.worlds.map(function (w) {
      var lv = app.levels.filter(function (l) { return l.world === w.id; });
      var got = lv.reduce(function (a, l) { return a + ((s.levels[l.id] && s.levels[l.id].stars) || 0); }, 0), passed = lv.filter(function (l) { return s.levels[l.id] && s.levels[l.id].passed; }).length;
      return '<div style="margin:8px 0"><div class="row small"><span class="grow">' + w.emoji + " " + esc(w.name) + "</span><span>" + passed + "/" + lv.length + " niveaux · " + got + '★</span></div><div class="progress"><i style="width:' + passed / lv.length * 100 + '%"></i></div></div>';
    }).join("") + "</div>";
    var weak = E.weakTasks(s, 3).slice(0, 5);
    h += '<div class="card"><h2>🩹 Points faibles</h2>' + (weak.length ? weak.map(function (t) {
      var w = META.worlds.find(function (x) { return x.tasks.some(function (y) { return y.id === t.task; }); });
      return '<div class="row small" style="margin:6px 0"><span class="grow"><b>' + t.task + "</b> " + esc(taskInfo(t.task).fr) + "</span><span>" + pct(t.rate) + '</span><button class="btn small" data-c="' + w.id + "/" + t.task + '">Cours</button></div>';
    }).join("") : '<p class="muted small">Réponds à au moins 3 questions par task statement pour voir tes points faibles.</p>') + "</div>";
    var hist = s.history.slice(-20);
    h += '<div class="card"><h2>📈 Courbe de progression</h2><p class="small muted">Réussite (%) sur tes 20 dernières parties</p>' + U.lineChart(hist.map(function (x) { return x.pct; }), { max: 100, ref: 70 }) + "</div>";
    if (s.exams.length) h += '<div class="card"><h2>📝 Examens blancs</h2>' + U.lineChart(s.exams.slice(-10).map(function (x) { return x.score; }), { max: 1000, ref: 700 }) +
      s.exams.slice(-5).reverse().map(function (x) { return '<div class="row small"><span class="grow">' + x.d + (x.partial ? " (partiel)" : "") + "</span><b style=\"color:" + (x.score >= 700 ? "var(--ok)" : "var(--ko)") + '">' + x.score + "</b></div>"; }).join("") + "</div>";
    h += '<div class="card"><h2>🕘 Historique</h2>' + (s.history.length ? s.history.slice(-10).reverse().map(function (x) { return '<div class="row small" style="border-bottom:1px solid var(--line);padding:6px 0"><span class="grow">' + x.d + " · " + esc(x.label || x.mode) + "</span><span>" + x.pct + " % · " + x.points + " pts</span></div>"; }).join("") : '<p class="muted small">Aucune partie pour l\'instant.</p>') + "</div>";
    setHTML(h);
    main().onclick = function (e) { var b = e.target.closest("[data-c]"); if (b) app.go("course/" + b.dataset.c); };
  };

  /* =============== Boutique =============== */
  S.shop = function () {
    var app = A(), s = st();
    var h = '<h1>🛒 Boutique</h1><div class="card row"><div class="grow">Tes pièces</div><b style="font-size:1.4rem">' + s.coins + ' 💰</b></div>' +
      '<p class="small muted">Gagne des pièces en jouant (1 pièce par 10 points, bonus d\'étoiles, de boss et d\'objectif du jour).</p>';
    [["joker", "🃏 Jokers"], ["avatar", "🎭 Avatars"], ["theme", "🎨 Thèmes"]].forEach(function (g) {
      h += "<h2>" + g[1] + "</h2>";
      META.shop.filter(function (i) { return i.kind === g[0]; }).forEach(function (it) {
        var owned = it.kind !== "joker" && s.owned[it.id];
        var icon = it.kind === "avatar" ? it.value : it.kind === "theme" ? "🎨" : it.value === "fifty" ? "✂️" : it.value === "hint" ? "💡" : "⏭️";
        var extra = it.kind === "joker" ? '<span class="small muted">En stock : ' + (s.jokers[it.value] || 0) + "</span>" : "";
        var action = owned ? (it.kind === "avatar" ? (s.profile.avatar === it.value ? '<span class="pill">Équipé</span>' : '<button class="btn small" data-equip="' + it.id + '">Équiper</button>')
          : (s.settings.colorTheme === it.value ? '<span class="pill">Actif</span>' : '<button class="btn small" data-equip="' + it.id + '">Activer</button>'))
          : '<button class="btn small primary" data-buy="' + it.id + '"' + (s.coins < it.price ? " disabled" : "") + ">" + it.price + " 💰</button>";
        h += '<div class="card shop-item"><span class="e">' + icon + '</span><div class="grow"><b>' + esc(it.name) + "</b><br>" + extra + "</div>" + action + "</div>";
      });
    });
    if (s.settings.colorTheme !== "default") h += '<button class="btn block" data-equip="default">Revenir au thème par défaut</button>';
    setHTML(h);
    main().onclick = function (e) {
      var b = e.target.closest("[data-buy],[data-equip]"); if (!b) return;
      if (b.dataset.buy) {
        var it = META.shop.find(function (x) { return x.id === b.dataset.buy; });
        var r = E.buy(s, it);
        if (!r.ok) { U.toast(r.reason); return; }
        U.sfx("win"); U.toast("✅ " + it.name + " acheté !");
        if (r.newBadges && r.newBadges.length) U.toast("🏅 Nouveau badge : Client fidèle !");
      } else if (b.dataset.equip === "default") { s.settings.colorTheme = "default"; }
      else {
        var it2 = META.shop.find(function (x) { return x.id === b.dataset.equip; });
        if (it2.kind === "avatar") s.profile.avatar = it2.value; else s.settings.colorTheme = it2.value;
      }
      app.save(); app.applyTheme(); app.renderTop(); S.shop();
    };
  };

  /* =============== Profil, badges, réglages =============== */
  S.profile = function () {
    var app = A(), s = st();
    var avatars = META.avatars.concat(META.shop.filter(function (i) { return i.kind === "avatar" && s.owned[i.id]; }).map(function (i) { return i.value; }));
    var got = Object.keys(s.badges).length;
    var h = '<h1>👤 Profil</h1><div class="card"><label class="small">Pseudo</label><input class="input" id="pName" maxlength="20" value="' + esc(s.profile.name) + '">' +
      '<label class="small" style="display:block;margin-top:10px">Avatar</label><div class="avatar-pick" id="pAva">' + avatars.map(function (a) { return '<button type="button" data-a="' + a + '" class="' + (a === s.profile.avatar ? "sel" : "") + '">' + a + "</button>"; }).join("") + "</div>" +
      '<label class="small" style="display:block;margin-top:10px">Date de l\'examen</label><input class="input" type="date" id="pDate" value="' + esc(s.settings.examDate) + '"></div>';
    h += '<div class="card"><h2>🏅 Badges (' + got + "/" + META.badges.length + ')</h2><div class="badge-grid">' + META.badges.map(function (b) {
      return '<div class="badge ' + (s.badges[b.id] ? "" : "locked") + '"><span class="e">' + b.emoji + "</span><b>" + esc(b.name) + '</b><div class="muted">' + esc(b.desc) + "</div></div>";
    }).join("") + "</div></div>";
    h += '<div class="card"><h2>⚙️ Réglages</h2>' +
      sw("sSound", "🔊 Sons", s.settings.sound) + sw("sVib", "📳 Vibrations", s.settings.vibration) + sw("sTimer", "⏱️ Chrono (" + s.settings.timerSeconds + " s par question, bonus de rapidité)", s.settings.timer) +
      '<div class="switch"><span>🌗 Thème</span><select id="sTheme" class="input" style="width:auto"><option value="auto">Auto</option><option value="light">Clair</option><option value="dark">Sombre</option></select></div></div>';
    h += '<div class="card"><h2>📲 Installer l\'application</h2><button class="btn block" id="pInstall">Voir les instructions</button></div>';
    h += '<div class="card"><h2>💾 Sauvegarde</h2><p class="small">🔒 Ta progression est enregistrée <b>sur cet appareil et dans ce navigateur</b>' + (root.Store.isPersistent() ? "" : ' <b style="color:var(--ko)">(stockage indisponible : la progression sera perdue à la fermeture. Évite la navigation privée.)</b>') +
      '. Si tu changes de téléphone ou de navigateur, exporte-la puis importe-la.</p>' +
      '<div class="grid2"><button class="btn" id="pExport">⬇️ Exporter</button><button class="btn" id="pImport">⬆️ Importer</button></div>' +
      '<button class="btn danger block" id="pReset" style="margin-top:10px">🗑️ Remettre à zéro</button></div>';
    h += '<p class="small muted center">AWS AI Quest · version ' + esc(app.version) + '<br>Contenu basé sur le guide officiel AIF-C01 v1.2. Projet personnel, non affilié à AWS.</p>';
    setHTML(h);
    $("#sTheme").value = s.settings.theme;
    $("#pName").onchange = function () { var v = this.value.trim(); if (v) { s.profile.name = v; app.save(); app.renderTop(); } };
    $("#pDate").onchange = function () { if (this.value) { s.settings.examDate = this.value; app.save(); U.toast("📅 Date enregistrée"); } };
    $("#pAva").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; s.profile.avatar = b.dataset.a; app.save(); app.renderTop(); S.profile(); };
    $("#sSound").onchange = function () { s.settings.sound = this.checked; app.save(); };
    $("#sVib").onchange = function () { s.settings.vibration = this.checked; app.save(); };
    $("#sTimer").onchange = function () { s.settings.timer = this.checked; app.save(); };
    $("#sTheme").onchange = function () { s.settings.theme = this.value; app.save(); app.applyTheme(); };
    $("#pInstall").onclick = S.installHelp;
    $("#pExport").onclick = function () {
      var txt = root.Store.exportJSON(s);
      U.modal('<h2>⬇️ Exporter</h2><p class="small">Copie ce texte et garde-le (notes, e-mail à toi-même…). Tu pourras le coller dans « Importer » sur un autre appareil.</p><textarea class="input" id="exTxt" rows="8" readonly style="font-size:.75rem"></textarea>' +
        '<div class="grid2" style="margin-top:10px"><button class="btn" id="exClose">Fermer</button><button class="btn primary" id="exCopy">📋 Copier</button></div>', function (m) {
          $("#exTxt", m).value = txt;
          $("#exClose", m).onclick = U.closeModal;
          $("#exCopy", m).onclick = function () {
            var ta = $("#exTxt", m); ta.select();
            var done = function () { U.toast("📋 Copié !"); };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { try { document.execCommand("copy"); done(); } catch (e) { U.toast("Sélectionne le texte et copie-le manuellement."); } });
            else { try { document.execCommand("copy"); done(); } catch (e) { U.toast("Sélectionne le texte et copie-le manuellement."); } }
          };
        });
    };
    $("#pImport").onclick = function () {
      U.modal('<h2>⬆️ Importer</h2><p class="small">Colle ici le texte exporté. ⚠️ Cela <b>remplace</b> la progression actuelle de cet appareil.</p><textarea class="input" id="imTxt" rows="8" style="font-size:.75rem"></textarea>' +
        '<div class="grid2" style="margin-top:10px"><button class="btn" id="imClose">Annuler</button><button class="btn primary" id="imGo">Importer</button></div>', function (m) {
          $("#imClose", m).onclick = U.closeModal;
          $("#imGo", m).onclick = function () {
            try { app.state = root.Store.importJSON($("#imTxt", m).value); app.save(); U.closeModal(); app.applyTheme(); app.renderTop(); U.toast("✅ Progression importée !"); app.go("map"); }
            catch (e) { U.toast("❌ " + esc(e.message || "Texte invalide")); }
          };
        });
    };
    $("#pReset").onclick = function () {
      U.confirmBox("Tout effacer ?", "XP, étoiles, badges, pièces, statistiques… <b>Tout sera perdu définitivement</b> sur cet appareil. Pense à exporter d'abord si tu veux garder une copie.", "Oui, tout effacer", function () {
        root.Store.reset(); app.state = E.newState(); app.save(); app.applyTheme(); app.renderTop(); U.toast("Progression remise à zéro"); app.go("onboarding");
      }, true);
    };
  };
  function sw(id, label, on) { return '<label class="switch"><span>' + label + '</span><input type="checkbox" id="' + id + '"' + (on ? " checked" : "") + "></label>"; }

  S.installHelp = function () {
    var app = A();
    U.modal('<h2>📲 Ajouter à l\'écran d\'accueil</h2>' +
      (app.installPrompt ? '<button class="btn primary block" id="instNow">Installer maintenant</button><p class="small muted center">ou manuellement :</p>' : "") +
      '<h3>🍏 iPhone / iPad (Safari)</h3><ol><li>Ouvre le lien dans <b>Safari</b>.</li><li>Touche le bouton <b>Partager</b> (carré avec une flèche ↑).</li><li>Choisis <b>« Sur l\'écran d\'accueil »</b>, puis <b>Ajouter</b>.</li></ol>' +
      '<h3>🤖 Android (Chrome)</h3><ol><li>Ouvre le lien dans <b>Chrome</b>.</li><li>Touche le menu <b>⋮</b> en haut à droite.</li><li>Choisis <b>« Installer l\'application »</b> (ou « Ajouter à l\'écran d\'accueil »).</li></ol>' +
      '<p class="small muted">Une fois installé, le jeu s\'ouvre en plein écran et fonctionne même hors ligne. Ta progression reste liée à ce navigateur.</p><button class="btn block" id="instClose">Fermer</button>',
      function (m) {
        $("#instClose", m).onclick = U.closeModal;
        var b = $("#instNow", m);
        if (b) b.onclick = function () { app.installPrompt.prompt(); app.installPrompt.userChoice.then(function () { app.installPrompt = null; U.closeModal(); }); };
      });
  };

  S.clearTimer = clearTimer;
  root.Screens = S;
})(window);

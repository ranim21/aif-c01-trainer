/* AWS AI Quest — démarrage, routage, barre du haut, thème, PWA */
(function (root) {
  "use strict";
  var E = root.Engine, U = root.UI, META = root.META, S = root.Screens;
  var VERSION = "1.0.0";    // garder synchronisé avec CACHE_VERSION dans sw.js

  var modules = {};
  META.worlds.forEach(function (w) { if (root[w.key]) modules[w.id] = root[w.key]; });
  var allQuestions = [], qById = {};
  Object.keys(modules).forEach(function (k) { (modules[k].questions || []).forEach(function (q) { allQuestions.push(q); qById[q.id] = q; }); });

  var App = {
    version: VERSION, modules: modules, allQuestions: allQuestions, qById: qById,
    levels: E.buildLevels(META, modules),
    state: root.Store.load(), session: null, lastExam: null, installPrompt: null,
    save: function () { root.Store.save(App.state); },
    go: function (route) { if (location.hash === "#/" + route) App.render(); else location.hash = "#/" + route; },
    isStandalone: function () { return (root.matchMedia && root.matchMedia("(display-mode: standalone)").matches) || root.navigator.standalone === true; },
    applyTheme: function () {
      var t = App.state.settings.theme, dark = t === "dark" || (t === "auto" && root.matchMedia && root.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
      document.documentElement.setAttribute("data-color", App.state.settings.colorTheme || "default");
    },
    renderTop: function () {
      var s = App.state, lp = E.levelProgress(s.xp), t = E.titleFor(lp.level, META.playerTitles);
      U.$("#topbar").innerHTML = '<button class="ava" id="topAva" aria-label="Profil">' + U.esc(s.profile.avatar) + '</button><div class="who"><b>' + U.esc(s.profile.name || "Joueur") + " · Niv. " + lp.level + " " + t.emoji + '</b><div class="xpbar"><i style="width:' + (lp.ratio * 100) + '%"></i></div></div>' +
        '<div class="chips"><span class="chip" title="Pièces">💰 ' + s.coins + '</span><span class="chip" title="Série">🔥 ' + s.streak.count + "</span></div>";
      U.$("#topAva").onclick = function () { App.go("profile"); };
    },
    render: function () {
      S.clearTimer();
      U.closeModal();
      var parts = (location.hash.replace(/^#\/?/, "") || "map").split("/");
      var r = parts[0];
      if (!App.state.profile.name && r !== "onboarding") { r = "onboarding"; try { history.replaceState(null, "", "#/onboarding"); } catch (e) { /* ignore */ } }
      if (r !== "play" && r !== "exam") document.body.classList.remove("fullscreen");
      U.$all("#tabs button").forEach(function (b) { b.classList.toggle("active", b.dataset.tab === r || (r === "flash" && b.dataset.tab === "modes")); });
      App.renderTop();
      switch (r) {
        case "onboarding": return S.onboarding();
        case "map": return S.map();
        case "play": return S.play();
        case "course": return S.course(parts[1] || 1, parts[2]);
        case "labs": return S.labs(parts[1] || 1);
        case "flash": return S.flash(parts[1]);
        case "modes": return S.modes();
        case "dungeon": return S.modes();
        case "exam": return S.exam();
        case "examresult": return S.examResult();
        case "stats": return S.stats();
        case "shop": return S.shop();
        case "profile": return S.profile();
        default: return S.map();
      }
    }
  };
  root.App = App;
  U.setSettingsGetter(function () { return App.state.settings; });

  U.$("#tabs").onclick = function (e) { var b = e.target.closest("button[data-tab]"); if (b) App.go(b.dataset.tab); };
  root.addEventListener("hashchange", App.render);
  if (root.matchMedia) {
    var mq = root.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", App.applyTheme);
  }
  root.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); App.installPrompt = e; });
  /* Sauvegarde de sécurité quand l'app passe en arrière-plan */
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") App.save(); });

  /* Le donjon est accessible via l'onglet Modes ; la route #/dungeon y mène directement */
  App.applyTheme();
  App.render();

  /* Service worker : cache hors ligne + mise à jour */
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").then(function (reg) {
      reg.addEventListener("updatefound", function () {
        var nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", function () {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            U.toast('🆕 Nouvelle version disponible ! <button class="btn small" id="reloadApp" style="pointer-events:auto;margin-left:8px">Recharger</button>', 15000);
            setTimeout(function () { var b = U.$("#reloadApp"); if (b) b.onclick = function () { location.reload(); }; }, 50);
          }
        });
      });
    }).catch(function () { /* hors ligne ou non supporté */ });
  }
})(window);

/* AWS AI Quest — sauvegarde locale (localStorage avec repli en mémoire) */
(function (root) {
  "use strict";
  var KEY = "aif-c01-quest-v1";
  var memory = null, persistent = true;

  function test() {
    try { var k = "__t"; root.localStorage.setItem(k, "1"); root.localStorage.removeItem(k); return true; }
    catch (e) { return false; }
  }
  persistent = test();

  var Storage = {
    isPersistent: function () { return persistent; },
    load: function () {
      var raw = null;
      if (persistent) { try { raw = root.localStorage.getItem(KEY); } catch (e) { persistent = false; } }
      if (!raw) raw = memory;
      if (!raw) return root.Engine.newState();
      try { return root.Engine.migrate(JSON.parse(raw)); } catch (e) { return root.Engine.newState(); }
    },
    save: function (state) {
      var raw = JSON.stringify(state);
      memory = raw;
      if (persistent) { try { root.localStorage.setItem(KEY, raw); } catch (e) { persistent = false; } }
    },
    exportJSON: function (state) { return JSON.stringify({ app: "aif-c01-quest", exportedAt: new Date().toISOString(), state: state }, null, 1); },
    importJSON: function (text) {
      var obj = JSON.parse(text);
      var st = obj && obj.app === "aif-c01-quest" ? obj.state : obj;
      if (!st || typeof st !== "object" || !st.profile || !st.stats) throw new Error("Fichier de sauvegarde invalide");
      return root.Engine.migrate(st);
    },
    reset: function () {
      memory = null;
      if (persistent) { try { root.localStorage.removeItem(KEY); } catch (e) { /* ignore */ } }
    }
  };
  root.Store = Storage;
})(window);

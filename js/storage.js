/* AWS AI Quest — sauvegarde locale multi-profils (localStorage, avec repli en mémoire).
   Registre : { active: id|null, profiles: [{ id, name, avatar, pin: hash|null, createdAt }] }
   État d'un profil : clé KEY + ":" + id.
   Le code PIN est un simple verrou de confort entre les personnes qui partagent un téléphone.
   Ce n'est PAS une protection de sécurité : tout reste stocké en clair sur l'appareil. */
(function (root) {
  "use strict";
  var KEY = "aif-c01-quest-v1", REG = KEY + ":profiles";
  var memory = {}, persistent = true;

  function test() {
    try { var k = "__t"; root.localStorage.setItem(k, "1"); root.localStorage.removeItem(k); return true; }
    catch (e) { return false; }
  }
  persistent = test();
  function get(k) {
    if (persistent) { try { var v = root.localStorage.getItem(k); if (v != null) return v; } catch (e) { persistent = false; } }
    return k in memory ? memory[k] : null;
  }
  function set(k, v) {
    memory[k] = v;
    if (persistent) { try { root.localStorage.setItem(k, v); } catch (e) { persistent = false; } }
  }
  function del(k) {
    delete memory[k];
    if (persistent) { try { root.localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  }
  function hashPin(id, pin) {             // FNV-1a 32 bits : verrou de confort uniquement
    var s = id + ":" + pin, h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ("0000000" + h.toString(16)).slice(-8);
  }
  function newId() { return "p" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); }

  function registry() {
    var r = null;
    try { r = JSON.parse(get(REG) || "null"); } catch (e) { r = null; }
    if (!r || !Array.isArray(r.profiles)) {
      r = { active: null, profiles: [] };
      // Migration depuis la version mono-profil (v1.0.0)
      var old = get(KEY);
      if (old) {
        try {
          var st = JSON.parse(old);
          if (st && st.profile && st.profile.name) {
            var id = newId();
            r.profiles.push({ id: id, name: st.profile.name, avatar: st.profile.avatar || "🦊", pin: null, createdAt: Date.now() });
            r.active = id;
            set(KEY + ":" + id, old);
          }
        } catch (e) { /* ignore */ }
        del(KEY);
      }
      set(REG, JSON.stringify(r));
    }
    return r;
  }
  function saveRegistry(r) { set(REG, JSON.stringify(r)); }
  function findProfile(r, id) { return r.profiles.find(function (p) { return p.id === id; }) || null; }

  var Storage = {
    isPersistent: function () { return persistent; },
    hashPin: hashPin,
    profiles: function () { return registry().profiles.map(function (p) { return { id: p.id, name: p.name, avatar: p.avatar, hasPin: !!p.pin }; }); },
    activeId: function () { var r = registry(); return r.active && findProfile(r, r.active) ? r.active : null; },
    /* Inscription : crée un profil et s'y connecte */
    createProfile: function (name, avatar, pin) {
      var r = registry();
      name = String(name || "").trim().slice(0, 20);
      if (!name) throw new Error("Pseudo requis");
      if (r.profiles.some(function (p) { return p.name.toLowerCase() === name.toLowerCase(); })) throw new Error("Ce pseudo existe déjà sur cet appareil");
      if (pin && !/^\d{4}$/.test(pin)) throw new Error("Le code PIN doit contenir 4 chiffres");
      var id = newId();
      r.profiles.push({ id: id, name: name, avatar: avatar || "🦊", pin: pin ? hashPin(id, pin) : null, createdAt: Date.now() });
      r.active = id; saveRegistry(r);
      var st = root.Engine.newState(); st.profile.name = name; st.profile.avatar = avatar || "🦊";
      set(KEY + ":" + id, JSON.stringify(st));
      return id;
    },
    /* Connexion */
    login: function (id, pin) {
      var r = registry(), p = findProfile(r, id);
      if (!p) return false;
      if (p.pin && hashPin(id, pin || "") !== p.pin) return false;
      r.active = id; saveRegistry(r); return true;
    },
    logout: function () { var r = registry(); r.active = null; saveRegistry(r); },
    setPin: function (pin) {
      var r = registry(), p = findProfile(r, r.active);
      if (!p) return false;
      if (pin && !/^\d{4}$/.test(pin)) throw new Error("Le code PIN doit contenir 4 chiffres");
      p.pin = pin ? hashPin(p.id, pin) : null; saveRegistry(r); return true;
    },
    /* Garde le registre à jour (nom/avatar) quand le joueur les modifie */
    syncProfile: function (state) {
      var r = registry(), p = findProfile(r, r.active);
      if (p && state && state.profile) { p.name = state.profile.name || p.name; p.avatar = state.profile.avatar || p.avatar; saveRegistry(r); }
    },
    load: function () {
      var id = this.activeId();
      if (!id) return null;
      var raw = get(KEY + ":" + id);
      var st;
      try { st = raw ? root.Engine.migrate(JSON.parse(raw)) : root.Engine.newState(); } catch (e) { st = root.Engine.newState(); }
      var p = findProfile(registry(), id);
      if (!st.profile.name && p) { st.profile.name = p.name; st.profile.avatar = p.avatar; }
      return st;
    },
    /* Résumé de tous les profils de l'appareil (pour le classement) */
    loadAllSummaries: function () {
      var out = [];
      registry().profiles.forEach(function (p) {
        try { var st = JSON.parse(get(KEY + ":" + p.id) || "null"); if (st) out.push({ id: p.id, state: root.Engine.migrate(st) }); } catch (e) { /* ignore */ }
      });
      return out;
    },
    save: function (state) {
      var id = this.activeId();
      if (!id || !state) return;
      set(KEY + ":" + id, JSON.stringify(state));
    },
    exportJSON: function (state) { return JSON.stringify({ app: "aif-c01-quest", exportedAt: new Date().toISOString(), state: state }, null, 1); },
    importJSON: function (text) {
      var obj = JSON.parse(text);
      var st = obj && obj.app === "aif-c01-quest" ? obj.state : obj;
      if (!st || typeof st !== "object" || !st.profile || !st.stats) throw new Error("Fichier de sauvegarde invalide");
      return root.Engine.migrate(st);
    },
    /* Remise à zéro de la progression du profil actif (le profil est conservé) */
    reset: function () {
      var id = this.activeId(); if (!id) return;
      var p = findProfile(registry(), id);
      var st = root.Engine.newState(); if (p) { st.profile.name = p.name; st.profile.avatar = p.avatar; }
      set(KEY + ":" + id, JSON.stringify(st));
    },
    /* Suppression complète du profil actif */
    deleteProfile: function () {
      var r = registry(), id = r.active; if (!id) return;
      r.profiles = r.profiles.filter(function (p) { return p.id !== id; }); r.active = null; saveRegistry(r);
      del(KEY + ":" + id);
    }
  };
  root.Store = Storage;
})(window);

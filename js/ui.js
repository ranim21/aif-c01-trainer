/* AWS AI Quest — utilitaires d'interface : rendu, sons, vibrations, confettis, schémas, graphiques SVG */
(function (root) {
  "use strict";
  var doc = root.document;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  /* ---------- Toasts & modale ---------- */
  function toast(msg, ms) {
    var box = $("#toasts"), el = doc.createElement("div");
    el.className = "toast"; el.innerHTML = msg; box.appendChild(el);
    setTimeout(function () { el.remove(); }, ms || 2600);
  }
  function modal(html, onMount) {
    var m = $("#modal");
    m.innerHTML = '<div class="sheet">' + html + "</div>";
    m.classList.remove("hidden");
    m.onclick = function (e) { if (e.target === m) closeModal(); };
    if (onMount) onMount(m);
  }
  function closeModal() { var m = $("#modal"); m.classList.add("hidden"); m.innerHTML = ""; }
  /* Confirmation intégrée à la page (pas de window.confirm) */
  function confirmBox(title, text, okLabel, onOk, danger) {
    modal('<h2>' + title + '</h2><p>' + text + '</p><div class="grid2" style="margin-top:14px"><button class="btn" data-x="no">Annuler</button><button class="btn ' + (danger ? "danger" : "primary") + '" data-x="yes">' + okLabel + "</button></div>",
      function (m) {
        $('[data-x="no"]', m).onclick = closeModal;
        $('[data-x="yes"]', m).onclick = function () { closeModal(); onOk(); };
      });
  }

  /* ---------- Sons (WebAudio, discrets) & vibrations ---------- */
  var actx = null;
  var settingsRef = function () { return { sound: true, vibration: true }; };
  function setSettingsGetter(fn) { settingsRef = fn; }
  function tone(freq, dur, type, vol, delay) {
    try {
      actx = actx || new (root.AudioContext || root.webkitAudioContext)();
      var t0 = actx.currentTime + (delay || 0);
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.06, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) { /* audio indisponible */ }
  }
  function sfx(kind) {
    var s = settingsRef();
    if (s.sound) {
      if (kind === "ok") { tone(660, .12); tone(880, .16, "sine", .06, .1); }
      else if (kind === "ko") { tone(220, .22, "triangle", .07); }
      else if (kind === "win") { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, .18, "sine", .06, i * .12); }); }
      else if (kind === "click") { tone(440, .05, "sine", .03); }
    }
    if (s.vibration && root.navigator && root.navigator.vibrate) {
      try { root.navigator.vibrate(kind === "ko" ? [60, 40, 60] : kind === "win" ? [30, 30, 30, 30, 80] : 25); } catch (e) { /* ignore */ }
    }
  }
  function confetti(n) {
    if (root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var colors = ["#ff9900", "#ff9f1c", "#16a34a", "#ef4444", "#06b6d4", "#facc15"];
    for (var i = 0; i < (n || 70); i++) {
      var c = doc.createElement("i");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = (1.8 + Math.random() * 1.8) + "s";
      c.style.animationDelay = (Math.random() * .4) + "s";
      doc.body.appendChild(c);
      (function (el) { setTimeout(function () { el.remove(); }, 4200); })(c);
    }
  }

  /* ---------- Gestes : swipe ---------- */
  function onSwipe(el, cb) {
    var x0 = null, y0 = null;
    el.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", function (e) {
      if (x0 == null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) cb(dx < 0 ? "left" : "right");
      x0 = null;
    }, { passive: true });
  }

  /* ---------- Schémas du cours (SVG inline) ---------- */
  var DIAGRAMS = {
    nested: '<svg viewBox="0 0 320 250" role="img" aria-label="AI contient ML qui contient Deep Learning qui contient GenAI">' +
      '<ellipse cx="160" cy="125" rx="155" ry="120" fill="#ff990022" stroke="#ff9900" stroke-width="2"/>' +
      '<ellipse cx="160" cy="145" rx="118" ry="92" fill="#06b6d422" stroke="#06b6d4" stroke-width="2"/>' +
      '<ellipse cx="160" cy="165" rx="82" ry="64" fill="#f9731622" stroke="#f97316" stroke-width="2"/>' +
      '<ellipse cx="160" cy="185" rx="48" ry="36" fill="#16a34a22" stroke="#16a34a" stroke-width="2"/>' +
      '<text x="160" y="30" text-anchor="middle" font-weight="700">AI</text>' +
      '<text x="160" y="72" text-anchor="middle" font-weight="700">Machine Learning</text>' +
      '<text x="160" y="120" text-anchor="middle" font-weight="700">Deep Learning</text>' +
      '<text x="160" y="182" text-anchor="middle" font-weight="700">GenAI</text>' +
      '<text x="160" y="198" text-anchor="middle" font-size="10">(FM, LLM)</text></svg>',
    fit: '<svg viewBox="0 0 330 120" role="img" aria-label="Underfitting, good fit, overfitting">' +
      [0, 1, 2].map(function (k) {
        var x0 = 5 + k * 110, pts = [[15, 85], [30, 70], [45, 72], [60, 50], [75, 48], [90, 30]];
        var dots = pts.map(function (p) { return '<circle cx="' + (x0 + p[0]) + '" cy="' + p[1] + '" r="3.5" fill="#ff9900"/>'; }).join("");
        var curve = k === 0 ? '<line x1="' + (x0 + 8) + '" y1="62" x2="' + (x0 + 98) + '" y2="58" stroke="#ef4444" stroke-width="2.5"/>'
          : k === 1 ? '<path d="M' + (x0 + 8) + ' 90 Q ' + (x0 + 55) + ' 62 ' + (x0 + 98) + ' 26" fill="none" stroke="#16a34a" stroke-width="2.5"/>'
          : '<polyline points="' + pts.map(function (p) { return (x0 + p[0]) + "," + p[1]; }).join(" ") + '" fill="none" stroke="#f97316" stroke-width="2.5"/>';
        var label = ["Underfit (high bias)", "Good fit", "Overfit (high variance)"][k];
        return '<rect x="' + x0 + '" y="10" width="104" height="90" rx="8" fill="none" stroke="#9993"/>' + dots + curve +
          '<text x="' + (x0 + 52) + '" y="114" text-anchor="middle" font-size="10">' + label + "</text>";
      }).join("") + "</svg>",
    pipeline: '<svg viewBox="0 0 320 300" role="img" aria-label="Pipeline ML en boucle">' +
      ["1 Business goal", "2 Data collection", "3 Data prep & features", "4 Training", "5 Evaluation", "6 Deployment", "7 Monitoring"].map(function (t, i) {
        var y = 8 + i * 41;
        return '<rect x="40" y="' + y + '" width="210" height="30" rx="10" fill="#ff99001f" stroke="#ff9900"/>' +
          '<text x="145" y="' + (y + 20) + '" text-anchor="middle" font-size="13" font-weight="600">' + t + "</text>" +
          (i < 6 ? '<path d="M145 ' + (y + 30) + ' v10" stroke="#ff9900" stroke-width="2"/>' : "");
      }).join("") +
      '<path d="M250 269 h40 V 120 h-38" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="5 4"/>' +
      '<text x="296" y="200" font-size="11" text-anchor="middle" transform="rotate(-90 296 200)">Re-training</text></svg>',
    confusion: '<svg viewBox="0 0 300 190" role="img" aria-label="Matrice de confusion">' +
      '<text x="190" y="14" text-anchor="middle" font-size="12" font-weight="700">Prédit</text>' +
      '<text x="140" y="34" text-anchor="middle" font-size="11">Positif</text><text x="240" y="34" text-anchor="middle" font-size="11">Négatif</text>' +
      '<text x="14" y="115" font-size="12" font-weight="700" transform="rotate(-90 14 115)" text-anchor="middle">Réel</text>' +
      '<text x="58" y="85" text-anchor="middle" font-size="11">Positif</text><text x="58" y="150" text-anchor="middle" font-size="11">Négatif</text>' +
      '<rect x="92" y="42" width="96" height="64" rx="8" fill="#16a34a33" stroke="#16a34a"/><text x="140" y="80" text-anchor="middle" font-weight="700">TP</text>' +
      '<rect x="192" y="42" width="96" height="64" rx="8" fill="#ef444433" stroke="#ef4444"/><text x="240" y="72" text-anchor="middle" font-weight="700">FN</text><text x="240" y="90" text-anchor="middle" font-size="10">(raté)</text>' +
      '<rect x="92" y="110" width="96" height="64" rx="8" fill="#ef444433" stroke="#ef4444"/><text x="140" y="140" text-anchor="middle" font-weight="700">FP</text><text x="140" y="158" text-anchor="middle" font-size="10">(fausse alerte)</text>' +
      '<rect x="192" y="110" width="96" height="64" rx="8" fill="#16a34a33" stroke="#16a34a"/><text x="240" y="148" text-anchor="middle" font-weight="700">TN</text></svg>'
  };
  DIAGRAMS.embeddings = '<svg viewBox="0 0 320 200" role="img" aria-label="Espace des embeddings : les mots de sens proche sont proches">' +
    '<rect x="4" y="4" width="312" height="192" rx="12" fill="none" stroke="#9995"/>' +
    [["chat", 60, 60, "#16a34a"], ["félin", 92, 46, "#16a34a"], ["chaton", 78, 88, "#16a34a"], ["facture", 250, 150, "#ef4444"], ["paiement", 222, 172, "#ef4444"], ["voiture", 240, 50, "#06b6d4"], ["automobile", 205, 74, "#06b6d4"]].map(function (p) {
      return '<circle cx="' + p[1] + '" cy="' + p[2] + '" r="5" fill="' + p[3] + '"/><text x="' + (p[1] + 8) + '" y="' + (p[2] + 4) + '" font-size="12">' + p[0] + "</text>";
    }).join("") +
    '<text x="160" y="118" text-anchor="middle" font-size="11" opacity=".8">sens proche = vecteurs proches</text></svg>';
  DIAGRAMS.agentloop = '<svg viewBox="0 0 320 200" role="img" aria-label="Boucle d\'un agent : raisonner, agir, observer">' +
    '<circle cx="160" cy="100" r="62" fill="none" stroke="#ff9900" stroke-width="2" stroke-dasharray="6 5"/>' +
    [["🧠 Raisonner", 160, 30], ["🛠️ Agir (outil)", 250, 140], ["👀 Observer", 70, 140]].map(function (p) {
      return '<rect x="' + (p[1] - 58) + '" y="' + (p[2] - 16) + '" width="116" height="30" rx="10" fill="#ff990022" stroke="#ff9900"/><text x="' + p[1] + '" y="' + (p[2] + 4) + '" text-anchor="middle" font-size="12" font-weight="600">' + p[0] + "</text>";
    }).join("") +
    '<text x="160" y="96" text-anchor="middle" font-size="12" font-weight="700">Objectif</text><text x="160" y="112" text-anchor="middle" font-size="10">+ mémoire</text>' +
    '<text x="160" y="192" text-anchor="middle" font-size="10">Outils via API / MCP · jusqu\'à ce que la tâche soit accomplie</text></svg>';
  DIAGRAMS.rag = '<svg viewBox="0 0 320 230" role="img" aria-label="Pipeline RAG">' +
    '<text x="10" y="16" font-size="11" font-weight="700">Ingestion (une fois)</text>' +
    [["Documents", 10], ["Chunking", 88], ["Embeddings", 166], ["Base vectorielle", 244]].map(function (p, i) {
      return '<rect x="' + p[1] + '" y="24" width="72" height="30" rx="8" fill="#ff990022" stroke="#ff9900"/><text x="' + (p[1] + 36) + '" y="43" text-anchor="middle" font-size="9.5">' + p[0] + "</text>" + (i < 3 ? '<path d="M' + (p[1] + 72) + ' 39 h6" stroke="#ff9900" stroke-width="2"/>' : "");
    }).join("") +
    '<text x="10" y="86" font-size="11" font-weight="700">À chaque question</text>' +
    [["1 Question → embedding", 96], ["2 Récupérer les chunks proches", 128], ["3 Ajouter au prompt (augment)", 160], ["4 Le FM génère + cite", 192]].map(function (p) {
      return '<rect x="10" y="' + p[1] + '" width="300" height="26" rx="8" fill="#232f3e14" stroke="#232f3e88"/><text x="160" y="' + (p[1] + 17) + '" text-anchor="middle" font-size="11">' + p[0] + "</text>";
    }).join("") + "</svg>";
  DIAGRAMS.customcost = '<svg viewBox="0 0 320 170" role="img" aria-label="Coût croissant des approches de personnalisation">' +
    [["Prompt", 1], ["RAG", 2], ["Fine-tuning", 3], ["Cont. pre-train", 4], ["Pre-training", 5]].map(function (p, i) {
      var h = 18 + p[1] * 22, x = 12 + i * 61;
      return '<rect x="' + x + '" y="' + (140 - h) + '" width="50" height="' + h + '" rx="6" fill="#ff9900" opacity="' + (0.35 + i * 0.15) + '"/><text x="' + (x + 25) + '" y="156" text-anchor="middle" font-size="9">' + p[0] + "</text>";
    }).join("") + '<text x="12" y="14" font-size="10">Coût / effort / données nécessaires →</text></svg>';
  function registerDiagram(id, svg) { DIAGRAMS[id] = svg; }

  /* Rendu des blocs de cours (contenu de confiance écrit dans data/*.js) */
  function renderBlocks(blocks) {
    return blocks.map(function (b) {
      switch (b.type) {
        case "p": return "<p>" + b.text + "</p>";
        case "list": return (b.title ? "<p><b>" + b.title + "</b></p>" : "") + "<ul>" + b.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
        case "table": return '<div class="table-wrap"><table><thead><tr>' + b.head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
          b.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
        case "trap": return '<div class="box trap"><b>⚠️ Pièges à l\'examen</b><ul>' + b.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul></div>";
        case "tip": return '<div class="box tip"><b>💡 Astuce</b><br>' + b.text + "</div>";
        case "analogy": return '<div class="box analogy"><b>🧠 Analogie</b><br>' + b.text + "</div>";
        case "diagram": return '<div class="diagram">' + (DIAGRAMS[b.id] || "") + "</div>";
        default: return "";
      }
    }).join("");
  }

  /* ---------- Graphiques SVG ---------- */
  function radar(values, labels, size) {
    size = size || 260;
    var c = size / 2, r = c - 42, n = values.length, out = "";
    function pt(i, f) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + Math.cos(a) * r * f, c + Math.sin(a) * r * f]; }
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      out += '<polygon points="' + values.map(function (_, i) { return pt(i, f).join(","); }).join(" ") + '" fill="none" stroke="var(--line)"/>';
    });
    values.forEach(function (_, i) { var p = pt(i, 1); out += '<line x1="' + c + '" y1="' + c + '" x2="' + p[0] + '" y2="' + p[1] + '" stroke="var(--line)"/>'; });
    out += '<polygon points="' + values.map(function (v, i) { return pt(i, Math.max(0.03, v)).join(","); }).join(" ") + '" fill="color-mix(in srgb, var(--primary) 30%, transparent)" stroke="var(--primary)" stroke-width="2"/>';
    labels.forEach(function (l, i) { var p = pt(i, 1.2); out += '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle">' + esc(l) + "</text>"; });
    return '<svg class="radar" viewBox="0 0 ' + size + " " + size + '" role="img" aria-label="Radar des compétences">' + out + "</svg>";
  }
  function lineChart(points, opts) {
    opts = opts || {};
    var w = 320, h = 150, pad = 26;
    if (points.length < 2) return '<p class="muted small">Jouez au moins 2 parties pour voir la courbe.</p>';
    var max = opts.max || 100;
    var xs = function (i) { return pad + i * (w - pad - 8) / (points.length - 1); };
    var ys = function (v) { return h - pad + 6 - (v / max) * (h - pad - 4); };
    var line = points.map(function (v, i) { return xs(i).toFixed(1) + "," + ys(v).toFixed(1); }).join(" ");
    var ref = opts.ref != null ? '<line x1="' + pad + '" x2="' + (w - 8) + '" y1="' + ys(opts.ref) + '" y2="' + ys(opts.ref) + '" stroke="#16a34a" stroke-dasharray="4 4"/><text x="' + (w - 10) + '" y="' + (ys(opts.ref) - 4) + '" text-anchor="end">' + opts.ref + "</text>" : "";
    return '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Courbe de progression">' +
      '<line x1="' + pad + '" y1="' + (h - pad + 6) + '" x2="' + (w - 8) + '" y2="' + (h - pad + 6) + '" stroke="var(--line)"/>' +
      '<text x="4" y="' + (ys(max) + 4) + '">' + max + '</text><text x="4" y="' + (ys(0) + 4) + '">0</text>' + ref +
      '<polyline points="' + line + '" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round"/>' +
      points.map(function (v, i) { return '<circle cx="' + xs(i) + '" cy="' + ys(v) + '" r="3" fill="var(--primary)"/>'; }).join("") + "</svg>";
  }

  root.UI = { esc: esc, $: $, $all: $all, toast: toast, modal: modal, closeModal: closeModal, confirmBox: confirmBox,
    sfx: sfx, confetti: confetti, setSettingsGetter: setSettingsGetter, onSwipe: onSwipe,
    renderBlocks: renderBlocks, registerDiagram: registerDiagram, radar: radar, lineChart: lineChart };
})(window);

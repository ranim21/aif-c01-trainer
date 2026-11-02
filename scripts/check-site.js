#!/usr/bin/env node
/* Vérifie le site : syntaxe JS, aucune ressource externe, manifest, service worker, versions. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const errors = [], ok = [];
const rd = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const walk = (d) => fs.readdirSync(path.join(ROOT, d)).map((f) => d + "/" + f);

const jsFiles = ["sw.js"].concat(walk("js"), walk("data")).filter((f) => f.endsWith(".js"));
jsFiles.forEach((f) => { try { new vm.Script(rd(f), { filename: f }); } catch (e) { errors.push(`Syntaxe JS ${f} : ${e.message}`); } });
ok.push(`${jsFiles.length} fichiers JS : syntaxe OK`);

const web = ["index.html", "css/app.css", "manifest.json"].concat(jsFiles);
web.forEach((f) => {
  const s = rd(f);
  const m = s.match(/(src|href)\s*=\s*["']\s*(https?:)?\/\/[^"']+/gi) || [];
  const urls = s.match(/https?:\/\/[^\s"'`)<]+/gi) || [];
  if (m.length) errors.push(`${f} : ressource externe ${m.join(", ")}`);
  if (/@import|url\(\s*["']?https?:/i.test(s)) errors.push(`${f} : import CSS externe`);
  if (/\bfetch\(\s*["']https?:/i.test(s)) errors.push(`${f} : appel réseau externe`);
  if (urls.length && f !== "index.html") errors.push(`${f} : URL externe ${urls.join(", ")}`);
});
ok.push("Aucune ressource externe");

let man;
try { man = JSON.parse(rd("manifest.json")); } catch (e) { errors.push("manifest.json invalide : " + e.message); }
if (man) {
  ["name", "short_name", "start_url", "display", "icons", "theme_color", "background_color"].forEach((k) => { if (!man[k]) errors.push("manifest : champ manquant " + k); });
  ["192x192", "512x512"].forEach((sz) => { if (!man.icons.some((i) => i.sizes === sz)) errors.push("manifest : icône " + sz + " manquante"); });
  man.icons.forEach((i) => { if (!fs.existsSync(path.join(ROOT, i.src))) errors.push("manifest : fichier introuvable " + i.src); });
  ok.push("manifest.json valide");
}

const sw = rd("sw.js");
const ver = (sw.match(/CACHE_VERSION\s*=\s*"aif-quest-v([\d.]+)"/) || [])[1];
const appVer = (rd("js/app.js").match(/VERSION\s*=\s*"([\d.]+)"/) || [])[1];
if (!ver || ver !== appVer) errors.push(`Versions désynchronisées : sw.js=${ver} app.js=${appVer}`);
const assets = JSON.parse((sw.match(/ASSETS\s*=\s*(\[[\s\S]*?\]);/) || [])[1] || "[]");
assets.filter((a) => a !== "./").forEach((a) => { if (!fs.existsSync(path.join(ROOT, a))) errors.push("sw.js : fichier pré-caché introuvable " + a); });
const needed = ["index.html", "manifest.json", "css/app.css"].concat(walk("js"), walk("data"), walk("icons")).filter((f) => /\.(js|css|html|json|png|svg)$/.test(f));
needed.forEach((f) => { if (!assets.includes(f)) errors.push("sw.js : fichier non pré-caché (hors ligne KO) " + f); });
const html = rd("index.html");
walk("data").concat(walk("js")).forEach((f) => { if (f.endsWith(".js") && !html.includes(`src="${f}"`)) errors.push("index.html : script non chargé " + f); });
if (!/viewport-fit=cover/.test(html)) errors.push("index.html : viewport-fit=cover manquant");
ok.push(`Service worker : version ${ver}, ${assets.length} fichiers pré-cachés`);

console.log(ok.map((x) => "✓ " + x).join("\n"));
if (errors.length) { console.log("\n❌ " + errors.join("\n❌ ")); process.exit(1); }
console.log("\n✅ Site OK");

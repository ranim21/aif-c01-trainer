#!/usr/bin/env node
/* Génère icons/icon-192.png, icons/icon-512.png et icons/icon.svg sans dépendance (zlib natif).
   Motif : dégradé violet, chemin de 3 étapes (la carte du jeu) et une étoile dorée. */
"use strict";
const fs = require("fs"), path = require("path"), zlib = require("zlib");
const OUT = path.join(__dirname, "..", "icons");
fs.mkdirSync(OUT, { recursive: true });

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, pixel) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixel(x, y, size);
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = r; raw[o + 1] = g; raw[o + 2] = b; raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
// Géométrie en coordonnées normalisées 0..1
const NODES = [[0.30, 0.72], [0.52, 0.50], [0.72, 0.30]];
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function star(px, py, cx, cy, R) { // distance approx. à une étoile à 5 branches
  const a = Math.atan2(py - cy, px - cx) + Math.PI / 2, d = Math.hypot(px - cx, py - cy);
  const k = Math.cos((a % (2 * Math.PI / 5) + 2 * Math.PI / 5) % (2 * Math.PI / 5) - Math.PI / 5);
  const r = R * (0.5 + 0.5 * Math.pow(Math.abs(k), 6));
  return d - r;
}
function mix(c1, c2, t) { return c1.map((v, i) => Math.round(v + (c2[i] - v) * t)); }
function pixel(x, y, size) {
  const u = (x + 0.5) / size, v = (y + 0.5) / size, aa = 1.2 / size;
  let col = mix([35, 47, 62], [22, 30, 40], (u + v) / 2);       // fond dégradé (plein cadre : compatible maskable)
  const cover = (d) => Math.max(0, Math.min(1, 0.5 - d / aa));
  let lineD = Infinity;
  for (let i = 0; i < NODES.length - 1; i++) lineD = Math.min(lineD, segDist(u, v, NODES[i][0], NODES[i][1], NODES[i + 1][0], NODES[i + 1][1]));
  col = mix(col, [255, 255, 255], cover(lineD - 0.028) * 0.85);
  NODES.forEach(([cx, cy], i) => {
    const d = Math.hypot(u - cx, v - cy) - (i === 2 ? 0.095 : 0.075);
    col = mix(col, [255, 255, 255], cover(d));
    if (i < 2) col = mix(col, [255, 153, 0], cover(Math.hypot(u - cx, v - cy) - 0.042));
  });
  col = mix(col, [255, 153, 0], cover(star(u, v, 0.72, 0.30, 0.075)));
  return [col[0], col[1], col[2], 255];
}
[192, 512].forEach((s) => fs.writeFileSync(path.join(OUT, `icon-${s}.png`), png(s, pixel)));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#232f3e"/><stop offset="1" stop-color="#161e28"/></linearGradient></defs>
<rect width="100" height="100" rx="22" fill="url(#g)"/>
<polyline points="30,72 52,50 72,30" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="5.6" stroke-linecap="round"/>
<circle cx="30" cy="72" r="7.5" fill="#fff"/><circle cx="30" cy="72" r="4.2" fill="#ff9900"/>
<circle cx="52" cy="50" r="7.5" fill="#fff"/><circle cx="52" cy="50" r="4.2" fill="#ff9900"/>
<circle cx="72" cy="30" r="9.5" fill="#fff"/>
<polygon fill="#ff9900" points="72,22.5 74.2,27.3 79.3,27.6 75.4,30.9 76.6,35.9 72,33.2 67.4,35.9 68.6,30.9 64.7,27.6 69.8,27.3"/>
</svg>
`;
fs.writeFileSync(path.join(OUT, "icon.svg"), svg);
console.log("Icônes générées dans", OUT);

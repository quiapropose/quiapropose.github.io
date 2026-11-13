// Vérifications avant publication : node check.js
var fs = require("fs"), path = require("path"), d = __dirname, ok = true;
function bad(m) { console.log("✗ " + m); ok = false; }
var src = fs.readFileSync(path.join(d, "data.js"), "utf8");
try { new Function(fs.readFileSync(path.join(d, "app.js"), "utf8")); } catch (e) { bad("app.js : erreur de syntaxe : " + e.message); }
var G = {};
try { new Function("G", src + "\n;G.C=C;G.S=S;G.RAW=RAW;G.SHARED=SHARED;G.POLLS=POLLS;G.NEWS=NEWS;G.FAMILY=FAMILY;")(G); } catch (e) { bad("data.js : " + e.message); console.log("ÉCHEC"); process.exit(1); }
var ids = {}; G.C.forEach(function (c) { ids[c.id] = 1; if (!G.FAMILY[c.id]) bad("FAMILY manquante pour " + c.id); });
var seen = {};
G.RAW.forEach(function (r, i) {
  if (!ids[r[0]]) bad("RAW[" + i + "] candidat inconnu : " + r[0]);
  if (!G.S[r[3]]) bad("RAW[" + i + "] source inconnue : " + r[3]);
  var k = r[0] + "|" + r[2].toLowerCase().replace(/\s+/g, " ").trim();
  if (seen[k]) bad("doublon : " + r[2]); seen[k] = 1;
  if (r[2].length > 240) bad("mesure trop longue (" + r[2].length + " car.) : " + r[2].slice(0, 60));
});
G.SHARED.forEach(function (r, i) {
  r[0].forEach(function (w) { if (!ids[w]) bad("SHARED[" + i + "] candidat inconnu : " + w); if (!G.S[r[3][w]]) bad("SHARED[" + i + "] source inconnue pour " + w); });
});
Object.keys(G.S).forEach(function (k) { var u = G.S[k].u; if (u && !/^https:\/\//.test(u)) bad("source " + k + " : URL non https"); });
G.POLLS.forEach(function (p) {
  ["inst", "pour", "terrain", "n", "marge", "methode", "u"].forEach(function (f) { if (!p[f]) bad("sondage " + p.inst + " : champ " + f + " manquant (loi de 1977)"); });
  p.hyps.forEach(function (h) { var t = h.r.reduce(function (a, x) { return a + x[1]; }, 0); if (Math.abs(t - 100) > 1.01) bad("sondage " + p.inst + " / " + h.nom + " : total " + t + " %"); });
});
if (G.NEWS.length > 14) bad("NEWS : " + G.NEWS.length + " éléments, garder 14 au maximum");
G.NEWS.forEach(function (n, i) {
  ["d", "k", "t", "s", "u"].forEach(function (f) { if (!n[f]) bad("NEWS[" + i + "] champ " + f + " manquant"); });
  if (["declare", "programme", "mesure", "agenda", "insolite", "debat"].indexOf(n.k) < 0) bad("NEWS[" + i + "] type inconnu : " + n.k);
  if (n.u && !/^https:\/\//.test(n.u)) bad("NEWS[" + i + "] URL non https");
  if (n.t && n.t.length > 160) bad("NEWS[" + i + "] texte trop long");
});
console.log(ok ? "OK : " + G.C.length + " candidats, " + (G.RAW.length + G.SHARED.length) + " mesures, " + G.POLLS.length + " sondages, " + G.NEWS.length + " infos" : "ÉCHEC");
process.exit(ok ? 0 : 1);

(function () {
"use strict";

/* ---------- Préparation ---------- */
C.forEach(function (c, i) { c.n = i + 1; });
var CBY = {}; C.forEach(function (c) { CBY[c.id] = c; });
var M = RAW.map(function (r, i) { var o = {}; o[r[0]] = S[r[3]]; return { id: i, c: r[0], cs: [r[0]], t: r[1], m: r[2], srcs: o }; });
SHARED.forEach(function (r) {
  var o = {}; r[0].forEach(function (c) { o[c] = S[r[3][c]]; });
  M.push({ id: M.length, c: r[0][0], cs: r[0].slice(), t: r[1], m: r[2], srcs: o, shared: true, fou: !!r[4] });
});
var NPROG = M.length;
CASES.forEach(function (r) {
  var o = {}; o[r[0]] = r[5];
  M.push({ id: M.length, c: r[0], cs: [r[0]], t: CASE_KIND[r[1]], kind: r[1], year: r[2], m: r[3], status: r[4], srcs: o, kase: true });
});
QUOTES.forEach(function (r) {
  var o = {}; o[r[0]] = r[4];
  M.push({ id: M.length, c: r[0], cs: [r[0]], t: "Citation", m: r[1], pre: r[2], ctx: r[3], srcs: o, quote: true });
});
IMPOSS.forEach(function (r) {
  var o = {}; r[0].forEach(function (c) { o[c] = r[4]; });
  M.push({ id: M.length, c: r[0][0], cs: r[0].slice(), t: "Mission impossible ?", m: r[1], verdict: r[2], obstacle: r[3], srcs: o, imp: true });
});
var KASES = M.filter(function (x) { return x.kase; });
var IMPM = M.filter(function (x) { return x.imp; });
var QUOTEM = M.filter(function (x) { return x.quote; });
function special(x) { return x.kase || x.quote || x.imp; }
var SINGLE = M.filter(function (x) { return !x.shared && !special(x); });
var SH = M.filter(function (x) { return x.shared && !special(x); });
var THEMES = Array.from(new Set(M.filter(function (x) { return !special(x); }).map(function (x) { return x.t; }))).sort(function (a, b) { return a.localeCompare(b, "fr"); });
var MAIN = C.filter(function (c) { return c.main; }).map(function (c) { return c.id; });
var ALL = C.map(function (c) { return c.id; });
var DUELS = [["lepen","melenchon"],["philippe","attal"],["glucksmann","melenchon"],["retailleau","zemmour"],["tondelier","ruffin"],["arthaud","kazib"],["philippot","asselineau"],["lisnard","retailleau"]];

/* ---------- Humour : il vise le joueur, jamais les candidats ---------- */
var STAMP_OK = ["Adopté", "Bien vu", "Validé", "Élu", "Majorité absolue", "Plébiscité"];
var STAMP_KO = ["Vote nul", "Raté", "Rejeté", "Recalé", "Ballottage", "Censuré"];
var QUIP_OK = [
  "Vous avez lu le programme. Vous êtes peut-être la seule personne en France.",
  "Exact. Mettez-le sur votre CV, rubrique « centres d’intérêt ».",
  "Juste. Le repas de famille de Noël n’a qu’à bien se tenir.",
  "Bien vu. Même l’équipe de campagne a dû vérifier.",
  "C’est ça. Vous pouvez postuler comme fact-checker.",
  "Bonne réponse, et sans antisèche. On suppose.",
  "Parfait. Votre bulletin est déjà rempli, et il est juste.",
  "Gagné. Les éditorialistes vont devoir se méfier.",
  "Exact. Vous avez un abonnement aux tracts ou quoi ?",
  "Bravo. Votre prof d’éducation civique verse une larme.",
  "Juste. Le Conseil constitutionnel valide votre réponse.",
  "Bien joué. Un sondeur vous aurait donné 3 % de chances, et il aurait eu tort.",
  "Oui. Vous connaissez ce programme mieux que le candidat ne connaît le prix d’une baguette.",
  "C’est bon. Vous pouvez désormais couper la parole en débat télévisé.",
  "Exact. Votre groupe WhatsApp familial ne vous mérite pas.",
  "Réponse validée par 100 % des suffrages exprimés (le vôtre).",
  "Bingo. Vous lisez les annexes, vous ?",
  "Exact. On vous verrait bien en régie d’une soirée électorale.",
  "Juste. Votre oncle qui sait tout vient de perdre son titre.",
  "Bonne pioche. Vous pourriez réciter ça à un meeting sans prompteur.",
  "Juste. Quelqu’un ici a écouté la matinale jusqu’au bout."
];
var QUIP_KO = [
  "Raté. Promis, on ne le dira à personne au bureau de vote.",
  "Non. C’était un piège, et vous avez sauté dedans à pieds joints.",
  "Perdu. On mettra ça sur le compte de la fatigue électorale.",
  "Pas du tout. Retour à la case « 20 heures ».",
  "Faux. Mais l’abstention n’était pas une option.",
  "Raté. Certains programmes font 1 000 mesures, ça excuse un peu.",
  "Non. Votre intuition vient de voter blanc.",
  "Perdu. Heureusement, il reste quelques mois avant le premier tour.",
  "Raté. Vous avez répondu avec le cœur. Le cœur ne lit pas les programmes.",
  "Non. Mais c’était une très belle réponse de comptoir.",
  "Faux. Vous venez d’inventer une alliance qui n’existe pas.",
  "Perdu. Rassurez-vous, même certains députés se tromperaient.",
  "Raté. Votre réponse part en commission, puis aux oubliettes.",
  "Non. On sent que vous avez survolé les tracts dans la boîte aux lettres.",
  "Faux. Un 49.3 sur votre réponse aurait été plus convaincant.",
  "Raté. C’est ce qu’on appelle un sondage sorti des urnes.",
  "Perdu. Vous êtes officiellement un électeur indécis.",
  "Non. Mais vous avez le droit de faire un recours.",
  "Raté. Vous venez d’inventer une motion de synthèse.",
  "Faux. Même le tirage au sort aurait hésité.",
  "Perdu. Un éléphant du parti vient de lever un sourcil."
];
var QUIP_PARTIAL = [
  "Presque. Une coalition incomplète, comme souvent.",
  "Pas loin. Il vous manque des alliés, ou vous en avez trop.",
  "À moitié juste. Un compromis, quoi."
];
var QUIP_FOU = [
  "Notez la date : ils sont d’accord.",
  "Ne le répétez surtout pas à leurs militants.",
  "Ils ne dîneront pas ensemble, mais sur ce point ils voteraient pareil.",
  "Un consensus. Quelqu’un peut vérifier que tout va bien ?",
  "La preuve qu’on peut s’entendre. Au moins sur une ligne de programme.",
  "Cette mesure ne sera jamais citée dans leurs débats. Elle est trop consensuelle.",
  "Ils l’ont écrit chacun de leur côté. Personne n’a copié. On pense."
];
var STREAK_TOAST = { 3: "Série de 3 : ça sent le militant", 5: "Série de 5 : programmes sous l’oreiller ?", 8: "Série de 8 : porte-parole en vue", 12: "Série de 12 : ministre de la Mémoire", 16: "Série de 16 : vous êtes l’annexe du programme", 20: "Série de 20 : c’est vous qui les écrivez ?" };
var FAIL_TOAST = { 3: "3 ratés d’affilée : on rouvre les bureaux de vote ?", 5: "5 ratés : vous jouez les yeux fermés ?", 8: "8 ratés : la défaite est digne, au moins" };
var QUIP_CASE_OK = [
  "Exact. Vous lisez la rubrique justice jusqu’au bout, vous.",
  "Bonne réponse. Votre mémoire mériterait un greffier.",
  "Juste. Vous suivez l’actualité judiciaire mieux qu’un chroniqueur du palais.",
  "Bien vu. Vous avez visiblement gardé les coupures de presse.",
  "Exact. On vous imagine au premier rang des audiences publiques."
];
var QUIP_CASE_KO = [
  "Raté. Jugement hâtif : relisez le dossier avant de trancher.",
  "Non. Mauvais dossier : le greffe vous renvoie votre copie.",
  "Perdu. Heureusement, ici, l’erreur judiciaire ne coûte que des points.",
  "Raté. Vous avez confondu les dossiers, ça arrive aussi aux greffes.",
  "Non. La présomption d’innocence s’applique aussi à vos réponses."
];
var QUIP_QUOTE_OK = [
  "Exact. Vous avez visiblement écouté le meeting jusqu’au bout.",
  "Bien vu. On vous soupçonne de lire les dépêches AFP au petit-déjeuner.",
  "Juste. Vous reconnaîtriez cette voix les yeux fermés.",
  "Bonne réponse. La petite phrase n’a pas de secret pour vous.",
  "Exact. Le service communication du candidat vous remercie."
];
var QUIP_QUOTE_KO = [
  "Raté. Les petites phrases se ressemblent parfois, c’est le principe.",
  "Non. Vous venez de prêter une phrase à quelqu’un qui ne l’a jamais dite. Classique.",
  "Perdu. Heureusement, il n’y a pas de droit de réponse dans ce quiz.",
  "Raté. Un conseiller en communication quelque part soupire.",
  "Non. Sortie de son contexte, une phrase va avec tout le monde."
];
var QUIP_IMP = [
  "Une Constitution, ça se révise. Mais il faut l’Assemblée, le Sénat, et parfois le peuple.",
  "Neuf Sages à convaincre. Ou une révision à faire voter. Bon courage.",
  "Promettre, c’est gratuit. Passer le Conseil constitutionnel, beaucoup moins.",
  "La rue de Montpensier a l’oreille fine, même en campagne.",
  "Moralité : un programme se relit aussi avec un juriste."
];
var CD_QUIPS = [
  "Largement le temps de lire tous les programmes. En théorie.",
  "Il reste des débats, des sondages et au moins trois « petites phrases » par semaine.",
  "Assez de temps pour changer d’avis plusieurs fois. Vous ne seriez pas le seul.",
  "D’ici là, entraînez-vous : le bureau de vote ne donne pas d’indice.",
  "Le compte à rebours tourne. Les programmes, eux, s’allongent."
];
var GO_LABELS = ["Lancer la partie", "Aux urnes, citoyens", "Ouvrir le bureau de vote", "À voté (bientôt)", "Que le meilleur programme gagne"];
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

/* ---------- Utilitaires ---------- */
function $(id) { return document.getElementById(id); }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]; }); }
function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }
function plural(n, one, many) { return n + " " + (n > 1 ? many : one); }
function fmt(n) { return n.toLocaleString("fr-FR"); }
/* ---------- Réglages de diffusion ---------- */
var CONTACT_EMAIL = "contact@quiapropose.fr";
var FORM_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;
function siteUrl() { return location.href.split("#")[0].split("?")[0]; }
function reportLink(m) {
  return "<button type=\"button\" class=\"linkbtn report\" data-report=\"" + m.id + "\">Signaler une erreur</button>";
}
function store(k, v) { try { if (v === undefined) { var x = localStorage.getItem(k); return x ? JSON.parse(x) : null; } localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
function last(name) { return name.split(" ").slice(1).join(" "); }
function names(ids) { var n = ids.map(function (id) { return CBY[id].name; }); return n.length < 2 ? n.join("") : n.slice(0, -1).join(", ") + " et " + n[n.length - 1]; }
function srcHtml(m) {
  var keys = m.cs;
  if (keys.length === 1) { var s = m.srcs[keys[0]]; return "Source : <a href=\"" + esc(s.u) + "\" target=\"_blank\" rel=\"noopener\">" + esc(s.s) + " ↗</a> · " + esc(s.d); }
  return "Sources : " + keys.map(function (k) { var s = m.srcs[k]; return esc(last(CBY[k].name)) + " (<a href=\"" + esc(s.u) + "\" target=\"_blank\" rel=\"noopener\">" + esc(s.s) + " ↗</a>)"; }).join(" ; ");
}
function boardHtml(c, tag, extra, key) {
  tag = tag || "div";
  return "<" + tag + (tag === "button" ? " type=\"button\"" : "") + " class=\"board\" style=\"--fam:" + (FAMCOL[FAMILY[c.id]] || "transparent") + "\" " + (extra || "") + ">" +
    "<span class=\"num\">" + c.n + "</span>" + (key ? "<span class=\"key\">" + key + "</span>" : "") +
    "<span class=\"ini\">" + esc(c.ini) + "</span><span class=\"nm\">" + esc(c.name) + "</span><span class=\"pt\">" + esc(c.party) + "</span></" + tag + ">";
}
var SOON = {
  lepen: "Programme 2027 à l’impression. En attendant, on a ressorti celui de 2022.",
  zemmour: "On fait avec le programme des européennes. Le reste est encore dans les cartons.",
  roussel: "Les « jours heureux » de 2022 servent de bande-annonce.",
  polony: "Une « vision » en ligne, un programme encore en cuisson. Repassez après le dessert.",
  arthaud: "Un dépliant pour l’instant. La suite au prochain tract.",
  riner: "Quelques pistes données au Parisien. Le programme complet est encore au vestiaire."
};
// Candidats déclarés sans programme recensé : affichés sur l'accueil seulement, pas encore jouables.
var NOPROG = [
  { name: "Jean Lassalle", ini: "JL", party: "Résistons", q: "Programme en route, à pied, quelque part entre les Pyrénées et Paris." },
  { name: "Karim Bouamrane", ini: "KB", party: "Maire de Saint-Ouen", q: "Candidature déclarée. Programme pas encore déclaré." },
  { name: "Olivier Becht", ini: "OB", party: "« Extrême centre »", q: "Le « Projet France » est annoncé. On le cherche encore, quelque part au centre." },
  { name: "Gilles Platret", ini: "GP", party: "Ex-LR", q: "Programme en préparation. On lui garde une place au chaud." },
  { name: "Francis Lalanne", ini: "FLa", party: "Sans étiquette", q: "Programme pas encore sorti. Le single non plus." },
  { name: "Selma Labib", ini: "SL", party: "NPA-Révolutionnaires", q: "Programme en débat interne. Prévoir du café." },
  { name: "Clara Egger", ini: "CE", party: "Solution démocratique", q: "Le programme sera peut-être soumis au vote. On attend le résultat." },
  { name: "Mira Markovic", ini: "MM", party: "Parti animaliste", q: "Programme bientôt. Les animaux de compagnie patientent aussi." },
  { name: "Antoine Mikolajczak", ini: "AM", party: "Équinoxe", q: "Programme partiel. Le reste est attendu pour l’équinoxe de printemps." },
  { name: "Sylvain Durif", ini: "SD", party: "Sans étiquette", q: "Programme en attente de transmission cosmique." },
  { name: "Manolo Mlekuz", ini: "MMl", party: "Trajectoire", q: "La trajectoire est annoncée. La destination, pas encore." },
  { name: "Jean-François Legendre", ini: "JFL", party: "À nous maintenant", q: "Le programme ? « À nous maintenant »… mais pas tout de suite." },
  { name: "Benoît Mathieu", ini: "BM", party: "Sans étiquette", q: "Ingénieur : le programme est encore au stade du prototype." },
  { name: "Joël Chevé", ini: "JC", party: "La France adulte", q: "Programme attendu. Il paraît qu’il faut être adulte pour patienter." },
  { name: "Erwan Rohou", ini: "ER", party: "Mouvement écologiste indépendant", q: "Programme en germination. Arrosage prévu au printemps." },
  { name: "Augustin Billetdoux", ini: "AB", party: "Sans étiquette", q: "Le programme arrivera peut-être par billet doux." },
  { name: "Christian Collovati", ini: "CC", party: "Sans étiquette", q: "Candidature annoncée. Programme pas encore en rayon." }
];
function countAll(id) { return M.filter(function (x) { return !special(x) && x.cs.indexOf(id) >= 0; }).length; }
function countOf(id) { return SINGLE.filter(function (x) { return x.c === id; }).length; }

/* ---------- État ---------- */
var cfg = { mode: "classic", pool: "main", diff: "easy", len: "20", duel: ["lepen", "melenchon"], targets: [] };
var game = null, timerId = null, autoId = null;
var views = { setup: $("v-setup"), game: $("v-game"), res: $("v-res"), explorer: $("v-explorer"), cheat: $("v-cheat"), stats: $("v-stats"), contact: $("v-contact"), polls: $("v-polls") };
function show(v) {
  Object.keys(views).forEach(function (k) { views[k].hidden = (k !== v); });
  document.body.classList.toggle("playing", v === "game");
  $("tab-jouer").setAttribute("aria-pressed", v === "setup");
  $("tab-explorer").setAttribute("aria-pressed", v === "explorer");
  $("tab-cheat").setAttribute("aria-pressed", v === "cheat");
  $("tab-stats").setAttribute("aria-pressed", v === "stats");
  $("tab-polls").setAttribute("aria-pressed", v === "polls");
}
document.querySelectorAll("nav.tabs button").forEach(function (b) {
  b.addEventListener("click", function () {
    if (b.dataset.view === "explorer") { location.hash = "explorer"; show("explorer"); renderExplorer(); }
    else if (b.dataset.view === "polls") { clearInterval(timerId); clearTimeout(autoId); game = null; location.hash = "sondages"; show("polls"); renderPolls(); window.scrollTo({ top: 0 }); }
    else if (b.dataset.view === "stats") { clearInterval(timerId); clearTimeout(autoId); game = null; location.hash = "stats"; show("stats"); renderStats(); window.scrollTo({ top: 0 }); }
    else if (b.dataset.view === "cheat") { clearInterval(timerId); clearTimeout(autoId); game = null; location.hash = "antiseches"; show("cheat"); renderCheat(); window.scrollTo({ top: 0 }); }
    else goMenu();
  });
});
function goMenu() {
  clearInterval(timerId); clearTimeout(autoId); hideReact();
  game = null;
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  show("setup"); syncSetup(); renderDaily();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$("home-title").addEventListener("click", goMenu);
$("g-menu").addEventListener("click", goMenu);

/* ---------- Accueil ---------- */
var MODE_ICON = { classic: "🗳️", duel: "🥊", blitz: "⚡", target: "🎯", multi: "🧩", accord: "🤝", citations: "🎤", conseil: "⚖️", casier: "🗂️" };
var FAM_ORDER = ["Extrême gauche", "Gauche radicale", "Gauche (communiste)", "Gauche", "Gauche sociale-démocrate", "Écologistes", "Sans étiquette", "Centre (camp présidentiel)", "Centre droit", "Droite", "Droite souverainiste", "Souverainistes", "Souverainistes (Frexit)", "Extrême droite"];
function renderHemi() {
  var list = C.slice().sort(function (a, b) { return FAM_ORDER.indexOf(FAMILY[a.id]) - FAM_ORDER.indexOf(FAMILY[b.id]) || a.n - b.n; });
  var cx = 210, cy = 200, n = list.length, out = [];
  out.push("<path d=\"M 30 200 A 180 180 0 0 1 390 200\" fill=\"none\" stroke=\"var(--line)\" stroke-width=\"1.5\" stroke-dasharray=\"3 5\"/>");
  out.push("<text class=\"lr\" x=\"18\" y=\"222\">Gauche</text><text class=\"lr\" x=\"402\" y=\"222\" text-anchor=\"end\">Droite</text>");
  list.forEach(function (c, i) {
    var ang = Math.PI - (i + 0.5) / n * Math.PI, r = i % 2 ? 128 : 170;
    var x = cx + r * Math.cos(ang), y = cy - r * Math.sin(ang), col = FAMCOL[FAMILY[c.id]] || "#888";
    out.push("<g class=\"seat\" tabindex=\"0\" role=\"button\" data-c=\"" + c.id + "\" aria-label=\"" + esc(c.name + ", " + FAMILY[c.id]) + "\"><circle cx=\"" + x.toFixed(1) + "\" cy=\"" + y.toFixed(1) + "\" r=\"17\" fill=\"" + col + "\" stroke=\"var(--sheet)\" stroke-width=\"2.5\"/><text x=\"" + x.toFixed(1) + "\" y=\"" + (y + 4).toFixed(1) + "\" text-anchor=\"middle\">" + esc(c.ini) + "</text><title>" + esc(c.name + " · " + FAMILY[c.id]) + "</title></g>");
  });
  out.push("<text class=\"cap\" id=\"hemi-cap\" x=\"210\" y=\"178\" text-anchor=\"middle\">Survole un siège</text><text class=\"cap2\" id=\"hemi-cap2\" x=\"210\" y=\"196\" text-anchor=\"middle\">" + plural(n, "candidat jouable", "candidats jouables") + "</text>");
  $("hemi").innerHTML = out.join("");
}
$("hemi").addEventListener("mouseover", function (e) { var g = e.target.closest(".seat"); if (!g) return; var c = CBY[g.dataset.c]; $("hemi-cap").textContent = c.name; $("hemi-cap2").textContent = FAMILY[c.id] + " · " + plural(countAll(c.id), "mesure", "mesures"); });
$("hemi").addEventListener("focusin", function (e) { var g = e.target.closest(".seat"); if (!g) return; var c = CBY[g.dataset.c]; $("hemi-cap").textContent = c.name; $("hemi-cap2").textContent = FAMILY[c.id] + " · " + plural(countAll(c.id), "mesure", "mesures"); });
$("g-info").addEventListener("click", function () { var open = $("g-infobox").hidden; $("g-infobox").hidden = !open; this.setAttribute("aria-expanded", open ? "true" : "false"); });
function hemiGo(e) { var g = e.target.closest(".seat"); if (!g) return; cfg.mode = "target"; cfg.targets = [g.dataset.c]; startGame(buildQuestions(cfg), cfg); }
$("hemi").addEventListener("click", hemiGo);
$("hemi").addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hemiGo(e); } });
function renderHome() {
  renderHemi();
  MODES.forEach(function (m) { var b = $("m-" + m); if (b && MODE_ICON[m] && !b.querySelector(".ico")) b.querySelector("b").insertAdjacentHTML("afterbegin", "<i class=\"ico\" aria-hidden=\"true\">" + MODE_ICON[m] + "</i>"); });
  countUp($("f-mes"), NPROG, 900);
  $("f-cand").textContent = C.length;
  $("f-th").textContent = THEMES.length;
  var full = C.filter(function (c) { return !SOON[c.id]; }), part = C.filter(function (c) { return SOON[c.id]; });
  $("boards-home").innerHTML = full.map(function (c) { return boardHtml(c); }).join("") +
    part.map(function (c) {
      return boardHtml(c).replace("class=\"board\"", "class=\"board soon-b\" title=\"" + esc(SOON[c.id]) + "\"").replace("<span class=\"num\">", "<span class=\"soon\">À venir</span><span class=\"num\">").replace(/<\/div>$/, "<span class=\"soonq\">" + esc(SOON[c.id]) + "</span></div>");
    }).join("") +
    NOPROG.map(function (x) {
      return "<div class=\"board soon-b noprog\" title=\"" + esc(x.q) + "\"><span class=\"soon\">À venir</span><span class=\"num\">?</span><span class=\"ini\">" + esc(x.ini) + "</span><span class=\"nm\">" + esc(x.name) + "</span><span class=\"pt\">" + esc(x.party) + "</span><span class=\"soonq\">" + esc(x.q) + "</span></div>";
    }).join("");
  stagger($("boards-home"));
  $("more-n").textContent = C.length + NOPROG.length; $("more-s").textContent = "dont " + (part.length + NOPROG.length) + " « à venir »";
  $("cand-pick").innerHTML = C.map(function (c) {
    return "<button type=\"button\" id=\"pick-" + c.id + "\" data-c=\"" + c.id + "\" aria-pressed=\"false\"><span class=\"n\">" + c.n + "</span><span>" + esc(c.name) + "</span></button>";
  }).join("");
  var opts = C.map(function (c) { return "<option value=\"" + c.id + "\">" + c.n + ". " + esc(c.name) + " (" + countOf(c.id) + ")</option>"; }).join("");
  $("duel-a").innerHTML = opts; $("duel-b").innerHTML = opts;
  $("duel-chips").innerHTML = DUELS.map(function (d, i) { return "<button type=\"button\" data-i=\"" + i + "\">" + esc(last(CBY[d[0]].name)) + " / " + esc(last(CBY[d[1]].name)) + "</button>"; }).join("");
  syncSetup();
  teaserNext();
  renderDaily(); renderMiniPoll();
}

// ---- Splash d’ouverture : « Au début, ils étaient 29… » ----
function runIntro() {
  var seen = false;
  try { seen = sessionStorage.getItem("intro27") === "1"; sessionStorage.setItem("intro27", "1"); } catch (e) {}
  if (seen || navigator.webdriver) return;
  var all = C.map(function (c) { return { ini: c.ini, col: FAMCOL[FAMILY[c.id]] || "#888" }; }).concat(NOPROG.map(function (x) { return { ini: x.ini, col: "#9aa3b5" }; }));
  var N = all.length, ov = document.createElement("div");
  ov.id = "intro"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Introduction");
  ov.innerHTML = "<button type=\"button\" class=\"skip\">Passer ✕</button><div class=\"ibox\">" +
    "<p class=\"it1\">Au début, ils étaient</p><p class=\"inum\" id=\"i-n\">" + N + "</p>" +
    "<div class=\"itok\" id=\"i-tok\">" + all.map(function (t, k) { return "<span style=\"--c:" + t.col + ";--d:" + (k * 28) + "ms\">" + esc(t.ini) + "</span>"; }).join("") + "</div>" +
    "<p class=\"istep\" id=\"i-step\">&nbsp;</p>" +
    "<p class=\"it2\" id=\"i-t2\">À la fin, il n’en restera qu’<em>un</em>.</p>" +
    "<p class=\"it3\" id=\"i-t3\">" + esc(pick(["Conseil de la tribu le 18 avril. Finale le 2 mai.", "Totem d’immunité non fourni. Programmes, presque tous.", "Toi, tu peux déjà t’entraîner. Eux aussi, d’ailleurs.", "Aucun candidat n’a été mangé pendant ce générique."])) + "</p></div>";
  document.body.appendChild(ov);
  var timers = [], done = false;
  function close() { if (done) return; done = true; timers.forEach(clearTimeout); ov.classList.add("out"); setTimeout(function () { ov.remove(); }, 450); document.removeEventListener("keydown", close); }
  ov.addEventListener("click", close); document.addEventListener("keydown", close);
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { $("i-n").textContent = "1"; ov.classList.add("end"); timers.push(setTimeout(close, 2600)); return; }
  var toks = [].slice.call(ov.querySelectorAll(".itok span")), keep = Math.floor(Math.random() * N);
  var order = toks.map(function (t, k) { return k; }).filter(function (k) { return k !== keep; }).sort(function () { return Math.random() - 0.5; });
  var steps = ["Épreuve des 500 parrainages", "Épreuve des sondages", "Épreuve du débat télé", "Premier tour"], t0 = 1500, dt = 62, left = N;
  order.forEach(function (k, j) {
    timers.push(setTimeout(function () {
      toks[k].classList.add("ko"); left--; $("i-n").textContent = left;
      $("i-step").textContent = steps[Math.min(steps.length - 1, Math.floor(j / order.length * steps.length))];
    }, t0 + j * dt));
  });
  var tEnd = t0 + order.length * dt + 150;
  timers.push(setTimeout(function () { toks[keep].classList.add("win"); toks[keep].textContent = "?"; ov.classList.add("end"); $("i-step").innerHTML = "&nbsp;"; }, tEnd));
  timers.push(setTimeout(close, tEnd + 2600));
}
var MODES = ["classic", "duel", "blitz", "target", "accord", "citations", "casier", "conseil"];
function syncSetup() {
  MODES.forEach(function (m) { $("m-" + m).setAttribute("aria-pressed", cfg.mode === m); });
  ["main", "all"].forEach(function (p) { $("p-" + p).setAttribute("aria-pressed", cfg.pool === p); });
  ["easy", "hard"].forEach(function (d) { $("d-" + d).setAttribute("aria-pressed", cfg.diff === d); });
  ["10", "20", "50", "all"].forEach(function (l) { $("l-" + l).setAttribute("aria-pressed", cfg.len === l); });
  var classicLike = cfg.mode === "classic" || cfg.mode === "blitz";
  $("fld-pool").hidden = !classicLike;
  $("fld-diff").hidden = !classicLike;
  $("fld-len").hidden = !(cfg.mode === "classic" || cfg.mode === "multi");
  $("fld-duel").hidden = cfg.mode !== "duel";
  $("fld-cands").hidden = cfg.mode !== "target";
  $("fld-casier").hidden = cfg.mode !== "casier";
  $("fld-citations").hidden = cfg.mode !== "citations";
  $("fld-conseil").hidden = cfg.mode !== "conseil";
  $("d-hard").innerHTML = (cfg.pool === "main" ? "Les 7 panneaux" : "Les " + C.length + " panneaux") + "<small>Aucune aide</small>";
  $("duel-a").value = cfg.duel[0]; $("duel-b").value = cfg.duel[1];
  C.forEach(function (c) { var b = $("pick-" + c.id); if (b) b.setAttribute("aria-pressed", cfg.targets.indexOf(c.id) >= 0); });
  var ok = true;
  if (cfg.mode === "target") {
    var n = cfg.targets.length;
    $("target-hint").textContent = n === 0 ? "Choisis au moins un candidat." :
      n === 1 ? "Un seul candidat : dis si c’est bien " + CBY[cfg.targets[0]].name + " qui propose chaque mesure. La moitié sont des pièges." :
      "Retrouve le bon candidat parmi les " + n + " choisis (" + SINGLE.filter(function (x) { return cfg.targets.indexOf(x.c) >= 0; }).length + " mesures).";
    ok = n > 0;
  }
  if (cfg.mode === "duel") ok = cfg.duel[0] !== cfg.duel[1];
  $("btn-start").disabled = !ok;
  $("btn-start").firstElementChild.textContent = cfg.mode === "duel" && !ok ? "Choisis deux candidats différents" : pick(GO_LABELS);
  var best = store("qui2027-best-" + modeKey(cfg));
  $("best").textContent = best ? "Ton record dans ce mode : " + fmt(best.pts) + " points (" + best.score + "/" + best.total + ")." : "Pas encore de record dans ce mode. La place est libre.";
}
function modeKey(c) { return c.mode === "classic" || c.mode === "blitz" ? c.mode + "-" + c.pool + "-" + c.diff : c.mode; }
$("modes").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; if (b.dataset.mode === "fil") { openFil(); return; } cfg.mode = b.dataset.mode; syncSetup(); });
$("seg-pool").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; cfg.pool = b.dataset.pool; syncSetup(); });
$("seg-diff").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; cfg.diff = b.dataset.diff; syncSetup(); });
$("seg-len").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; cfg.len = b.dataset.len; syncSetup(); });
$("duel-a").addEventListener("change", function () { cfg.duel[0] = this.value; syncSetup(); });
$("duel-b").addEventListener("change", function () { cfg.duel[1] = this.value; syncSetup(); });
$("duel-chips").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; cfg.duel = DUELS[+b.dataset.i].slice(); syncSetup(); });
$("cand-pick").addEventListener("click", function (e) {
  var b = e.target.closest("button"); if (!b) return;
  var k = cfg.targets.indexOf(b.dataset.c);
  if (k >= 0) cfg.targets.splice(k, 1); else cfg.targets.push(b.dataset.c);
  syncSetup();
});
$("btn-start").addEventListener("click", function () { startGame(buildQuestions(cfg), cfg); });
$("btn-quick").addEventListener("click", function () {
  cfg.mode = "classic"; cfg.pool = "main"; cfg.diff = "easy"; cfg.len = "10"; syncSetup();
  startGame(buildQuestions(cfg), cfg);
});
$("modes").addEventListener("click", function (e) {
  var mb = e.target.closest("button"); if (!mb || mb.dataset.mode === "fil" || window.innerWidth > 860) return;
  setTimeout(function () { $("modebox").scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" }); }, 60);
});


/* ---------- Sondages ---------- */
function pollName(k) { return last(CBY[k] ? CBY[k].name : k); }
function pollCol(k) { return CBY[k] ? (FAMCOL[FAMILY[k]] || "#9aa3b5") : "#9aa3b5"; }
function pollBars(h) {
  var max = Math.max.apply(null, h.r.map(function (x) { return x[1]; }));
  return h.r.slice().sort(function (a, b) { return b[1] - a[1]; }).map(function (x) {
    return "<div class=\"pbar\" style=\"--fam:" + pollCol(x[0]) + "\"><span class=\"nm\" title=\"" + esc(pollName(x[0])) + "\">" + esc(pollName(x[0])) + "</span><span class=\"tr\"><i data-w=\"" + (x[1] / max * 100).toFixed(1) + "\"></i></span><b>" + String(x[1]).replace(".", ",") + " %</b></div>";
  }).join("");
}
function growBars(root) { requestAnimationFrame(function () { [].forEach.call(root.querySelectorAll(".tr i"), function (i) { i.style.width = i.dataset.w + "%"; }); }); }
function renderPolls() {
  $("polls-maj").textContent = POLLS_MAJ;
  $("polls").innerHTML = POLLS.map(function (p, k) {
    return "<article class=\"card poll\" style=\"--pc:" + ["var(--bleu)", "var(--rouge)", "var(--ink)"][k % 3] + "\"><h3>" + esc(p.inst) + "</h3><span class=\"pour\">pour " + esc(p.pour) + " · " + esc(p.terrain) + "</span>" +
      "<label class=\"vh\" for=\"ph-" + k + "\">Hypothèse testée</label><select id=\"ph-" + k + "\" data-k=\"" + k + "\">" + p.hyps.map(function (h, j) { return "<option value=\"" + j + "\">" + esc(h.nom) + "</option>"; }).join("") + "</select>" +
      "<svg viewBox=\"0 0 220 122\" id=\"pa-" + k + "\" role=\"img\" aria-label=\"Répartition des intentions de vote\">" + arcSvg(p.hyps[0]) + "</svg>" +
      "<div class=\"pbars\" id=\"pb-" + k + "\">" + pollBars(p.hyps[0]) + "</div>" +
      "<p class=\"meta\">Sondage " + esc(p.inst) + " pour " + esc(p.pour) + ", réalisé " + esc(p.terrain) + " auprès de " + esc(p.n) + ". " + esc(p.methode) + ". Marge d’erreur " + esc(p.marge) + " selon le score. <a href=\"" + esc(p.u) + "\" target=\"_blank\" rel=\"noopener\">Notice (Commission des sondages) ↗</a></p></article>";
  }).join("");
  growBars($("polls")); renderPov();
}
$("polls").addEventListener("change", function (e) {
  var sel = e.target.closest("select"); if (!sel) return;
  var k = +sel.dataset.k, box = $("pb-" + k), h = POLLS[k].hyps[+sel.value]; box.innerHTML = pollBars(h); $("pa-" + k).innerHTML = arcSvg(h); growBars(box);
});
$("hero-polls").addEventListener("click", function (e) { e.preventDefault(); $("tab-polls").click(); });
$("hero-polls-sub").textContent = "· " + POLLS.length + " instituts, mis à jour le " + POLLS_MAJ.replace(/ 2026$/, "");


var EXTRA_FAM = { "Christine Lagarde": "Centre (camp présidentiel)", "Dominique de Villepin": "Centre droit", "François Hollande": "Gauche sociale-démocrate" };
function famOf(k) { return CBY[k] ? FAMILY[k] : (EXTRA_FAM[k] || "Sans étiquette"); }
function arcSvg(h, big) {
  var segs = h.r.slice().sort(function (a, b) { return FAM_ORDER.indexOf(famOf(a[0])) - FAM_ORDER.indexOf(famOf(b[0])); });
  var tot = segs.reduce(function (a, x) { return a + x[1]; }, 0), cx = 110, cy = 110, R = 100, r = 56, ang = Math.PI, out = [];
  segs.forEach(function (x) {
    var a0 = ang, a1 = ang - x[1] / tot * Math.PI; ang = a1;
    var p = function (a, rr) { return (cx + rr * Math.cos(a)).toFixed(2) + " " + (cy - rr * Math.sin(a)).toFixed(2); };
    var large = (a0 - a1) > Math.PI ? 1 : 0;
    out.push("<path class=\"arc-seg\" fill=\"" + pollCol(x[0]) + "\" stroke=\"var(--sheet)\" stroke-width=\"1.2\" d=\"M " + p(a0, R) + " A " + R + " " + R + " 0 " + large + " 1 " + p(a1, R) + " L " + p(a1, r) + " A " + r + " " + r + " 0 " + large + " 0 " + p(a0, r) + " Z\"><title>" + esc(pollName(x[0]) + " : " + String(x[1]).replace(".", ",") + " %") + "</title></path>");
    if (x[1] >= 7) { var am = (a0 + a1) / 2, t = p(am, (R + r) / 2).split(" "); out.push("<text class=\"arc-lbl\" x=\"" + t[0] + "\" y=\"" + (+t[1] + 3) + "\" text-anchor=\"middle\">" + esc(CBY[x[0]] ? CBY[x[0]].ini : x[0].split(" ").map(function (w) { return w[0]; }).join("")) + "</text>"); }
  });
  var top = h.r.slice().sort(function (a, b) { return b[1] - a[1]; })[0];
  out.push("<text class=\"arc-c1\" x=\"110\" y=\"98\" text-anchor=\"middle\">" + String(top[1]).replace(".", ",") + " %</text><text class=\"arc-c2\" x=\"110\" y=\"112\" text-anchor=\"middle\">" + esc(pollName(top[0])) + " en tête</text>");
  return out.join("");
}
var INST_SH = ["s0", "s1", "s2"];
function renderPov() {
  var hy = POLLS.map(function (p) { return p.hyps[0]; }), names = {};
  hy.forEach(function (h) { h.r.forEach(function (x) { names[x[0]] = Math.max(names[x[0]] || 0, x[1]); }); });
  var rows = Object.keys(names).sort(function (a, b) { return names[b] - names[a]; }), MAX = 40;
  $("pov-legend").innerHTML = POLLS.map(function (p, i) { return "<span><i class=\"pv-dot " + INST_SH[i] + "\"></i>" + esc(p.inst) + " <small>(" + esc(p.terrain.replace(/ 2026$/, "")) + ")</small></span>"; }).join("");
  $("pov-plot").innerHTML = rows.map(function (k) {
    var vals = hy.map(function (h) { var x = h.r.filter(function (y) { return y[0] === k; })[0]; return x ? x[1] : null; });
    var got = vals.filter(function (v) { return v !== null; }), mn = Math.min.apply(null, got), mx = Math.max.apply(null, got);
    return "<div class=\"pv-row\" style=\"--fam:" + pollCol(k) + "\"><span class=\"nm\"><i></i>" + esc(pollName(k)) + "</span><div class=\"pv-track\"><span class=\"pv-span\" style=\"left:" + (mn / MAX * 100) + "%;width:" + ((mx - mn) / MAX * 100) + "%\"></span>" +
      vals.map(function (v, i) { return v === null ? "" : "<i class=\"pv-dot " + INST_SH[i] + "\" data-l=\"" + (v / MAX * 100) + "\" style=\"left:0\" title=\"" + esc(POLLS[i].inst + " : " + String(v).replace(".", ",") + " %") + "\"></i>"; }).join("") + "</div></div>";
  }).join("") + "<div class=\"pv-axis\"><span></span><div><span>0 %</span><span>10 %</span><span>20 %</span><span>30 %</span><span>40 %</span></div></div>";
  requestAnimationFrame(function () { setTimeout(function () { [].forEach.call($("pov-plot").querySelectorAll(".pv-dot"), function (d) { d.style.left = d.dataset.l + "%"; }); }, 60); });
}
function renderMiniPoll() {
  var p = POLLS[0], h = p.hyps[0];
  $("mp-arc").innerHTML = arcSvg(h);
  $("mp-src").textContent = "Sondage " + p.inst + " pour " + p.pour + " · " + p.terrain.replace(/ 2026$/, "") + " · " + h.nom.toLowerCase();
}
$("mini-poll").addEventListener("click", function (e) { e.preventDefault(); $("tab-polls").click(); });


/* ---------- Fil info ---------- */
var NEWS_ICO = { declare: "🙋", programme: "📘", mesure: "💡", agenda: "📅", insolite: "😄", debat: "🎤" };
(function renderTicker() {
  if (typeof NEWS === "undefined" || !NEWS.length) { $("ticker").hidden = true; return; }
  function item(n) { return "<a href=\"" + esc(n.u) + "\" target=\"_blank\" rel=\"noopener\"><span class=\"tk-d\">" + esc(n.d) + "</span>" + esc(n.t) + " <span class=\"tk-s\">(" + esc(n.s) + ")</span></a>"; }
  $("tk-one").innerHTML = item(NEWS[0]);
  $("tk-list").innerHTML = NEWS.slice(1).map(function (n) { return "<li>" + item(n) + "</li>"; }).join("");
  var more = $("tk-more");
  if (NEWS.length < 2) { more.hidden = true; return; }
  more.textContent = "+ " + (NEWS.length - 1);
  more.addEventListener("click", function () { var open = $("tk-list").hidden; $("tk-list").hidden = !open; more.setAttribute("aria-expanded", open); more.textContent = open ? "Réduire" : "+ " + (NEWS.length - 1); });
})();

/* ---------- Échauffement (accueil) ---------- */
var tz = { ok: 0, n: 0, cur: null, seen: {} };
var TZ_OK = ["Bien vu.", "Exact. Tu lis les programmes, toi.", "Dans le mille.", "Oui ! Prêt·e pour la vraie partie ?", "Bravo, même son équipe de campagne hésitait."];
var TZ_KO = ["Raté, c’est", "Perdu : la réponse était", "Eh non, c’est", "Piège ! C’était"];
function teaserNext() {
  var mains = C.filter(function (c) { return c.main; });
  var pool = SINGLE.filter(function (x) { return CBY[x.c].main && !tz.seen[x.id] && x.m.length < 120; });
  if (!pool.length) { tz.seen = {}; pool = SINGLE.filter(function (x) { return CBY[x.c].main; }); }
  var q = pick(pool); tz.seen[q.id] = 1; tz.cur = q;
  var opts = shuffle([q.c].concat(shuffle(mains.filter(function (c) { return c.id !== q.c; })).slice(0, 2).map(function (c) { return c.id; })));
  $("t-m").textContent = "« " + q.m.replace(/\.$/, "") + " »";
  $("t-opts").innerHTML = opts.map(function (id) {
    var c = CBY[id];
    return "<button type=\"button\" data-c=\"" + id + "\" style=\"--fam:" + (FAMCOL[FAMILY[id]] || "#888") + "\"><i>" + esc(c.ini) + "</i><span>" + esc(c.name) + "</span></button>";
  }).join("");
  $("t-res").textContent = ""; $("t-next").hidden = true; $("teaser").classList.remove("won", "lost");
}
$("t-opts").addEventListener("click", function (e) {
  var b = e.target.closest("button"); if (!b || !tz.cur || $("teaser").classList.contains("won") || $("teaser").classList.contains("lost")) return;
  var good = b.dataset.c === tz.cur.c; tz.n++; if (good) tz.ok++;
  [].forEach.call(this.children, function (x) { x.disabled = true; if (x.dataset.c === tz.cur.c) x.classList.add("ok"); });
  if (!good) b.classList.add("ko");
  $("teaser").classList.add(good ? "won" : "lost");
  $("t-res").innerHTML = good ? esc(pick(TZ_OK)) : esc(pick(TZ_KO)) + " <b>" + esc(CBY[tz.cur.c].name) + "</b>.";
  $("t-score").textContent = tz.ok + "/" + tz.n;
  $("t-next").hidden = false;
  if (tz.n === 3) $("t-res").insertAdjacentHTML("beforeend", "<br><small>Échauffé·e ? Passe à la vraie partie avec « Jouer maintenant ».</small>");
});
$("t-next").addEventListener("click", teaserNext);

/* ---------- Fidélisation : défi du jour, série, grades, fil, nouveautés ---------- */
var D0 = new Date(2026, 10, 13); // défi n°1 : vendredi 13 novembre 2026
function dayNum(d) { d = d || new Date(); var a = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return Math.round((a - D0) / 86400000) + 1; }
function seeded(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function dailyQuestions(n) {
  var r = Math.random; Math.random = seeded(20270418 + n * 7919);
  try { return buildQuestions({ mode: "classic", pool: "main", diff: "easy", len: "5", duel: [], targets: [] }).slice(0, 5); }
  finally { Math.random = r; }
}
var DAILY_KEY = "qui2027-daily", STREAK_KEY = "qui2027-streak", XP_KEY = "qui2027-xp", FILBEST_KEY = "qui2027-filbest", SEEN_KEY = "qui2027-seenraw";
function streakNow() { var st = store(STREAK_KEY) || { last: 0, n: 0, best: 0 }; if (st.last < dayNum() - 1) st.n = 0; return st; }
function untilMidnight() { var n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1); var s2 = Math.max(0, Math.floor((m - n) / 1000)); return Math.floor(s2 / 3600) + " h " + pad(Math.floor(s2 % 3600 / 60)) + " min"; }
function gridHtml(g) { return g.map(function (ok) { return "<span class=\"" + (ok ? "ok" : "ko") + "\">" + (ok ? "✓" : "✗") + "</span>"; }).join(""); }
function gridEmoji(g) { return g.map(function (ok) { return ok ? "🟩" : "🟥"; }).join(""); }
function dailyShareText(d, st) {
  return "Qui a proposé ça ? 🗳️ Défi du jour n°" + d.n + " : " + d.score + "/" + d.total + "\n" + gridEmoji(d.grid) + (st.n > 1 ? "\n🔥 Série : " + st.n + " jours" : "") + "\nÀ toi : " + siteUrl();
}
function renderDaily() {
  var n = dayNum(), d = store(DAILY_KEY), st = streakNow(), done = d && d.n === n;
  $("d-num").textContent = "n°" + n;
  $("d-streak").textContent = "🔥 " + st.n; $("d-streak").classList.toggle("zero", !st.n);
  $("d-go").hidden = !!done; $("d-share").hidden = !done;
  $("d-grid").innerHTML = done ? gridHtml(d.grid) : "<span>?</span><span>?</span><span>?</span><span>?</span><span>?</span>";
  $("d-state").textContent = done ? "Fait : " + d.score + "/" + d.total + ". " + (d.score === d.total ? "Sans faute, respect." : d.score >= 3 ? "Pas mal du tout." : "Demain, revanche.") :
    st.n ? "Ta série tient à un fil : ne la casse pas aujourd’hui." : "Un seul essai par jour. Compare ton score avec tes amis.";
  $("d-next").textContent = done ? "Prochain défi dans " + untilMidnight() + "." : "";
  renderLeagueCard();
  renderGrade();
  var seen = store(SEEN_KEY);
  if (seen === null) store(SEEN_KEY, RAW.length);
  var nw = seen === null ? 0 : RAW.length - seen;
  $("news-chip").hidden = nw <= 0;
  if (nw > 0) $("news-chip").textContent = "🆕 " + plural(nw, "nouvelle mesure", "nouvelles mesures") + " depuis ta dernière visite → les jouer";
}
$("d-go").addEventListener("click", function () {
  var n = dayNum(), d = store(DAILY_KEY); if (d && d.n === n) { renderDaily(); return; }
  startGame(dailyQuestions(n), { mode: "classic", pool: "main", diff: "easy", len: "5", duel: [], targets: [], daily: n });
});
function shareOrCopy(txt, onDone) {
  if (navigator.share) { navigator.share({ title: "Qui a proposé ça ?", text: txt }).catch(function () {}); return; }
  try { navigator.clipboard.writeText(txt).then(function () { onDone("Copié, à coller où tu veux."); }, function () { onDone(txt); }); } catch (e) { onDone(txt); }
}
$("d-share").addEventListener("click", function () {
  var d = store(DAILY_KEY); if (!d) return;
  shareOrCopy(dailyShareText(d, streakNow()), function (m) { $("d-next").textContent = m; });
});
$("news-chip").addEventListener("click", function () {
  var seen = store(SEEN_KEY) || 0, ids = [];
  for (var i = Math.max(seen, RAW.length - 30); i < RAW.length; i++) ids.push(i);
  store(SEEN_KEY, RAW.length);
  var conf = { mode: "classic", pool: "all", diff: "easy", len: "all", duel: [], targets: [] };
  var qs = buildQuestions(conf, ids);
  if (qs.length) startGame(qs, conf); else renderDaily();
});

var GRADES = [[0, "📣", "Militant·e"], [20, "🧷", "Colleur·se d’affiches"], [60, "📋", "Attaché·e parlementaire"], [130, "🗂️", "Conseiller·e ministériel·le"], [250, "🏛️", "Ministre"], [450, "🎖️", "Premier·e ministre"], [750, "🇫🇷", "Président·e de la République"]];
function gradeOf(xp) { var k = 0; GRADES.forEach(function (g, i) { if (xp >= g[0]) k = i; }); return k; }
function gradeInfo(xp) {
  var k = gradeOf(xp), g = GRADES[k], nx = GRADES[k + 1];
  return { k: k, ico: g[1], name: g[2], next: nx, fill: nx ? Math.round((xp - g[0]) / (nx[0] - g[0]) * 100) : 100, left: nx ? nx[0] - xp : 0 };
}
function gradeNextTxt(gi) { return gi.next ? "Encore " + plural(gi.left, "bonne réponse", "bonnes réponses") + " pour devenir " + gi.next[2] + "." : "Tu as atteint le sommet. Le Conseil constitutionnel valide ton élection."; }
function renderGrade() {
  if (!$("gr-name")) return;
  var gi = gradeInfo(store(XP_KEY) || 0);
  $("gr-ico").textContent = gi.ico; $("gr-name").textContent = gi.name;
  $("gr-fill").style.width = gi.fill + "%"; $("gr-next").textContent = gradeNextTxt(gi);
  $("gr-ladder").innerHTML = GRADES.map(function (g, i) { return "<span class=\"" + (i < gi.k ? "past" : i === gi.k ? "cur" : "") + "\" title=\"" + esc(g[2] + " (" + g[0] + ")") + "\">" + g[1] + "</span>"; }).join("");
}
function addXp(n) {
  var before = store(XP_KEY) || 0, after = before + n; store(XP_KEY, after);
  return { before: gradeInfo(before), after: gradeInfo(after), gained: n };
}
function afterGame(ans, sc, total) {
  var xp = addXp(sc), h = "";
  if (xp.after.k > xp.before.k) { h += "<span class=\"lvl\">Promotion</span>🎉 Tu deviens <b>" + esc(xp.after.ico + " " + xp.after.name) + "</b> ! "; setTimeout(function () { confetti(80); }, 500); }
  else h += "<span class=\"lvl\">" + esc(xp.after.ico + " " + xp.after.name) + "</span>+" + plural(sc, "bonne réponse", "bonnes réponses") + ". ";
  h += esc(gradeNextTxt(xp.after)) + "<div class=\"g-bar\"><span style=\"width:" + xp.after.fill + "%\"></span></div>";
  $("r-xp").innerHTML = h;
  var dn = game.cfg.daily;
  $("r-daily").hidden = !dn; $("r-again").hidden = !!dn;
  if (dn) {
    var grid = ans.map(function (a) { return !!a.ok; });
    var d = { n: dn, score: sc, total: total, grid: grid, pts: game.pts };
    var prev = store(DAILY_KEY);
    if (!(prev && prev.n === dn)) {
      store(DAILY_KEY, d);
      var st = store(STREAK_KEY) || { last: 0, n: 0, best: 0 };
      st.n = st.last === dn - 1 ? st.n + 1 : (st.last === dn ? st.n : 1); st.last = dn; st.best = Math.max(st.best || 0, st.n);
      store(STREAK_KEY, st);
      submitDailyOnline(d).then(function () { dailyRank(dn); });
    } else d = prev;
    var st2 = streakNow();
    $("r-daily").innerHTML = "<span>Défi du jour n°" + dn + " : <b>" + d.score + "/" + d.total + "</b></span><span class=\"d-grid\">" + gridHtml(d.grid) + "</span><span>🔥 Série : " + plural(st2.n, "jour", "jours") + (st2.best > st2.n ? " (record " + st2.best + ")" : "") + "</span><span class=\"meta\">Prochain défi dans " + untilMidnight() + ".</span>";
  }
}


function dailyRank(dn) {
  var me = onlineMe(), cur = store(OL_CUR_KEY); if (!sbOn() || !me || !cur) return;
  rpc("qp_board", { p_code: cur, p_viewer: me.id }).then(function (rows) {
    rows = (rows || []).filter(function (r) { return r.today >= 0; }).sort(function (a, b) { return b.today - a.today || b.ptsum - a.ptsum; });
    var k = rows.findIndex(function (r) { return r.isme; }); if (k < 0) return;
    rpc("qp_league_name", { p_code: cur }).then(function (n) {
      var el = $("r-daily"); if (!el || el.hidden) return;
      el.insertAdjacentHTML("beforeend", "<span>🏟️ Ligue « " + esc(n || cur) + " » : <b>" + (k + 1) + (k ? "e" : "er") + "</b> sur " + rows.length + " aujourd’hui" + (k === 0 ? " 👑" : "") + "</span>");
    });
  }).catch(function () {});
}

/* Le Fil : un flux vertical façon réseaux sociaux */
var fil = null, COARSE = window.matchMedia && matchMedia("(pointer: coarse)").matches;
var FIL_BG = ["#101a4d", "#3a0d14", "#0f2a22", "#1c1240", "#2b1d0a", "#0d2236"];
var FIL_OK = ["Bien vu !", "Exact.", "Dans le mille.", "Oui !", "Facile pour toi."], FIL_KO = ["Raté :", "Non, c’est", "Piège ! C’était", "Eh non :"];
function filCard() {
  var mains = C.filter(function (c) { return c.main; });
  var pool = SINGLE.filter(function (x) { return !fil.seen[x.id] && x.m.length < 150 && (CBY[x.c].main || Math.random() < .35); });
  if (!pool.length) { fil.seen = {}; pool = SINGLE.slice(); }
  var q = pick(pool); fil.seen[q.id] = 1;
  var others = shuffle((CBY[q.c].main ? mains : C).filter(function (c) { return c.id !== q.c; })).slice(0, 2).map(function (c) { return c.id; });
  var opts = shuffle([q.c].concat(others));
  var el = document.createElement("section");
  el.className = "fcard"; el.dataset.mid = q.id; el.dataset.c = q.c;
  el.style.setProperty("--bg", FIL_BG[fil.n++ % FIL_BG.length]);
  el.innerHTML = "<span class=\"f-theme\">" + esc(q.t) + "</span><p class=\"f-q\">Qui a proposé ça ?</p><p class=\"f-m\">« " + esc(q.m.replace(/\.$/, "")) + " »</p>" +
    "<div class=\"f-opts\">" + opts.map(function (id) { var c = CBY[id]; return "<button type=\"button\" data-c=\"" + id + "\" style=\"--fam:" + (FAMCOL[FAMILY[id]] || "#888") + "\"><i>" + esc(c.ini) + "</i><span>" + esc(c.name) + "</span></button>"; }).join("") + "</div>" +
    "<p class=\"f-res\"></p><button type=\"button\" class=\"f-hint\">" + (COARSE ? "↑ Swipe pour la suivante" : "Suivante ↓") + "</button>";
  $("fil-feed").appendChild(el);
}
function filCombo() {
  $("fil-combo").innerHTML = "🔥 ×" + fil.combo + "<small>record ×" + (store(FILBEST_KEY) || 0) + " · " + fil.ok + "/" + fil.tot + "</small>";
}
function openFil() {
  if (!$("fil")) {
    var ov = document.createElement("div"); ov.id = "fil"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Le Fil");
    ov.innerHTML = "<div class=\"fil-head\"><span class=\"fil-combo\" id=\"fil-combo\"></span><button type=\"button\" class=\"fil-x\" id=\"fil-x\" aria-label=\"Fermer le fil\">✕</button></div><div class=\"fil-feed\" id=\"fil-feed\"></div>";
    document.body.appendChild(ov);
    $("fil-x").addEventListener("click", closeFil);
    $("fil-feed").addEventListener("click", filAnswer);
    $("fil-feed").addEventListener("scroll", function () { var f = this; if (f.scrollTop + f.clientHeight * 2.2 > f.scrollHeight) { filCard(); filCard(); } });
    document.addEventListener("keydown", function (e) {
      if ($("fil").hidden) return;
      if (e.key === "Escape") closeFil();
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); $("fil-feed").scrollBy({ top: $("fil-feed").clientHeight, behavior: "smooth" }); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); $("fil-feed").scrollBy({ top: -$("fil-feed").clientHeight, behavior: "smooth" }); }
    });
  }
  fil = { seen: {}, n: 0, combo: 0, ok: 0, tot: 0, ans: [] };
  $("fil-feed").innerHTML = ""; for (var i = 0; i < 4; i++) filCard();
  $("fil").hidden = false; document.body.style.overflow = "hidden"; $("fil-feed").scrollTop = 0;
  filCombo();
}
function filAnswer(e) {
  if (e.target.closest(".f-hint")) { $("fil-feed").scrollBy({ top: $("fil-feed").clientHeight, behavior: "smooth" }); return; }
  var b = e.target.closest(".f-opts button"); if (!b) return;
  var card = b.closest(".fcard"); if (card.classList.contains("done")) return;
  var good = b.dataset.c === card.dataset.c, m = M[+card.dataset.mid];
  card.classList.add("done"); fil.tot++;
  [].forEach.call(card.querySelectorAll(".f-opts button"), function (x) { x.disabled = true; if (x.dataset.c === card.dataset.c) x.classList.add("ok"); });
  if (good) { fil.ok++; fil.combo++; card.classList.add("pop"); if (fil.combo > (store(FILBEST_KEY) || 0)) store(FILBEST_KEY, fil.combo); }
  else { b.classList.add("ko"); fil.combo = 0; }
  card.querySelector(".f-res").innerHTML = (good ? "<b>" + esc(pick(FIL_OK)) + "</b>" : "<b>" + esc(pick(FIL_KO)) + " " + esc(CBY[m.c].name) + "</b>") + "<br>" + srcHtml(m);
  fil.ans.push({ mid: m.id, type: "pick", ok: good, pick: b.dataset.c });
  filCombo();
  if (good && fil.combo > 0 && fil.combo % 5 === 0) confetti(40);
}
function closeFil() {
  $("fil").hidden = true; document.body.style.overflow = "";
  if (fil && fil.ans.length) {
    var s2 = tallyStats(fil.ans, getStats()); s2.q += fil.ans.length; store(STATS_KEY, s2);
    addXp(fil.ok); fil.ans = [];
  }
  renderDaily();
}
$("lc-pill").addEventListener("click", function () { $("tab-stats").click(); setTimeout(function () { var el = sbOn() ? $("ol-card") : $("lg-table"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 250); });
function renderLeagueCard() {
  var pr = profile(), me = sbOn() && onlineMe(), cur = store(OL_CUR_KEY);
  $("lc-ava").textContent = pr.emo;
  var sn = streakNow().n, fire = sn ? " · 🔥 " + sn : "";
  $("lc-txt").textContent = (pr.name ? pr.name + " · ligue entre amis" : "Ligue entre amis") + fire;
  if (me && cur) rpc("qp_board", { p_code: cur, p_viewer: me.id }).then(function (bd) {
    bd = (bd || []).sort(function (a, b) { return b.week - a.week || b.ptsum - a.ptsum; });
    var k = bd.findIndex(function (r) { return r.isme; });
    if (k >= 0) $("lc-txt").textContent = (pr.name || "Toi") + " · " + (k + 1) + (k ? "e" : "er") + " de ta ligue sur " + bd.length + fire;
  }).catch(function () {});
}
/* ---------- Profil et défis entre amis (par lien, sans serveur) ---------- */
var PROFILE_KEY = "qui2027-profile", LEAGUE_KEY = "qui2027-league";
var PORTF = [["🏛️", "Institutions"], ["⚖️", "Justice"], ["🎓", "Éducation"], ["🌿", "Écologie"], ["🩺", "Santé"], ["🎭", "Culture"], ["🛡️", "Défense"], ["🌍", "Affaires étrangères"], ["💶", "Économie"], ["🚆", "Transports"], ["🌾", "Agriculture"], ["🔬", "Recherche"]];
var EMOS = PORTF.map(function (x) { return x[0]; });
function portName(e) { var x = PORTF.filter(function (y) { return y[0] === e; })[0]; return x ? x[1] : ""; }
function profile() { var p = store(PROFILE_KEY) || {}; return { name: (p.name || "").slice(0, 20), emo: EMOS.indexOf(p.emo) >= 0 ? p.emo : "🏛️" }; }
function saveProfile(p) { store(PROFILE_KEY, { name: (p.name || "").trim().slice(0, 20), emo: p.emo }); }
function b64e(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function b64d(t) { t = t.replace(/-/g, "+").replace(/_/g, "/"); while (t.length % 4) t += "="; return JSON.parse(decodeURIComponent(escape(atob(t)))); }
function ck(txt) { var h = 0; for (var i = 0; i < txt.length; i++) h = (h * 31 + txt.charCodeAt(i)) % 9973; return h; }
function canChallenge() { return game && game.cfg.mode !== "blitz" && game.qs.length <= 20 && game.qs.every(function (q) { return q.type === "pick"; }) && game.answers.filter(Boolean).length === game.qs.length; }
function challengeUrl() {
  var pr = profile(), r = game.result;
  var o = { v: 1, n: pr.name || "Un·e ami·e", e: pr.emo, s: r.score, t: r.total, p: r.pts, m: game.cfg.mode,
    g: game.qs.map(function (q, i) { return game.answers[i] && game.answers[i].ok ? 1 : 0; }).join(""),
    q: game.qs.map(function (q) { return [q.mid, ck(M[q.mid].m)].concat(q.opts); }) };
  if (game.cfg.vs) o.r = { n: game.cfg.vs.n, e: game.cfg.vs.e, s: game.cfg.vs.s, t: game.cfg.vs.t };
  return siteUrl() + "#defi=" + b64e(o);
}
function parseChallenge(h) {
  try {
    var o = b64d(h); if (!o || o.v !== 1 || !o.q || !o.q.length || o.q.length > 20) return null;
    var qs = o.q.map(function (x) {
      var m = M[x[0]], opts = x.slice(2).filter(function (id) { return CBY[id]; });
      if (!m || ck(m.m) !== x[1] || opts.indexOf(m.c) < 0) throw new Error("old");
      return { mid: x[0], type: "pick", opts: opts };
    });
    o.n = String(o.n || "Un·e ami·e").slice(0, 20); o.e = EMOS.indexOf(o.e) >= 0 ? o.e : "🏛️";
    return { o: o, qs: qs };
  } catch (e) { return { old: true }; }
}
var pendingVs = null;
function showVsBanner() {
  var b = $("vs-banner"); if (!pendingVs) { b.hidden = true; return; }
  if (pendingVs.old) { b.hidden = false; $("vs-ava").textContent = "🕰️"; $("vs-who").textContent = "Ce défi a expiré"; $("vs-sub").textContent = "Le quiz a été mis à jour depuis. Demande un nouveau lien, ou lance une partie."; $("vs-go").hidden = true; return; }
  var o = pendingVs.o; b.hidden = false; $("vs-go").hidden = false;
  $("vs-ava").textContent = o.e; $("vs-who").textContent = o.n + " te défie !";
  $("vs-sub").textContent = (o.r ? o.n + " a relevé ton défi et te renvoie la balle. " : "") + "Score à battre : " + o.s + "/" + o.t + " sur les mêmes " + o.q.length + " questions.";
}
$("vs-go").addEventListener("click", function () {
  if (!pendingVs || pendingVs.old) return;
  var o = pendingVs.o, md = ["citations", "casier"].indexOf(o.m) >= 0 ? o.m : "classic";
  startGame(pendingVs.qs, { mode: md, pool: "all", diff: "easy", len: "10", duel: [], targets: [], vs: { n: o.n, e: o.e, s: o.s, t: o.t, p: o.p, g: o.g } });
  pendingVs = null; showVsBanner();
});
$("vs-x").addEventListener("click", function () { pendingVs = null; showVsBanner(); });
function checkHashChallenge() {
  var m = location.hash.match(/^#defi=([A-Za-z0-9_-]+)$/); if (!m) return false;
  pendingVs = parseChallenge(m[1]);
  history.replaceState(null, "", location.pathname + location.search);
  show("setup"); showVsBanner(); window.scrollTo({ top: 0 });
  return true;
}
function vsAfter(sc, total) {
  var vs = game.cfg.vs; $("r-vs").hidden = !vs;
  if (!vs) return;
  var pr = profile(), me = { n: pr.name || "Toi", e: pr.emo, s: sc, p: game.pts, g: game.qs.map(function (q, i) { return game.answers[i] && game.answers[i].ok ? 1 : 0; }).join("") };
  var res = sc !== vs.s ? (sc > vs.s ? 1 : -1) : (game.pts !== vs.p ? (game.pts > vs.p ? 1 : -1) : 0);
  function side(x, win) { return "<div class=\"side" + (win ? " win" : "") + "\"><span class=\"ava\">" + esc(x.e) + "</span><b>" + esc(x.n) + "</b><span class=\"sc\">" + x.s + "/" + total + "</span><span class=\"d-grid\">" + gridHtml(String(x.g || "").split("").map(function (c) { return c === "1"; })) + "</span></div>"; }
  var verdict = res > 0 ? "🏆 Tu bats " + esc(vs.n) + " ! Renvoie-lui la balle." : res < 0 ? "😬 " + esc(vs.n) + " gagne cette manche. Revanche ?" : "🤝 Égalité parfaite. Il faut une belle.";
  if (sc === vs.s && res !== 0) verdict += " (Départagés aux points : " + fmt(game.pts) + " contre " + fmt(vs.p || 0) + ".)";
  $("r-vs").innerHTML = side(me, res > 0) + "<span class=\"vsm\">VS</span>" + side(vs, res < 0) + "<p class=\"verdict\">" + verdict + "</p>";
  var lg = store(LEAGUE_KEY) || {}, k = vs.n.toLowerCase(), row = lg[k] || { n: vs.n, e: vs.e, w: 0, l: 0, d: 0 };
  row.n = vs.n; row.e = vs.e; if (res > 0) row.w++; else if (res < 0) row.l++; else row.d++; row.at = Date.now();
  lg[k] = row; store(LEAGUE_KEY, lg);
  if (res > 0) setTimeout(function () { confetti(70); }, 400);
}
function chalSetup() {
  var ok = canChallenge(); $("r-chal").hidden = !ok; if (!ok) return;
  var pr = profile();
  $("r-emo").innerHTML = PORTF.map(function (x) { return "<option value=\"" + x[0] + "\"" + (x[0] === pr.emo ? " selected" : "") + ">" + x[0] + " " + x[1] + "</option>"; }).join("");
  $("r-name").value = pr.name; $("r-chal-msg").textContent = "";
  $("r-chal-go").textContent = game.cfg.vs ? "🥊 Renvoyer la balle à " + game.cfg.vs.n : "🥊 Défier un ami sur ces questions";
}
$("r-chal-go").addEventListener("click", function () {
  saveProfile({ name: $("r-name").value, emo: $("r-emo").value });
  var pr = profile(), r = game.result, url = challengeUrl();
  var txt = pr.emo + " " + (pr.name || "Quelqu’un") + " te défie sur « Qui a proposé ça ? » : " + r.score + "/" + r.total + (game.cfg.vs ? " (et toi tu avais " + game.cfg.vs.s + "/" + game.cfg.vs.t + ")" : "") + ". Mêmes questions, à toi de faire mieux 👉 " + url;
  if (navigator.share) { navigator.share({ title: "Qui a proposé ça ? Défi", text: txt }).catch(function () {}); $("r-chal-msg").textContent = ""; return; }
  try { navigator.clipboard.writeText(txt).then(function () { $("r-chal-msg").textContent = "Lien copié : colle-le à tes amis (WhatsApp, SMS…)."; }, function () { $("r-chal-msg").textContent = url; }); } catch (e) { $("r-chal-msg").textContent = url; }
});
function renderProfile() {
  var pr = profile();
  $("pf-ava").textContent = pr.emo; $("pf-name").value = pr.name;
  $("pf-emos").innerHTML = PORTF.map(function (x) { return "<button type=\"button\" data-e=\"" + x[0] + "\" title=\"Ministère : " + x[1] + "\" aria-pressed=\"" + (x[0] === pr.emo) + "\"><span>" + x[0] + "</span>" + x[1] + "</button>"; }).join("");
  var gi = gradeInfo(store(XP_KEY) || 0); $("pf-grade").textContent = "Grade : " + gi.ico + " " + gi.name;
  var lg = store(LEAGUE_KEY) || {}, rows = Object.keys(lg).map(function (k) { return lg[k]; });
  rows.sort(function (a, b) { return (b.w + b.l + b.d) - (a.w + a.l + a.d) || b.at - a.at; });
  var W = rows.reduce(function (a, r) { return a + r.w; }, 0), L = rows.reduce(function (a, r) { return a + r.l; }, 0), Dd = rows.reduce(function (a, r) { return a + r.d; }, 0);
  $("lg-table").innerHTML = rows.length ? "<table class=\"lg\"><thead><tr><th></th><th>Ami·e</th><th>Défis</th><th>Tes victoires</th><th>Ses victoires</th><th>Nuls</th></tr></thead><tbody>" +
    "<tr class=\"me\"><td class=\"rk\">" + esc(pr.emo) + "</td><td><b>" + esc(pr.name || "Toi") + "</b> (total)</td><td class=\"n\">" + (W + L + Dd) + "</td><td class=\"n\">" + W + "</td><td class=\"n\">" + L + "</td><td class=\"n\">" + Dd + "</td></tr>" +
    rows.map(function (r) { return "<tr><td class=\"rk\">" + esc(r.e) + "</td><td>" + esc(r.n) + "</td><td class=\"n\">" + (r.w + r.l + r.d) + "</td><td class=\"n\">" + r.w + "</td><td class=\"n\">" + r.l + "</td><td class=\"n\">" + r.d + "</td></tr>"; }).join("") + "</tbody></table>"
    : "<p class=\"lg-empty\">Pas encore de défi. Joue une partie, puis envoie le lien « Défier un ami » : ton ami joue les mêmes questions et vos scores s’affichent ici.</p>";
}

/* ---------- Ligues en ligne (Supabase) ---------- */
var SB_URL = "", SB_KEY = ""; // renseignés au déploiement
var ONLINE_KEY = "qui2027-online", OL_CUR_KEY = "qui2027-olcur";
function sbOn() { return !!(SB_URL && SB_KEY); }
function rpc(fn, args) {
  var h = { "Content-Type": "application/json", "apikey": SB_KEY };
  if (!/^sb_/.test(SB_KEY)) h.Authorization = "Bearer " + SB_KEY;
  return fetch(SB_URL.replace(/\/$/, "") + "/rest/v1/rpc/" + fn, { method: "POST", headers: h, body: JSON.stringify(args || {}) })
    .then(function (r) { return r.text().then(function (t) { var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {} if (!r.ok) throw new Error((j && (j.message || j.hint)) || "Connexion impossible"); return j; }); });
}
function onlineMe() { return store(ONLINE_KEY); }
function ensurePlayer() {
  var me = onlineMe(); if (me) return Promise.resolve(me);
  var pr = profile(); if (!pr.name) return Promise.reject(new Error("Choisis d’abord un pseudo."));
  return rpc("qp_create_player", { p_name: pr.name, p_emo: pr.emo }).then(function (r) { var x = r[0]; me = { id: x.pid, secret: x.psecret }; store(ONLINE_KEY, me); return me; });
}
function auth(me, extra) { var o = { p_id: me.id, p_secret: me.secret }; for (var k in extra) o[k] = extra[k]; return o; }
function onlineError(e) {
  if (e && /profil inconnu/.test(e.message)) { store(ONLINE_KEY, null); return "Ton profil en ligne a été supprimé. Rejoins à nouveau une ligue."; }
  return (e && e.message) || "Connexion impossible.";
}
function submitDailyOnline(d) {
  var me = onlineMe(); if (!sbOn() || !me || !d) return Promise.resolve();
  return rpc("qp_submit", auth(me, { p_day: d.n, p_score: d.score, p_pts: d.pts || 0 })).catch(function () {});
}
var olLeagues = [], olSort = "week";
function olMsg(t, ok) { var el = $("ol-msg"); el.textContent = t || ""; el.className = "ol-msg" + (ok ? " ok" : ""); }
function inviteText(l) { return "🏟️ Rejoins ma ligue « " + l.lname + " » sur Qui a proposé ça ? : un défi de 5 mesures par jour, et un classement entre nous. Code " + l.lcode + " 👉 " + siteUrl() + "#ligue=" + l.lcode; }
function renderOnline() {
  var card = $("ol-card"); card.hidden = !sbOn(); if (!sbOn()) return;
  var me = onlineMe(), pr = profile();
  $("ol-me").textContent = me ? pr.emo + " " + (pr.name || "") : "";
  $("ol-del").hidden = !me;
  if (!me) { olLeagues = []; drawOnline(); return; }
  rpc("qp_my_leagues", auth(me)).then(function (r) { olLeagues = r || []; drawOnline(); }).catch(function (e) { olMsg(onlineError(e)); drawOnline(); });
}
function drawOnline() {
  var cur = store(OL_CUR_KEY);
  if (!olLeagues.some(function (l) { return l.lcode === cur; })) cur = olLeagues.length ? olLeagues[0].lcode : null;
  $("ol-tabs").innerHTML = olLeagues.map(function (l) { return "<button type=\"button\" role=\"tab\" data-code=\"" + esc(l.lcode) + "\" aria-selected=\"" + (l.lcode === cur) + "\">" + esc(l.lname) + " <small>(" + l.nb + ")</small></button>"; }).join("");
  if (!cur) { $("ol-board").innerHTML = "<p class=\"lg-empty\">Tu n’es dans aucune ligue en ligne. Crée la tienne et invite tes amis avec le code, ou rejoins une ligue existante.</p>"; return; }
  store(OL_CUR_KEY, cur);
  var l = olLeagues.filter(function (x) { return x.lcode === cur; })[0];
  $("ol-board").innerHTML = "<p class=\"lg-empty\">Chargement du classement…</p>";
  rpc("qp_board", { p_code: cur, p_viewer: onlineMe().id }).then(function (rows) {
    rows = rows || [];
    rows.sort(function (a, b) { return olSort === "week" ? (b.week - a.week || b.ptsum - a.ptsum) : (b.total - a.total || b.ptsum - a.ptsum); });
    var md = ["🥇", "🥈", "🥉"];
    var snb = streakNow().n;
    $("ol-board").innerHTML = "<div class=\"ol-bar\"><span>Code : <code>" + esc(l.lcode) + "</code>" + (snb ? " · ta série : 🔥 " + plural(snb, "jour", "jours") : "") + "</span><button type=\"button\" class=\"btn\" id=\"ol-invite\">📨 Inviter des amis</button>" +
      "<span class=\"ol-sort\"><button type=\"button\" data-s=\"week\" aria-pressed=\"" + (olSort === "week") + "\">7 jours</button><button type=\"button\" data-s=\"total\" aria-pressed=\"" + (olSort === "total") + "\">Depuis le début</button></span>" +
      "<button type=\"button\" class=\"linkbtn\" id=\"ol-leave\">Quitter la ligue</button></div>" +
      "<table class=\"lg\"><thead><tr><th></th><th>Joueur</th><th>Aujourd’hui</th><th>7 jours</th><th>Total</th><th>Défis</th></tr></thead><tbody>" +
      rows.map(function (r, i) { return "<tr" + (r.isme ? " class=\"me\"" : "") + "><td class=\"rk\">" + (md[i] ? "<span class=\"medal\">" + md[i] + "</span>" : i + 1) + "</td><td>" + esc(r.pemo + " " + r.pname) + (r.isme ? " (toi)" : "") + "</td><td class=\"n today" + (r.today < 0 ? " none" : "") + "\">" + (r.today < 0 ? "—" : r.today + "/5") + "</td><td class=\"n\">" + r.week + "</td><td class=\"n\">" + r.total + "</td><td class=\"n\">" + r.played + "</td></tr>"; }).join("") +
      "</tbody></table>";
  }).catch(function (e) { $("ol-board").innerHTML = ""; olMsg(onlineError(e)); });
}
$("ol-tabs").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; store(OL_CUR_KEY, b.dataset.code); drawOnline(); });
$("ol-board").addEventListener("click", function (e) {
  var cur = store(OL_CUR_KEY), l = olLeagues.filter(function (x) { return x.lcode === cur; })[0];
  if (e.target.closest("#ol-invite") && l) { shareOrCopy(inviteText(l), function (m) { olMsg("Invitation copiée : colle-la sur WhatsApp, Insta ou par SMS.", true); }); return; }
  var sb = e.target.closest(".ol-sort button"); if (sb) { olSort = sb.dataset.s; drawOnline(); return; }
  if (e.target.closest("#ol-leave") && l) {
    if (!confirmInline(e.target, "Confirmer : quitter « " + l.lname + " » ?")) return;
    rpc("qp_leave_league", auth(onlineMe(), { p_code: l.lcode })).then(function () { olMsg("Tu as quitté la ligue.", true); renderOnline(); renderLeagueCard(); }).catch(function (er) { olMsg(onlineError(er)); });
  }
});
function confirmInline(btn, txt) { if (btn.dataset.armed) return true; btn.dataset.armed = "1"; var old = btn.textContent; btn.textContent = txt; setTimeout(function () { delete btn.dataset.armed; btn.textContent = old; }, 4000); return false; }
function afterJoin(name) {
  var d = store(DAILY_KEY); if (d && d.n === dayNum()) submitDailyOnline(d);
  renderOnline(); renderLeagueCard();
}
$("ol-create").addEventListener("click", function () {
  var nm = $("ol-new").value.trim(); if (!nm) { olMsg("Donne un nom à ta ligue."); return; }
  if (!profile().name) { olMsg("Choisis d’abord un pseudo dans « Ton profil »."); $("pf-name").focus(); return; }
  ensurePlayer().then(function (me) { return rpc("qp_create_league", auth(me, { p_name: nm })); })
    .then(function (code) { store(OL_CUR_KEY, code); $("ol-new").value = ""; olMsg("Ligue créée ! Code : " + code + ". Clique sur « Inviter des amis ».", true); afterJoin(); })
    .catch(function (e) { olMsg(onlineError(e)); });
});
function joinCode(code, msgFn) {
  return ensurePlayer().then(function (me) { return rpc("qp_join_league", auth(me, { p_code: code })); })
    .then(function (name) { store(OL_CUR_KEY, code.toUpperCase().trim()); afterJoin(name); return name; });
}
$("ol-join").addEventListener("click", function () {
  var code = $("ol-code").value.trim(); if (!code) { olMsg("Entre le code de la ligue."); return; }
  if (!profile().name) { olMsg("Choisis d’abord un pseudo dans « Ton profil »."); $("pf-name").focus(); return; }
  joinCode(code).then(function (n) { $("ol-code").value = ""; olMsg("Bienvenue dans « " + n + " » !", true); }).catch(function (e) { olMsg(onlineError(e)); });
});
$("ol-del").addEventListener("click", function (e) {
  if (!confirmInline(this, "Confirmer : tout supprimer (pseudo, scores, ligues) ?")) return;
  var me = onlineMe(); if (!me) return;
  rpc("qp_delete_player", auth(me)).then(function () { store(ONLINE_KEY, null); olMsg("Profil en ligne supprimé.", true); renderOnline(); renderLeagueCard(); }).catch(function (er) { olMsg(onlineError(er)); });
});
(function () { var raw = store(PROFILE_KEY); if (raw && raw.emo && EMOS.indexOf(raw.emo) < 0) { saveProfile(profile()); setTimeout(function () { if (typeof syncOnlineProfile === "function") syncOnlineProfile(); }, 1500); } })();
/* Invitation par lien : #ligue=CODE */
var pendingLeague = null;
function checkHashLeague() {
  var m = location.hash.match(/^#ligue=([A-Za-z0-9]{4,8})$/); if (!m) return false;
  history.replaceState(null, "", location.pathname + location.search);
  if (!sbOn()) return true;
  pendingLeague = m[1].toUpperCase(); show("setup"); window.scrollTo({ top: 0 });
  var pr = profile(); $("lgb-name").value = pr.name;
  $("lgb-emo").innerHTML = PORTF.map(function (x) { return "<option value=\"" + x[0] + "\"" + (x[0] === pr.emo ? " selected" : "") + ">" + x[0] + " " + x[1] + "</option>"; }).join("");
  $("lgb-msg").textContent = ""; $("lg-banner").hidden = false;
  rpc("qp_league_name", { p_code: pendingLeague }).then(function (n) {
    if (!n) { $("lgb-title").textContent = "Ligue introuvable"; $("lgb-sub").textContent = "Le code " + pendingLeague + " n’existe pas (ou plus)."; $("lgb-go").hidden = true; return; }
    $("lgb-title").textContent = "Invitation : ligue « " + n + " »"; $("lgb-go").hidden = false;
    $("lgb-sub").textContent = "Choisis ton pseudo et rejoins le classement du Défi du jour.";
  }).catch(function () {});
  return true;
}
$("lgb-go").addEventListener("click", function () {
  var nm = $("lgb-name").value.trim(); if (!nm) { $("lgb-msg").textContent = "Choisis un pseudo."; return; }
  saveProfile({ name: nm, emo: $("lgb-emo").value });
  var me = onlineMe(), up = me ? rpc("qp_update_player", auth(me, { p_name: nm, p_emo: $("lgb-emo").value })).catch(function () {}) : Promise.resolve();
  up.then(function () { return joinCode(pendingLeague); }).then(function (n) {
    $("lgb-title").textContent = "Bienvenue dans « " + n + " » !"; $("lgb-sub").textContent = "Fais le Défi du jour juste en dessous : ton score ira directement au classement.";
    $("lgb-go").hidden = true; $("lgb-msg").textContent = ""; pendingLeague = null;
    setTimeout(function () { $("lg-banner").hidden = true; $("daily").scrollIntoView({ behavior: "smooth", block: "center" }); }, 2200);
  }).catch(function (e) { $("lgb-msg").textContent = onlineError(e); });
});
$("lgb-x").addEventListener("click", function () { pendingLeague = null; $("lg-banner").hidden = true; });

function syncOnlineProfile() { var me = onlineMe(), pr = profile(); if (sbOn() && me && pr.name) rpc("qp_update_player", auth(me, { p_name: pr.name, p_emo: pr.emo })).then(renderOnline).catch(function () {}); }
$("pf-emos").addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; var pr = profile(); pr.emo = b.dataset.e; saveProfile(pr); renderProfile(); syncOnlineProfile(); });
function savePseudo() {
  var v = $("pf-name").value.trim(), out = $("pf-saved"), btn = $("pf-ok");
  if (!v) { out.textContent = "Écris un pseudo d’abord."; out.className = "pf-saved ko"; $("pf-name").focus(); return; }
  var pr = profile(); pr.name = v; saveProfile(pr); renderProfile(); syncOnlineProfile(); renderLeagueCard();
  out.textContent = "✓ C’est enregistré : tu t’appelles « " + profile().name + " ».";
  out.className = "pf-saved"; btn.textContent = "✓ Validé"; btn.classList.add("done");
  setTimeout(function () { btn.textContent = "Valider"; btn.classList.remove("done"); }, 2500);
}
$("pf-ok").addEventListener("click", savePseudo);
$("pf-name").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); savePseudo(); } });
$("pf-name").addEventListener("input", function () { $("pf-saved").textContent = this.value.trim() && this.value.trim() !== profile().name ? "Pense à cliquer sur « Valider »." : ""; $("pf-saved").className = "pf-saved ko"; });



/* ---------- Questions ---------- */
function balanced(pool, n) {
  var q = {}; pool.forEach(function (x) { (q[x.c] = q[x.c] || []).push(x); });
  var out = [], ids = Object.keys(q);
  while (out.length < n && ids.length) {
    var id = ids[Math.floor(Math.random() * ids.length)];
    out.push(q[id].pop());
    if (!q[id].length) ids.splice(ids.indexOf(id), 1);
  }
  return out;
}
function multiOptions(x, size) {
  var decoys = shuffle(ALL.filter(function (id) { return x.cs.indexOf(id) < 0; }));
  var n = Math.min(8, Math.max(size, x.cs.length + 3));
  return x.cs.concat(decoys.slice(0, n - x.cs.length)).sort(function (a, b) { return CBY[a].n - CBY[b].n; });
}
function optionsFor(x, conf) {
  if (conf.mode === "duel") return conf.duel.slice();
  if (conf.mode === "target") return C.filter(function (c) { return conf.targets.indexOf(c.id) >= 0; }).map(function (c) { return c.id; });
  var pool = conf.pool === "main" ? MAIN : ALL;
  if (conf.diff === "hard") return pool.slice();
  return shuffle(pool.filter(function (id) { return id !== x.c; })).slice(0, 3).concat([x.c]).sort(function (a, b) { return CBY[a].n - CBY[b].n; });
}
function buildQuestions(conf, onlyIds) {
  var only = function (x) { return !onlyIds || onlyIds.indexOf(x.id) >= 0; };
  if (conf.mode === "accord") {
    var acc = shuffle(SH.filter(only));
    acc.sort(function (a, b) { return (b.fou ? 1 : 0) - (a.fou ? 1 : 0); }); // les accords les plus improbables d'abord
    acc = shuffle(acc.slice(0, 9)).concat(shuffle(acc.slice(9)));
    return acc.map(function (x) { return { mid: x.id, type: "multi", opts: multiOptions(x, 6) }; });
  }
  if (conf.mode === "casier") {
    var ks = KASES.filter(only);
    return balanced(shuffle(ks), onlyIds ? ks.length : 10).map(function (x) {
      var dec = shuffle(ALL.filter(function (id) { return id !== x.c; })).slice(0, 3);
      return { mid: x.id, type: "pick", opts: dec.concat([x.c]).sort(function (a, b) { return CBY[a].n - CBY[b].n; }) };
    });
  }
  if (conf.mode === "conseil") {
    var im = shuffle(IMPM.filter(only));
    if (!onlyIds) im = im.slice(0, 10);
    return im.map(function (x) {
      if (x.cs.length > 1) return { mid: x.id, type: "multi", opts: multiOptions(x, 5) };
      var dec = shuffle(ALL.filter(function (id) { return id !== x.c; })).slice(0, 3);
      return { mid: x.id, type: "pick", opts: dec.concat([x.c]).sort(function (a, b) { return CBY[a].n - CBY[b].n; }) };
    });
  }
  if (conf.mode === "citations") {
    var qs = QUOTEM.filter(only), authors = Array.from(new Set(QUOTEM.map(function (x) { return x.c; }))).concat(MAIN);
    authors = Array.from(new Set(authors));
    return balanced(shuffle(qs), onlyIds ? qs.length : 10).map(function (x) {
      var dec = shuffle(authors.filter(function (id) { return id !== x.c; })).slice(0, 3);
      return { mid: x.id, type: "pick", opts: dec.concat([x.c]).sort(function (a, b) { return CBY[a].n - CBY[b].n; }) };
    });
  }
  if (conf.mode === "multi") {
    var n = conf.len === "all" ? M.length : parseInt(conf.len, 10);
    var sh = shuffle(SH.filter(only)), si = balanced(SINGLE.filter(only), onlyIds ? 9999 : n);
    var mix = onlyIds ? shuffle(sh.concat(si)) : shuffle(sh.slice(0, Math.ceil(n / 2)).concat(si.slice(0, n - Math.min(sh.length, Math.ceil(n / 2)))));
    return mix.map(function (x) { return { mid: x.id, type: "multi", opts: multiOptions(x, 5) }; });
  }
  if (conf.mode === "target" && conf.targets.length === 1) {
    var who = conf.targets[0];
    var mine = M.filter(function (x) { return x.cs.indexOf(who) >= 0 && only(x); });
    var others = SINGLE.filter(function (x) { return x.cs.indexOf(who) < 0 && only(x); });
    if (!onlyIds) others = shuffle(others).slice(0, Math.max(mine.length, 4));
    return shuffle(mine.concat(others)).map(function (x) { return { mid: x.id, type: "vf", who: who }; });
  }
  var pool;
  if (conf.mode === "duel") pool = SINGLE.filter(function (x) { return conf.duel.indexOf(x.c) >= 0; });
  else if (conf.mode === "target") pool = SINGLE.filter(function (x) { return conf.targets.indexOf(x.c) >= 0; });
  else { var ids = conf.pool === "main" ? MAIN : ALL; pool = SINGLE.filter(function (x) { return ids.indexOf(x.c) >= 0; }); }
  pool = shuffle(pool.filter(only));
  if (conf.mode === "duel" && !onlyIds) {
    var a = pool.filter(function (x) { return x.c === conf.duel[0]; }), b = pool.filter(function (x) { return x.c === conf.duel[1]; });
    var k = Math.min(10, Math.max(a.length, b.length));
    pool = shuffle(a.slice(0, k).concat(b.slice(0, k)));
  }
  if ((conf.mode === "classic" || conf.mode === "blitz") && !onlyIds && conf.len !== "all") pool = balanced(pool, conf.mode === "blitz" ? 60 : parseInt(conf.len, 10));
  return pool.map(function (x) { return { mid: x.id, type: "pick", opts: optionsFor(x, conf) }; });
}

/* ---------- Partie ---------- */
function startGame(qs, conf) {
  clearInterval(timerId); clearTimeout(autoId);
  game = { qs: qs, i: 0, answers: [], cfg: JSON.parse(JSON.stringify(conf)), pts: 0, streak: 0, fails: 0, bestStreak: 0, over: false };
  if (conf.mode === "blitz") { game.timeLeft = 60; startTimer(); }
  game.cheats = 3;
  shownPts = 0;
  show("game");
  renderQ();
  window.scrollTo({ top: 0, behavior: "auto" });
}
function startTimer() {
  $("g-barwrap").classList.add("timer");
  $("g-bar").style.width = "100%";
  timerId = setInterval(function () {
    game.timeLeft--;
    $("g-bar").style.width = Math.max(0, game.timeLeft / 60 * 100) + "%";
    $("g-prog").textContent = game.timeLeft + " s";
    if (game.timeLeft <= 0) { clearInterval(timerId); clearTimeout(autoId); finish(); }
  }, 1000);
}
var shownPts = 0;
function trailUpdate() {
  if (game.cfg.mode === "blitz") { $("g-trail").innerHTML = ""; return; }
  var html = "", from = game.qs.length <= 30 ? 0 : Math.max(0, game.i - 20), to = Math.min(game.qs.length, from + 30);
  for (var k = from; k < to; k++) {
    var a = game.answers[k], cls = a ? (a.ok ? "ok" : (a.type === "multi" && a.good ? "part" : "ko")) : (k === game.i ? "cur" : "");
    html += "<i class=\"" + cls + "\"></i>";
  }
  $("g-trail").innerHTML = html;
}
function hudUpdate() {
  trailUpdate();
  if (game.pts !== shownPts) { var el = $("g-pts"); countUp(el, game.pts, 450, shownPts); el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); shownPts = game.pts; }
  else $("g-pts").textContent = fmt(game.pts);
  var s = $("g-streak"); s.textContent = "Série ×" + game.streak; s.classList.toggle("hot", game.streak >= 3);
}
// ---- Le petit « i » : explication de la mesure (EXPL, expl.js), lexique et repères par thème ----
var GLOSS = [
  ["Smic", "Smic", "Le salaire minimum légal en France, revalorisé au moins une fois par an (le 1er janvier)."],
  ["RIC", "RIC", "Référendum d’initiative citoyenne : en réunissant assez de signatures, des citoyens déclenchent eux-mêmes un vote, par exemple pour proposer ou abroger une loi."],
  ["IFI", "IFI", "Impôt sur la fortune immobilière. Il a remplacé l’ISF en 2018 et ne taxe que le patrimoine immobilier au-delà de 1,3 million d’euros."],
  ["ISF", "ISF", "Impôt de solidarité sur la fortune, qui taxait l’ensemble du patrimoine des plus aisés. Supprimé en 2018 et remplacé par l’IFI."],
  ["EPR2?", "EPR2", "Nouveau modèle de réacteur nucléaire d’EDF. L’État a lancé la construction de six réacteurs de ce type."],
  ["UE", "UE", "Union européenne : 27 pays qui partagent un marché unique et des règles communes."],
  ["PIB", "PIB", "Produit intérieur brut : la richesse produite par le pays en un an. On s’en sert pour comparer dette ou dépenses (« 3 % du PIB »)."],
  ["PFAS", "PFAS", "Les « polluants éternels » : des substances chimiques (poêles, textiles, emballages…) qui ne se dégradent presque pas dans la nature."],
  ["ONU", "ONU", "Organisation des Nations unies. La France est l’un des cinq membres permanents de son Conseil de sécurité."],
  ["RSA", "RSA", "Revenu de solidarité active : une aide mensuelle pour les personnes sans ressources ou presque."],
  ["TVA", "TVA", "Taxe sur la valeur ajoutée, payée sur presque tout ce qu’on achète (20 % au taux normal). C’est la première recette de l’État."],
  ["CDI", "CDI", "Contrat à durée indéterminée : le contrat de travail « classique », sans date de fin."],
  ["CDD", "CDD", "Contrat à durée déterminée : un contrat de travail avec une date de fin."],
  ["PME", "PME", "Petites et moyennes entreprises : moins de 250 salariés."],
  ["TPE", "TPE", "Très petites entreprises : moins de 10 salariés."],
  ["EDF", "EDF", "Électricité de France, le principal producteur d’électricité, détenu à 100 % par l’État depuis 2023."],
  ["PAC", "PAC", "Politique agricole commune : les aides européennes aux agriculteurs, l’une des plus grosses dépenses de l’UE."],
  ["APL", "APL", "Aide personnalisée au logement, versée par la CAF pour alléger le loyer."],
  ["COP", "COP", "La conférence annuelle de l’ONU sur le climat, où les pays négocient leurs engagements."],
  ["AME", "AME", "Aide médicale de l’État : prise en charge des soins des étrangers en situation irrégulière, sous condition de ressources."],
  ["BTP", "BTP", "Bâtiment et travaux publics : le secteur de la construction."],
  ["UNRWA", "UNRWA", "Agence de l’ONU chargée de l’aide aux réfugiés palestiniens."],
  ["BCE", "BCE", "Banque centrale européenne : elle fixe les taux d’intérêt de la zone euro."],
  ["ONF", "ONF", "Office national des forêts : il gère les forêts publiques."],
  ["OFB", "OFB", "Office français de la biodiversité : établissement public qui contrôle notamment le respect des règles environnementales."],
  ["DPE", "DPE", "Diagnostic de performance énergétique : une note de A à G pour un logement. Les plus mal notés sont peu à peu interdits à la location."],
  ["A69", "A69", "Projet d’autoroute entre Toulouse et Castres, très contesté par des écologistes."],
  ["GPA", "GPA", "Gestation pour autrui : une femme porte l’enfant d’un autre couple. Interdite en France."],
  ["PMA", "PMA", "Procréation médicalement assistée. Ouverte en France à toutes les femmes depuis 2021."],
  ["SRU", "loi SRU", "Loi qui impose à de nombreuses communes d’avoir 20 à 25 % de logements sociaux, sous peine d’amende."],
  ["AESH", "AESH", "Accompagnants d’élèves en situation de handicap, qui les aident en classe."],
  ["NOTRe", "loi NOTRe", "Loi de 2015 qui a redistribué les compétences entre régions, départements et intercommunalités."],
  ["RFI", "RFI", "Radio France internationale, radio publique diffusée dans le monde entier."],
  ["CEDH", "CEDH", "Cour européenne des droits de l’homme (Strasbourg). Elle dépend du Conseil de l’Europe, pas de l’UE."],
  ["OMS", "OMS", "Organisation mondiale de la santé, agence de l’ONU."],
  ["SNU", "SNU", "Service national universel : un séjour de cohésion proposé aux 15-17 ans."],
  ["HLM", "HLM", "Habitations à loyer modéré : les logements sociaux."],
  ["OQTF", "OQTF", "Obligation de quitter le territoire français : décision qui ordonne à un étranger en situation irrégulière de partir."],
  ["ARS", "ARS", "Agences régionales de santé : elles organisent hôpitaux et soins dans chaque région."],
  ["OTAN", "OTAN", "Alliance militaire entre pays d’Amérique du Nord et d’Europe, dont la France fait partie."],
  ["ASPA", "ASPA", "Allocation de solidarité aux personnes âgées, le « minimum vieillesse »."],
  ["minimum vieillesse", "minimum vieillesse", "Revenu minimum garanti aux retraités qui ont de très petites pensions (ASPA)."],
  ["PEA", "PEA", "Plan d’épargne en actions : un placement en Bourse avec un avantage fiscal."],
  ["CSG", "CSG", "Contribution sociale généralisée : un prélèvement sur presque tous les revenus pour financer la Sécurité sociale."],
  ["SNCF", "SNCF", "Société nationale des chemins de fer, l’opérateur ferroviaire public."],
  ["Schengen", "Schengen", "L’espace européen sans contrôle aux frontières entre les pays membres."],
  ["Mercosur", "Mercosur", "Marché commun d’Amérique du Sud (Brésil, Argentine, Uruguay, Paraguay…). Un accord commercial avec l’UE inquiète les agriculteurs."],
  ["quinquennat", "quinquennat", "Mandat de cinq ans. Celui du président est passé de sept à cinq ans en 2000."],
  ["septennat", "septennat", "Mandat de sept ans, comme celui des présidents avant 2002."],
  ["proportionnelle", "proportionnelle", "Mode de scrutin où les sièges sont répartis selon le pourcentage de voix. Aujourd’hui, les députés sont élus un par circonscription."],
  ["référendum", "référendum", "Vote direct des citoyens sur un texte. En France, c’est le président qui peut le déclencher (articles 11 et 89 de la Constitution)."],
  ["Frexit", "Frexit", "Sortie de la France de l’Union européenne, sur le modèle du Brexit britannique."],
  ["Zucman", "taxe Zucman", "Impôt minimum de 2 % sur les patrimoines de plus de 100 millions d’euros, proposé par l’économiste Gabriel Zucman."],
  ["superprofits", "superprofits", "Bénéfices exceptionnels d’entreprises liés à une crise (énergie, guerre…), qu’on propose de taxer davantage."],
  ["laïcité", "laïcité", "Principe issu de la loi de 1905 : séparation des Églises et de l’État, neutralité religieuse de l’État."],
  ["49[.-]3", "49.3", "Article de la Constitution qui permet au gouvernement de faire adopter un texte sans vote, sauf si une motion de censure le renverse."],
  ["quotient familial", "quotient familial", "Mécanisme qui réduit l’impôt sur le revenu selon le nombre d’enfants à charge."],
  ["droit du sol", "droit du sol", "Un enfant né en France de parents étrangers peut devenir français, sous conditions de résidence, à sa majorité ou avant."],
  ["regroupement familial", "regroupement familial", "Droit d’un étranger en situation régulière de faire venir son conjoint et ses enfants mineurs, sous conditions de ressources et de logement."],
  ["rétention", "rétention", "Les centres de rétention enferment des étrangers en attente d’expulsion, pour une durée limitée."],
  ["peines? planchers?", "peines planchers", "Peines minimales obligatoires pour certains délits ou en cas de récidive. Elles ont existé de 2007 à 2014."],
  ["Parcoursup", "Parcoursup", "Plateforme nationale d’inscription dans l’enseignement supérieur après le bac."],
  ["carte scolaire", "carte scolaire", "Règle qui affecte chaque élève dans un collège ou un lycée selon son adresse."],
  ["rupture conventionnelle", "rupture conventionnelle", "Fin d’un CDI d’un commun accord entre salarié et employeur, qui ouvre droit au chômage."],
  ["franchises? médicales?", "franchises médicales", "Petite somme laissée à la charge du patient sur chaque boîte de médicaments ou acte médical."],
  ["intéressement", "intéressement", "Prime versée aux salariés selon les résultats de leur entreprise."],
  ["participation(?! publique)", "participation", "Part des bénéfices de l’entreprise redistribuée aux salariés (obligatoire à partir de 50 salariés)."],
  ["dividendes", "dividendes", "Part des bénéfices d’une entreprise versée à ses actionnaires."],
  ["Sécurité sociale", "Sécurité sociale", "Le système public qui couvre maladie, retraite, famille, accidents du travail. Financé surtout par les cotisations et la CSG."],
  ["droits de succession|succession|héritage", "droits de succession", "Impôt payé sur ce que l’on hérite. Il dépend du lien de parenté et du montant, après un abattement (100 000 € par enfant)."],
  ["niche", "niche fiscale", "Réduction d’impôt accordée pour encourager une dépense ou une activité (emploi à domicile, dons…)."],
  ["flat tax", "flat tax", "Le prélèvement forfaitaire unique : un taux unique, autour de 30 %, sur les revenus de l’épargne et des placements."],
  ["bouclier tarifaire", "bouclier tarifaire", "Plafonnement par l’État des hausses de prix de l’énergie, comme en 2022-2023."],
  ["cotisations", "cotisations", "Prélèvements sur les salaires qui financent la Sécu, le chômage et les retraites."],
  ["Constitution", "Constitution", "Le texte suprême de la Ve République (1958). La réviser demande un vote du Parlement réuni en Congrès ou un référendum."],
  ["Cades", "Cades", "Caisse d’amortissement de la dette sociale : elle rembourse peu à peu la dette accumulée par la Sécurité sociale."],
  ["Congrès", "Congrès", "Réunion des députés et des sénateurs à Versailles, notamment pour réviser la Constitution (majorité des 3/5 requise)."],
  ["Ve République", "Ve République", "Le régime politique actuel, fondé par la Constitution de 1958."],
  ["Code du travail", "Code du travail", "L’ensemble des règles qui encadrent les relations entre salariés et employeurs."],
  ["Sénat", "Sénat", "Seconde chambre du Parlement, élue au suffrage indirect par des élus locaux."],
  ["ENA", "ENA", "L’école qui formait les hauts fonctionnaires, remplacée en 2022 par l’Institut national du service public."],
  ["dette", "dette publique", "Ce que doivent l’État, la Sécu et les collectivités. Elle dépasse 110 % du PIB en France."],
  ["3 ?%", "3 %", "La règle européenne fixe le déficit public sous 3 % du PIB. La France est au-dessus depuis la crise du Covid."]
];
GLOSS.forEach(function (g) { g.re = new RegExp("(^|[^A-Za-zÀ-ÿ0-9])(" + g[0] + ")(?![A-Za-zÀ-ÿ0-9])", g[0] === g[0].toUpperCase() ? "" : "i"); });
var REPERE = {
  "Écologie": "La France s’est fixé la neutralité carbone en 2050 : ne pas émettre plus de gaz à effet de serre qu’elle n’en absorbe.",
  "Économie": "Entreprises, industrie, commerce, prix et pouvoir d’achat. Beaucoup de règles économiques se décident aussi à Bruxelles.",
  "Santé": "L’Assurance maladie rembourse une partie des soins, les mutuelles une autre. Les ARS organisent l’offre dans chaque région.",
  "Fiscalité": "Impôt sur le revenu, TVA, impôts sur le patrimoine et les successions… La TVA est la première recette de l’État.",
  "Travail": "Durée légale : 35 heures par semaine, au-delà ce sont des heures supplémentaires. Le Smic est le salaire minimum.",
  "Social": "Aides et minima sociaux (RSA, allocations, APL…), versés surtout par la CAF.",
  "Famille": "Allocations familiales, congés parentaux, garde d’enfants, quotient familial.",
  "Société": "Vie en commun et libertés : fin de vie, laïcité, droits, mœurs…",
  "Éducation": "École obligatoire de 3 à 16 ans, puis obligation de formation jusqu’à 18 ans.",
  "Culture": "Audiovisuel public, patrimoine, création, médias.",
  "Défense": "La France est membre de l’OTAN et dispose de la dissuasion nucléaire. Une loi de programmation fixe le budget des armées sur plusieurs années.",
  "Institutions": "Ve République (1958) : président élu pour 5 ans, deux mandats de suite au maximum. Le Parlement, c’est l’Assemblée nationale et le Sénat.",
  "Justice": "Tribunaux, peines, prisons. Les mineurs relèvent d’un code spécifique depuis 2021.",
  "Sécurité": "Police nationale en ville, gendarmerie en zone rurale, polices municipales sous l’autorité des maires.",
  "Logement": "Logement social (HLM), aides (APL), loyers, construction, rénovation.",
  "International": "La France est membre permanent du Conseil de sécurité de l’ONU. Diplomatie, aide au développement, conflits.",
  "Énergie": "L’électricité française vient majoritairement du nucléaire, produite surtout par EDF.",
  "Numérique": "Réseaux sociaux, IA, données, protection des mineurs en ligne. Beaucoup de règles se décident au niveau européen.",
  "Immigration": "Titres de séjour, asile, nationalité, expulsions. Une partie des règles vient du droit européen et de la CEDH.",
  "Transports": "Train, route, avion, transports en commun. La SNCF est l’opérateur ferroviaire public historique.",
  "Jeunesse": "Mesures pour les 15-25 ans : emploi, aides, engagement, service civique…",
  "Retraites": "Système par répartition : les cotisations des actifs paient les pensions des retraités. La réforme de 2023 relève l’âge légal de 62 à 64 ans.",
  "Agriculture": "Une grande partie des aides agricoles vient de la PAC européenne. Enjeux : revenus, prix, normes, accords commerciaux.",
  "Budget": "Dépenses et dette publiques. Les règles européennes demandent un déficit sous 3 % du PIB.",
  "Europe": "Traités, budget, règles communes de l’UE. Changer un traité demande l’accord des 27 pays."
};
function infoHtml(m) {
  var seen = {}, terms = [];
  GLOSS.forEach(function (g) { if (!seen[g[1]] && g.re.test(m.m)) { seen[g[1]] = 1; terms.push("<li><b>" + esc(g[1]) + "</b> : " + esc(g[2]) + "</li>"); } });
  var h = (typeof EXPL !== "undefined" && EXPL[m.m]) ? "<p class=\"ih\">En clair</p><p>" + esc(EXPL[m.m]) + "</p>" : "";
  if (terms.length) h += "<p class=\"ih\">Les mots à connaître</p><ul>" + terms.slice(0, 3).join("") + "</ul>";
  var rp = REPERE[m.t];
  if (rp) h += "<p class=\"ih\">Repère · " + esc(m.t) + "</p><p>" + esc(rp) + "</p>";
  return h;
}

function renderQ() {
  var q = game.qs[game.i], m = M[q.mid], n = game.qs.length, blitz = game.cfg.mode === "blitz";
  document.body.style.setProperty("--playbg", FIL_BG[game.i % FIL_BG.length]); $("v-game").classList.remove("leaving");
  if (!blitz) { $("g-barwrap").classList.remove("timer"); $("g-prog").textContent = (game.cfg.mode === "casier" ? "Dossier " : game.cfg.mode === "citations" ? "Citation " : game.cfg.mode === "conseil" ? "Saisine " : "Mesure ") + (game.i + 1) + " / " + n; $("g-bar").style.width = pct(game.i, n) + "%"; }
  else $("g-prog").textContent = game.timeLeft + " s";
  hudUpdate();
  var kase = !!m.kase;
  $("g-theme").textContent = kase ? (m.year && m.year !== "—" ? "Dossier · " + m.year : "Dossier") : m.quote ? "Citation · " + m.srcs[m.c].d : m.t;
  $("g-kind").hidden = !kase;
  if (m.imp) $("g-theme").textContent = "Le Conseil constitutionnel tousse";
  if (kase) { $("g-kind").textContent = m.t; $("g-kind").className = "kind " + m.kind; }
  $("g-notice").hidden = game.cfg.mode !== "casier";
  var card = $("g-card"); card.classList.remove("enter", "shake"); void card.offsetWidth; card.classList.add("enter");
  $("g-text").textContent = kase ? m.m : "« " + m.m + " »";
  $("g-src").hidden = true; $("g-src").innerHTML = "";
  $("g-stamp").hidden = true; $("g-toast").hidden = true;
  $("g-next").hidden = true; $("g-validate").hidden = true;
  $("g-keys").hidden = blitz;
  game.sel = [];
  $("g-hint").hidden = true; $("g-hint").innerHTML = "";
  $("g-pre").hidden = !m.quote; $("g-pre").innerHTML = m.quote ? "<b>Le contexte</b> " + esc(m.pre) : "";
  var ih = (!kase && !m.quote) ? infoHtml(m) : "";
  $("g-info").hidden = !ih; $("g-info").setAttribute("aria-expanded", "false"); $("g-infobox").hidden = true; $("g-infobox").innerHTML = ih;
  updCheat();
  var keys = "123456789";
  if (q.type === "vf") {
    var w = CBY[q.who];
    $("g-ask").textContent = "Est-ce que " + w.name + " propose cette mesure ?";
    $("g-opts").innerHTML = "<div class=\"vf\"><button type=\"button\" id=\"vf-yes\" data-v=\"yes\">Oui, c’est " + esc(last(w.name)) + "</button><button type=\"button\" id=\"vf-no\" data-v=\"no\">Non, ce n’est pas " + esc(last(w.name)) + "</button></div>";
  } else if (q.type === "multi") {
    $("g-ask").textContent = m.imp ? "Qui propose cette mesure ? Attention, ils sont parfois plusieurs." : game.cfg.mode === "accord" ? "Qui est d’accord sur ce point ? Sélectionne tous ceux qui le proposent." : "Qui propose cette mesure ? Il peut y en avoir un seul, ou plusieurs.";
    $("g-opts").innerHTML = "<div class=\"boards\">" + q.opts.map(function (cid, k) {
      return boardHtml(CBY[cid], "button", "id=\"opt-" + cid + "\" data-c=\"" + cid + "\" aria-pressed=\"false\" aria-label=\"" + esc(CBY[cid].name) + "\"", k < 9 ? keys[k] : "");
    }).join("") + "</div>";
    $("g-validate").hidden = false; $("g-validate").disabled = true;
  } else {
    $("g-ask").textContent = m.imp ? "Qui propose cette mesure ?" : game.cfg.mode === "casier" ? "À quel candidat appartient ce dossier ?" : game.cfg.mode === "citations" ? "Qui a dit ça ?" : (game.cfg.mode === "duel" ? "Lequel des deux propose cette mesure ?" : "Qui propose cette mesure ?");
    $("g-opts").innerHTML = "<div class=\"boards" + (q.opts.length === 2 ? " two" : "") + "\">" + q.opts.map(function (cid, k) {
      return boardHtml(CBY[cid], "button", "id=\"opt-" + cid + "\" data-c=\"" + cid + "\" aria-label=\"" + esc(CBY[cid].name) + "\"", k < 9 ? keys[k] : "");
    }).join("") + "</div>";
  }
  var bx = $("g-opts").querySelector(".boards"); if (bx) stagger(bx);
  game.qStart = Date.now();
  if (game.answers[game.i]) reveal(game.answers[game.i], false);
}
function score(a, base, secs) {
  if (a.ok) {
    game.streak++; game.fails = 0; game.bestStreak = Math.max(game.bestStreak, game.streak);
    var streakB = Math.min(150, 25 * (game.streak - 1)), speedB = secs < 4 ? 50 : (secs < 8 ? 25 : 0);
    a.gain = base + streakB + speedB; a.detail = { streak: streakB, speed: speedB };
  } else { game.streak = 0; game.fails++; a.gain = a.partial || 0; }
  if (game.qs[game.i].cheat) { a.gain = Math.round(a.gain / 2); a.cheated = true; }
  game.pts += a.gain;
}
$("g-opts").addEventListener("click", function (e) {
  var b = e.target.closest("button"); if (!b || b.disabled || !game || game.over || game.answers[game.i]) return;
  var q = game.qs[game.i], m = M[q.mid], a, secs = (Date.now() - game.qStart) / 1000;
  if (q.type === "multi") {
    var id = b.dataset.c, k = game.sel.indexOf(id);
    if (k >= 0) game.sel.splice(k, 1); else game.sel.push(id);
    b.setAttribute("aria-pressed", k < 0);
    $("g-validate").disabled = game.sel.length === 0;
    return;
  }
  if (q.type === "vf") { var yes = b.dataset.v === "yes"; a = { mid: q.mid, pick: yes ? q.who : "other", ok: yes === (m.cs.indexOf(q.who) >= 0), type: "vf", who: q.who }; }
  else a = { mid: q.mid, pick: b.dataset.c, ok: b.dataset.c === m.c, type: "pick" };
  var base = (game.cfg.diff === "hard" && (game.cfg.mode === "classic" || game.cfg.mode === "blitz")) ? 150 : 100;
  score(a, base, secs);
  game.answers[game.i] = a;
  reveal(a, true);
  if (game.cfg.mode === "blitz") autoId = setTimeout(next, a.ok ? 650 : 1300);
});
$("g-validate").addEventListener("click", validateMulti);
function validateMulti() {
  if (!game || game.over || game.answers[game.i] || !game.sel.length) return;
  var q = game.qs[game.i], m = M[q.mid], secs = (Date.now() - game.qStart) / 1000;
  var good = game.sel.filter(function (id) { return m.cs.indexOf(id) >= 0; }).length, bad = game.sel.length - good;
  var a = { mid: q.mid, picks: game.sel.slice(), ok: good === m.cs.length && bad === 0, type: "multi", good: good, bad: bad };
  if (!a.ok) a.partial = Math.max(0, 40 * good - 30 * bad);
  score(a, 100 + 40 * (m.cs.length - 1), secs);
  game.answers[game.i] = a;
  reveal(a, true);
}
function reveal(a, animate) {
  var q = game.qs[game.i], m = M[q.mid];
  var st = $("g-stamp");
  st.textContent = m.imp ? (a.ok ? pick(["Bien vu", "Saisine juste", "Recevable"]) : pick(["Irrecevable", "Recalé", "Hors sujet"])) : m.quote ? (a.ok ? pick(["Bien entendu", "Cité juste", "Verbatim"]) : pick(["Hors micro", "Mal cité", "Faux témoin"])) : m.kase ? (a.ok ? pick(["Bien vu", "Exact", "Dossier bouclé"]) : pick(["Raté", "Mauvais dossier", "Classé faux"])) : a.ok ? (m.fou ? "C’est fou" : pick(STAMP_OK)) : (a.type === "multi" && a.good ? "Ballottage" : pick(STAMP_KO));
  st.className = "stamp " + (a.ok ? "ok" : "ko") + (animate ? " thump" : "");
  st.hidden = false;
  $("g-validate").hidden = true;
  updCheat();
  if (q.type === "vf") {
    var truth = m.cs.indexOf(q.who) >= 0;
    $("vf-yes").disabled = true; $("vf-no").disabled = true;
    (truth ? $("vf-yes") : $("vf-no")).classList.add("is-ok");
    if (!a.ok) (truth ? $("vf-no") : $("vf-yes")).classList.add("is-ko");
  } else {
    var picked = a.type === "multi" ? a.picks : [a.pick];
    q.opts.forEach(function (cid) {
      var el = $("opt-" + cid); if (!el) return;
      el.disabled = true;
      var right = m.cs.indexOf(cid) >= 0, chosen = picked.indexOf(cid) >= 0;
      if (right && chosen) el.classList.add("is-ok", "flash");
      else if (right) el.classList.add(a.type === "multi" ? "is-miss" : "is-ok");
      else if (chosen) el.classList.add("is-ko");
      else el.classList.add("dim");
    });
  }
  var parts = [], who = names(m.cs) + (m.cs.length === 1 ? " (" + CBY[m.c].party + ")" : "");
  var head = a.ok ? (m.cs.length > 1 ? "Exact : " + who + " le proposent tous." : "Exact : " + who + ".") :
    (a.type === "multi" ? (m.cs.length > 1 ? "Réponse : " + who + " le proposent." : "Réponse : seulement " + who + ".") + (a.good ? " Vous en aviez " + a.good + " sur " + m.cs.length + (a.bad ? ", plus " + plural(a.bad, "intrus", "intrus") : "") + "." : "") : "C’était " + who + ".");
  var gainTxt = a.gain ? " <span class=\"gain\">+" + a.gain + " pts" + (a.ok ? bonusTxt(a.detail) : " (consolation)") + "</span>" : "";
  parts.push("<span class=\"verdict " + (a.ok ? "ok" : "ko") + "\">" + esc(head) + gainTxt + (m.fou ? "<span class=\"fou\">Accord improbable</span>" : "") + "</span>");
  if (m.kase) parts.push("<span class=\"status\">Statut : " + esc(m.status) + "</span>");
  if (m.quote) parts.push("<span class=\"status\">Qui et quand : " + esc(m.ctx) + "</span>");
  if (m.imp) { $("g-kind").hidden = false; $("g-kind").textContent = m.verdict; $("g-kind").className = "kind imp"; parts.push("<span class=\"status\">L’obstacle : " + esc(m.obstacle) + "</span>"); }
  if (game.cfg.mode !== "blitz") {
    var quip = m.imp ? pick(QUIP_IMP) : m.kase ? (a.ok ? pick(QUIP_CASE_OK) : pick(QUIP_CASE_KO)) : m.quote ? (a.ok ? pick(QUIP_QUOTE_OK) : pick(QUIP_QUOTE_KO)) : m.fou ? pick(QUIP_FOU) : (a.ok ? pick(QUIP_OK) : (a.type === "multi" && a.good ? pick(QUIP_PARTIAL) : pick(QUIP_KO)));
    parts.push("<span class=\"quip\">" + esc(quip) + "</span>");
  }
  if (m.imp) { var so = m.srcs[m.c]; parts.push("<span>Source de l’obstacle : <a href=\"" + esc(so.u) + "\" target=\"_blank\" rel=\"noopener\">" + esc(so.s) + " ↗</a> · " + esc(so.d) + "</span>"); }
  else parts.push("<span>" + srcHtml(m) + "</span>");
  if (!special(m) && m.cs.length === 1) parts.push("<span class=\"memo\">Antisèche : " + esc(CBY[m.c].name) + " · " + esc(FAMILY[m.c]) + " · " + esc(CBY[m.c].party) + " · " + plural(countAll(m.c), "mesure", "mesures") + " dans le quiz</span>");
  if (a.cheated) parts.push("<span class=\"memo\">Antisèche utilisée : points divisés par deux.</span>");
  var rl = reportLink(m); if (rl) parts.push("<span>" + rl + "</span>");
  $("g-src").innerHTML = parts.join("");
  $("g-src").hidden = false;
  if (animate) {
    var toast = a.ok ? STREAK_TOAST[game.streak] : FAIL_TOAST[game.fails];
    if (toast) { $("g-toast").textContent = toast; $("g-toast").hidden = false; }
    if (a.gain) floatGain("+" + a.gain);
    if (!a.ok) { var cd2 = $("g-card"); cd2.classList.remove("enter", "shake"); void cd2.offsetWidth; cd2.classList.add("shake"); }
    if (a.ok && STREAK_TOAST[game.streak]) confetti(40);
    react(a, m);
  }
  hudUpdate();
  if (game.cfg.mode !== "blitz") {
    var nx = $("g-next");
    nx.textContent = game.i + 1 < game.qs.length ? (m.kase ? "Dossier suivant →" : m.quote ? "Citation suivante →" : m.imp ? "Saisine suivante →" : "Mesure suivante →") : "Voir mon résultat →";
    nx.hidden = false;
    if (animate) nx.focus({ preventScroll: true });
  }
}
function bonusTxt(d) { if (!d) return ""; var b = []; if (d.streak) b.push("série +" + d.streak); if (d.speed) b.push("rapidité +" + d.speed); return b.length ? " (" + b.join(", ") + ")" : ""; }
$("g-next").addEventListener("click", next);

/* ---------- Réactions animées après chaque réponse ---------- */
var R_OK = [["👏", "Propre.", "Tu lis les programmes, toi."], ["😎", "Facile.", "Trop facile, même."], ["🎯", "Dans le mille.", "Le QG peut t’embaucher."], ["🧠", "Cerveau.", "Tu révises en cachette ?"], ["✅", "Validé.", "Le Conseil constitutionnel approuve."], ["🤌", "Parfait.", "Rien à redire."]];
var R_FIRE = { 3: ["🔥", "En feu !", "Trois d’affilée."], 5: ["🤯", "Inarrêtable.", "Cinq de suite, respect."], 8: ["🚀", "Décollage.", "Huit d’affilée !"], 10: ["🏆", "Légende.", "Dix sans faute."], 15: ["👑", "Majesté.", "Tu devrais te présenter."] };
var R_KO_EMO = ["😤", "🙄", "😒", "🤨", "😮‍💨", "😩"];
var R_KO_TXT = ["Le QG de {X} soupire.", "Quelque part, {X} fronce les sourcils.", "Aïe, l’équipe de {X} a tout vu.", "{X} va devoir distribuer plus de tracts.", "Le community manager de {X} est en PLS.", "Raté : c’était {X}. Ça pique."];
var reactT = null;
function hideReact() { var r = $("g-react"); clearTimeout(reactT); if (!r.hidden) { r.classList.remove("in"); r.hidden = true; } }
function react(a, m) {
  if (!game || game.cfg.mode === "blitz" && a.ok && !R_FIRE[game.streak]) return;
  var r = $("g-react"), h, cls;
  if (a.ok) {
    var f = R_FIRE[game.streak], o = f || pick(R_OK); cls = f ? "fire" : "ok";
    h = "<span class=\"r-emo\">" + o[0] + "</span><span class=\"r-txt\"><b>" + esc(o[1]) + "</b><span>" + esc(o[2]) + "</span></span>";
  } else {
    var c = CBY[m.c], nm = m.cs.length > 1 ? names(m.cs) : c.name; cls = "ko";
    h = "<span class=\"r-ava\" style=\"--fam:" + (FAMCOL[FAMILY[c.id]] || "#888") + "\">" + esc(c.ini) + "<em>" + pick(R_KO_EMO) + "</em></span><span class=\"r-txt\"><b>" + esc(pick(["Raté !", "Aïe.", "Perdu !", "Oups."])) + "</b><span>" + esc(pick(R_KO_TXT).replace("{X}", nm)) + "</span></span>";
  }
  clearTimeout(reactT);
  r.className = "react " + cls; r.innerHTML = h; r.hidden = false; void r.offsetWidth; r.classList.add("in");
  reactT = setTimeout(function () { r.classList.add("out"); reactT = setTimeout(function () { r.hidden = true; r.classList.remove("in", "out"); }, 300); }, game.cfg.mode === "blitz" ? 900 : 2200);
}
/* Swipe vers le haut pour passer à la suivante */
(function () {
  var y0 = null, t0 = 0;
  $("v-game").addEventListener("touchstart", function (e) { y0 = e.touches[0].clientY; t0 = Date.now(); }, { passive: true });
  $("v-game").addEventListener("touchend", function (e) {
    if (y0 === null || !game || !game.answers[game.i] || game.cfg.mode === "blitz") { y0 = null; return; }
    var dy = e.changedTouches[0].clientY - y0; y0 = null;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    if (dy < -70 && Date.now() - t0 < 600 && atBottom) next();
  }, { passive: true });
  var wl = 0;
  window.addEventListener("wheel", function (e) {
    if (!game || !document.body.classList.contains("playing") || !game.answers[game.i] || game.cfg.mode === "blitz") return;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
    if (e.deltaY > 30 && atBottom && Date.now() - wl > 900) { wl = Date.now(); next(); }
  }, { passive: true });
})();

function next() {
  if (!game || game.over || !game.answers[game.i]) return;
  if (game.leaving) return;
  if (game.cfg.mode !== "blitz" && !REDUCED) {
    game.leaving = true; $("v-game").classList.add("leaving"); hideReact();
    var gg = game;
    setTimeout(function () { if (game === gg) { game.leaving = false; advance(); } }, 200);
    return;
  }
  advance();
}
function advance() {
  hideReact();
  game.i++;
  if (game.i >= game.qs.length) {
    if (game.cfg.mode === "blitz") game.qs = game.qs.concat(buildQuestions(game.cfg));
    else { finish(); return; }
  }
  renderQ();
}
$("g-quit").addEventListener("click", function () {
  clearInterval(timerId); clearTimeout(autoId);
  if (game && game.answers.filter(Boolean).length > 0) finish();
  else goMenu();
});
document.addEventListener("keydown", function (e) {
  if (views.game.hidden || !game || game.over) return;
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "SELECT")) return;
  var q = game.qs[game.i], answered = !!game.answers[game.i];
  if (e.key === "Enter" || e.key === " ") {
    if (document.activeElement && /^(g-next|g-validate)$/.test(document.activeElement.id)) return;
    if (!answered && q.type === "multi") { e.preventDefault(); validateMulti(); return; }
    if (answered && game.cfg.mode !== "blitz") { e.preventDefault(); next(); }
    return;
  }
  if (answered) return;
  var k = "123456789".indexOf(e.key);
  if (k < 0) return;
  if (q.type === "vf") { if (k === 0) $("vf-yes").click(); if (k === 1) $("vf-no").click(); }
  else if (q.opts[k]) $("opt-" + q.opts[k]).click();
});

/* ---------- Antisèche en jeu ---------- */
function updCheat() {
  var b = $("g-cheat"), q = game.qs[game.i], answered = !!game.answers[game.i];
  $("g-cheat-n").textContent = "×" + game.cheats;
  var maxLvl = q.type === "pick" && q.opts.length > 2 ? 2 : 1;
  b.disabled = answered || game.cheats <= 0 || (q.cheat || 0) >= maxLvl;
  b.firstChild.textContent = q.cheat ? "Encore un indice " : "Antisèche ";
}
$("g-cheat").addEventListener("click", function () {
  if (!game || game.over || game.answers[game.i] || game.cheats <= 0) return;
  var q = game.qs[game.i], m = M[q.mid], lvl = (q.cheat || 0) + 1, h = $("g-hint");
  if (lvl === 1) {
    var fams = Array.from(new Set(m.cs.map(function (c) { return FAMILY[c]; })));
    if (q.type === "multi") h.innerHTML = "<b>Antisèche :</b> " + plural(m.cs.length, "candidat propose", "candidats proposent") + " cette mesure (" + esc(fams.join(", ")) + ").";
    else if (q.type === "vf") h.innerHTML = "<b>Antisèche :</b> l’auteur de cette mesure est classé « " + esc(FAMILY[m.c]) + " ».";
    else h.innerHTML = "<b>Antisèche :</b> cherchez du côté « " + esc(FAMILY[m.c]) + " ».";
  } else {
    var wrong = shuffle(q.opts.filter(function (id) { return id !== m.c; })), keep = q.opts.length > 4 ? 1 : 1;
    var drop = wrong.slice(0, wrong.length - keep);
    drop.forEach(function (id) { var el = $("opt-" + id); if (el) { el.disabled = true; el.classList.add("dim"); } });
    h.innerHTML += " <b>Et en bonus :</b> il ne reste que deux panneaux possibles.";
  }
  q.cheat = lvl; game.cheats--; h.hidden = false;
  updCheat();
});

/* ---------- Fiches antisèches ---------- */
var FAMCOL = { "Extrême gauche": "#b3261e", "Gauche radicale": "#d0342c", "Gauche (communiste)": "#c62828", "Gauche": "#e0554f", "Gauche sociale-démocrate": "#e57373", "Écologistes": "#17784a", "Sans étiquette": "#8a5cc7", "Centre (camp présidentiel)": "#e8a400", "Centre droit": "#4f6bd8", "Droite": "#000091", "Droite souverainiste": "#2b3a8f", "Souverainistes (Frexit)": "#5a6478", "Souverainistes": "#7a8295", "Extrême droite": "#13203a" };
function renderCheat() {
  $("cheat-grid").innerHTML = C.map(function (c) {
    var mine = M.filter(function (x) { return !special(x) && x.cs.indexOf(c.id) >= 0; });
    var th = {}; mine.forEach(function (x) { th[x.t] = (th[x.t] || 0) + 1; });
    var top = Object.keys(th).sort(function (a, b) { return th[b] - th[a]; }).slice(0, 3);
    var picks = mine.filter(function (x) { return !x.shared; });
    var step = Math.max(1, Math.floor(picks.length / 3)), ex = [0, 1, 2].map(function (k) { return picks[k * step]; }).filter(Boolean);
    return "<article class=\"card fiche\" style=\"--fam:" + (FAMCOL[FAMILY[c.id]] || "var(--accent)") + "\"><h3><span class=\"num\">" + c.n + "</span>" + esc(c.name) + "</h3>" +
      "<span class=\"fam\">" + esc(c.party) + " · " + esc(FAMILY[c.id]) + " · " + plural(mine.length, "mesure", "mesures") + "</span>" +
      (SOON[c.id] ? "<span class=\"soonx\">À venir : " + esc(SOON[c.id]) + "</span>" : "") +
      "<div class=\"tags\">" + top.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" +
      "<ul>" + ex.map(function (x) { return "<li>" + esc(x.m) + "</li>"; }).join("") + "</ul>" +
      "<button type=\"button\" class=\"btn\" data-rev=\"" + c.id + "\">Réviser " + esc(last(c.name)) + " →</button></article>";
  }).join("");
}
$("cheat-grid").addEventListener("click", function (e) {
  var b = e.target.closest("button[data-rev]"); if (!b) return;
  cfg.mode = "target"; cfg.targets = [b.dataset.rev];
  startGame(buildQuestions(cfg), cfg);
});

/* ---------- Résultats ---------- */
function tier(p) {
  if (p >= 90) return { label: "Spin doctor", text: "Vous connaissez les programmes mieux que certains de leurs auteurs. Les cellules riposte des partis cherchent déjà votre numéro." };
  if (p >= 75) return { label: "Éditorialiste du dimanche soir", text: "Vous situez presque tout. Encore deux ou trois confusions et vous aurez votre rond de serviette sur les plateaux." };
  if (p >= 55) return { label: "Électeur éclairé", text: "Solide. Quelques candidats se ressemblent encore à vos yeux : regardez vos confusions ci-dessous." };
  if (p >= 35) return { label: "Spectateur du 20 heures", text: "Les grandes lignes sont là, les détails beaucoup moins. L’onglet « Toutes les mesures » vous tend les bras." };
  if (p >= 15) return { label: "Lecteur de tracts en diagonale", text: "Vous avez vu passer des affiches, c’est un début. Le reste viendra en jouant." };
  return { label: "Champion du pile ou face", text: "Pour l’instant, un dé à six faces ferait à peu près aussi bien. Bonne nouvelle : c’est en jouant qu’on apprend, et chaque mesure a sa source." };
}
function found(a, id) { // le joueur a-t-il bien associé ce candidat à la mesure ?
  if (a.type === "multi") return a.picks.indexOf(id) >= 0;
  return a.ok;
}

/* ---------- Mes stats : quel candidat je connais le mieux ---------- */
var TEAM = {
  melenchon: "Ta mission : régler les hologrammes avant chaque meeting.",
  lepen: "Ta mission : nourrir les chats du QG pendant les déplacements.",
  philippe: "Ta mission : animer les réunions d’appartement (bière fraîche fournie).",
  attal: "Ta mission : trouver la prochaine formule choc en trois mots.",
  glucksmann: "Ta mission : recompter les voix de la primaire. Toutes. Encore.",
  retailleau: "Ta mission : traduire les discours en vendéen et inversement.",
  zemmour: "Ta mission : ranger la bibliothèque de campagne (il y en a beaucoup).",
  tondelier: "Ta mission : entretenir la garde-robe verte.",
  ruffin: "Ta mission : boucler le prochain numéro du journal de campagne.",
  roussel: "Ta mission : tenir le barbecue à la Fête de l’Huma.",
  bertrand: "Ta mission : faire visiter les Hauts-de-France à toute la presse.",
  lisnard: "Ta mission : dérouler le tapis rouge à chaque meeting.",
  dupont: "Ta mission : conduire le camping-car de la 4e campagne. Le GPS connaît déjà la route.",
  asselineau: "Ta mission : relire tous les articles des traités européens, un par un.",
  philippot: "Ta mission : porter le drapeau en tête de cortège.",
  polony: "Ta mission : relire l’éditorial avant publication.",
  arthaud: "Ta mission : distribuer les tracts à 6 h devant l’usine.",
  kazib: "Ta mission : tenir le mégaphone en manif.",
  batho: "Ta mission : veiller sur les ruches du QG.",
  branco: "Ta mission : préparer les plaidoiries de la campagne.",
  riner: "Ta mission : porter le kimono de rechange à chaque meeting."
};
var STATS_KEY = "qui2027-stats";
function getStats() { var s = store(STATS_KEY); return s && s.c ? s : { c: {}, g: 0, q: 0 }; }
function tallyStats(ans, s) {
  ans.forEach(function (a) {
    var m = M[a.mid];
    m.cs.forEach(function (id) { var x = s.c[id] || [0, 0]; x[1]++; if (found(a, id)) x[0]++; s.c[id] = x; });
  });
  return s;
}
function recordStats(ans) {
  if (!ans.length) return;
  var s = tallyStats(ans, getStats());
  s.g++; s.q += ans.length; store(STATS_KEY, s);
}
// Résultat d’une seule partie (pas le cumul)
function gameStats(ans) { return tallyStats(ans, { c: {}, g: 1, q: ans.length }); }
function ranking(s, min) {
  return C.filter(function (c) { return s.c[c.id] && s.c[c.id][1] >= (min || 1); }).map(function (c) {
    var x = s.c[c.id]; return { c: c, a: x[0], b: x[1], sc: (x[0] + 1) / (x[1] + 2), r: Math.random() };
  }).sort(function (x, y) { return y.sc - x.sc || y.b - x.b || x.r - y.r; });
}
function gameRank(s) { var rk = ranking(s, 2); return rk.length ? rk : ranking(s, 1); }
function teamHtml(s, one) {
  var rk = one ? gameRank(s) : ranking(s, 3);
  if (!rk.length) return "<p class=\"team-empty\">" + (one ? "Pas assez de réponses dans cette partie pour te trouver une équipe de campagne." : "Joue encore un peu : il faut au moins 3 réponses sur un candidat pour savoir dans quelle équipe de campagne on t’embauche.") + "</p>";
  var b = rk[0], w = rk[rk.length - 1], p = pct(b.a, b.b);
  var h = "<div class=\"team-badge\" style=\"--fam:" + (FAMCOL[FAMILY[b.c.id]] || "var(--accent)") + "\"><span class=\"ini\">" + esc(b.c.ini) + "</span><span class=\"tag\">Team " + esc(last(b.c.name)) + "</span></div>" +
    "<div class=\"team-txt\"><p class=\"t1\">" + (one ? "Sur cette partie, le candidat que tu as le mieux reconnu : <b>" : "Toutes parties confondues, le candidat que tu connais le mieux : <b>") + esc(b.c.name) + "</b> (" + p + " % de bonnes réponses sur " + b.b + ").</p>" +
    "<p class=\"t2\">Félicitations, tu fais désormais partie de la team de campagne. " + esc(TEAM[b.c.id] || "Ta mission : tenir le stand de tracts au marché.") + "</p>";
  if (rk.length > 1 && w.c.id !== b.c.id) h += "<p class=\"t3\">" + (one ? "Celui qui t’a le plus piégé·e : " : "Celui que tu connais le moins : ") + esc(w.c.name) + " (" + pct(w.a, w.b) + " %). Un café avec son programme s’impose.</p>";
  return h + "<p class=\"t4\">Connaître un programme, ce n’est pas le soutenir. Promis, on ne t’enverra pas de carte d’adhérent.</p></div>";
}
function renderStats() {
  var s = getStats(), rk = ranking(s, 1);
  $("st-sum").textContent = s.g ? plural(s.g, "partie jouée", "parties jouées") + " · " + plural(s.q, "réponse", "réponses") + " · " + plural(rk.length, "candidat rencontré", "candidats rencontrés") : "Aucune partie pour l’instant. Lance une partie, tes stats se rempliront toutes seules.";
  $("st-team").innerHTML = teamHtml(s);
  $("st-rows").innerHTML = rk.length ? rk.map(function (o) { return rowHtml({ l: o.c.name, a: o.a, b: o.b }); }).join("") : "";
  $("st-reset").hidden = !s.g;
  renderProfile(); renderOnline();
}
$("st-reset").addEventListener("click", function () { store(STATS_KEY, { c: {}, g: 0, q: 0 }); renderStats(); });
$("st-play").addEventListener("click", function () { goMenu(); });

/* ---------- Nous écrire ---------- */
var ctFrom = "setup";
function openContact(prefill) {
  clearInterval(timerId); clearTimeout(autoId);
  ctFrom = game && !game.over ? "game" : (views.res && !views.res.hidden ? "res" : "setup");
  if (prefill) { $("ct-type").value = "Signaler une erreur"; $("ct-msg").value = prefill; }
  $("ct-status").textContent = ""; $("ct-status").className = "ct-status";
  show("contact"); window.scrollTo({ top: 0 }); setTimeout(function () { $("ct-msg").focus(); }, 50);
}
document.addEventListener("click", function (e) {
  var b = e.target.closest("[data-report]"); if (!b) return;
  var m = M[+b.dataset.report];
  openContact("À propos de : « " + m.m + " » (n°" + m.id + ")\n\nCe qui ne va pas : ");
});
$("ft-contact").addEventListener("click", function () { openContact(); });
$("ft-legal").addEventListener("click", function () { var d = $("legal"); d.open = true; d.scrollIntoView({ behavior: "smooth" }); });
$("ct-back").addEventListener("click", function () { goMenu(); });
$("ct-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var msg = $("ct-msg").value.trim(), mail = $("ct-mail").value.trim(), st = $("ct-status");
  if ($("ct-hp").value) return;
  if (msg.length < 5) { st.textContent = "Ton message est un peu court."; st.className = "ct-status ko"; return; }
  if (mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { st.textContent = "Cette adresse e-mail a l’air incomplète."; st.className = "ct-status ko"; return; }
  $("ct-send").disabled = true; st.textContent = "Envoi…"; st.className = "ct-status";
  var payload = { _subject: "[Qui a proposé ça] " + $("ct-type").value, sujet: $("ct-type").value, message: msg, _template: "table" };
  if (mail) { payload.email = mail; payload._replyto = mail; }
  fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) })
    .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && String(j.success) !== "false"; }); })
    .then(function (ok) {
      if (ok) { st.textContent = "Message envoyé, merci ! On lit tout."; st.className = "ct-status ok"; $("ct-msg").value = ""; }
      else { st.textContent = "L’envoi n’a pas marché. Écris-nous directement à " + CONTACT_EMAIL + "."; st.className = "ct-status ko"; }
    })
    .catch(function () { st.textContent = "Pas de connexion ? Écris-nous à " + CONTACT_EMAIL + "."; st.className = "ct-status ko"; })
    .then(function () { $("ct-send").disabled = false; });
});
function finish() {
  clearInterval(timerId); clearTimeout(autoId); hideReact();
  game.over = true;
  var ans = game.answers.filter(Boolean);
  recordStats(ans);
  var total = ans.length, sc = ans.filter(function (a) { return a.ok; }).length, p = pct(sc, total), t = tier(p);
  afterGame(ans, sc, total);
  var key = modeKey(game.cfg);
  game.result = { pts: game.pts, score: sc, total: total, pct: p, label: t.label, streak: game.bestStreak };
  vsAfter(sc, total); chalSetup();
  countUp($("r-pts"), game.pts, 1100);
  $("r-sub").textContent = "points · " + sc + "/" + total + " (" + p + " %) · meilleure série ×" + game.bestStreak;
  var text = t.text;
  if (game.cfg.mode === "duel" && total) {
    var A = CBY[game.cfg.duel[0]], B = CBY[game.cfg.duel[1]];
    var ra = ans.filter(function (a) { return M[a.mid].c === A.id; }), rb = ans.filter(function (a) { return M[a.mid].c === B.id; });
    var pa = pct(ra.filter(function (a) { return a.ok; }).length, ra.length), pb = pct(rb.filter(function (a) { return a.ok; }).length, rb.length);
    text = (pa === pb ? "Match nul : vous connaissez aussi bien (ou aussi mal) " + A.name + " que " + B.name + "." :
      "Vous reconnaissez mieux les mesures de " + (pa > pb ? A.name : B.name) + " (" + Math.max(pa, pb) + " %) que celles de " + (pa > pb ? B.name : A.name) + " (" + Math.min(pa, pb) + " %).") + " " + t.text;
  }
  if (game.cfg.mode === "blitz") text = plural(sc, "bonne réponse", "bonnes réponses") + " en 60 secondes. " + text;
  if (game.cfg.mode === "conseil") text = "Vous avez retrouvé l’auteur de " + plural(sc, "mesure", "mesures") + " sur " + total + " qui font tousser les juristes. " + t.text.replace("chaque mesure a sa source", "chaque obstacle a sa source");
  if (game.cfg.mode === "citations") text = "Vous avez rendu " + plural(sc, "citation", "citations") + " sur " + total + " à leur auteur. " + t.text.replace("chaque mesure a sa source", "chaque citation a sa source");
  if (game.cfg.mode === "casier") text = "Vous avez attribué " + plural(sc, "dossier", "dossiers") + " sur " + total + " au bon candidat. Rappel utile : une procédure en cours n’est pas une condamnation. " + t.text.replace("chaque mesure a sa source", "chaque dossier a sa source");
  if (game.cfg.mode === "accord") text = "Vous avez retrouvé " + plural(sc, "accord", "accords") + " sur " + total + ". Morale de l’histoire : ils se ressemblent parfois plus qu’ils ne l’avouent. " + t.text;
  $("r-title").textContent = t.label;
  $("r-medal").textContent = p >= 90 ? "🏆" : p >= 75 ? "🥇" : p >= 55 ? "🥈" : p >= 35 ? "🥉" : p >= 15 ? "📰" : "🎲";
  $("r-text").textContent = text;
  var best = store("qui2027-best-" + key);
  var isRecord = total >= 5 && (!best || game.pts > best.pts);
  if (isRecord) store("qui2027-best-" + key, game.result);
  $("r-record").hidden = !isRecord;
  var fxDone = endFx(game.pts, sc + "/" + total + " · " + p + " %", t.label, isRecord);
  if (!fxDone && (isRecord || p >= 75)) setTimeout(function () { confetti(isRecord ? 110 : 60); }, 350);

  var vf = game.cfg.mode === "target" && game.cfg.targets.length === 1, rows = [];
  if (vf) {
    var who = game.cfg.targets[0];
    var mine = ans.filter(function (a) { return M[a.mid].cs.indexOf(who) >= 0; }), oth = ans.filter(function (a) { return M[a.mid].cs.indexOf(who) < 0; });
    $("r-cand-sub").textContent = "Mesures de " + CBY[who].name + " reconnues, et pièges évités.";
    rows.push({ l: "Ses mesures reconnues", a: mine.filter(function (a) { return a.ok; }).length, b: mine.length });
    rows.push({ l: "Pièges évités", a: oth.filter(function (a) { return a.ok; }).length, b: oth.length });
  } else {
    $("r-cand-sub").textContent = "Part des mesures de chaque candidat que tu as bien attribuées.";
    C.forEach(function (c) {
      var mine = ans.filter(function (a) { return M[a.mid].cs.indexOf(c.id) >= 0; });
      if (mine.length) rows.push({ l: c.n + ". " + c.name, a: mine.filter(function (a) { return found(a, c.id); }).length, b: mine.length });
    });
    rows.sort(function (x, y) { return (y.a / y.b) - (x.a / x.b) || y.b - x.b; });
  }
  $("r-cand").innerHTML = rows.map(rowHtml).join("");
  game.team = gameStats(ans);
  $("r-team").innerHTML = teamHtml(game.team, true);
  var casier = game.cfg.mode === "casier";
  $("r-theme-h").textContent = casier ? "Par type de dossier" : "Par thème";
  $("r-theme-sub").textContent = casier ? "Condamnations, procédures, relaxes, polémiques." : "Taux de bonnes réponses selon le sujet.";
  var seenT = Array.from(new Set(ans.map(function (a) { return M[a.mid].t; })));
  var trows = seenT.map(function (th) {
    var l = ans.filter(function (a) { return M[a.mid].t === th; });
    return { l: th, a: l.filter(function (a) { return a.ok; }).length, b: l.length };
  }).filter(function (r) { return r.b > 0; }).sort(function (x, y) { return (y.a / y.b) - (x.a / x.b) || y.b - x.b; });
  $("r-theme").innerHTML = trows.map(rowHtml).join("");
  var conf = {};
  ans.forEach(function (a) {
    if (a.ok) return;
    var m = M[a.mid], real = m.c;
    if (a.type === "vf") { var k2 = a.pick === "other" ? "miss|" + q2(m) : "fake|" + real; conf[k2] = (conf[k2] || 0) + 1; }
    else if (a.type === "pick") { var k3 = a.pick + "|" + real; conf[k3] = (conf[k3] || 0) + 1; }
    else a.picks.forEach(function (pid) { if (m.cs.indexOf(pid) < 0) { var k4 = pid + "|" + real; conf[k4] = (conf[k4] || 0) + 1; } });
  });
  function q2(m) { return game.cfg.targets[0] || m.c; }
  var cl = Object.keys(conf).map(function (k2) { return { k: k2, n: conf[k2] }; }).sort(function (x, y) { return y.n - x.n; }).slice(0, 5);
  $("r-conf").innerHTML = cl.length ? cl.map(function (o) {
    var p2 = o.k.split("|"), times = o.n > 1 ? " (" + o.n + " fois)" : "";
    if (p2[0] === "miss") return "<li>Vous n’avez pas reconnu une mesure de <b>" + esc(CBY[p2[1]].name) + "</b>" + times + ".</li>";
    if (p2[0] === "fake") return "<li>Vous avez cru reconnaître une mesure qui venait de <b>" + esc(CBY[p2[1]].name) + "</b>" + times + ".</li>";
    return "<li>Vous avez attribué à <b>" + esc(CBY[p2[0]].name) + "</b> une mesure de <b>" + esc(CBY[p2[1]].name) + "</b>" + times + ".</li>";
  }).join("") : "<li style=\"border-color:var(--ok)\">Aucune confusion notable. Chapeau.</li>";
  var missed = ans.filter(function (a) { return !a.ok; });
  $("r-missed").innerHTML = missed.length ? missed.slice(0, 12).map(function (a) {
    var m = M[a.mid];
    return "<li><q>" + esc(m.m) + "</q><div class=\"meta\"><b>" + esc(names(m.cs)) + "</b> · " + esc(m.t) + (m.kase ? " · " + esc(m.status) : "") + " · " + srcHtml(m) + "</div></li>";
  }).join("") + (missed.length > 12 ? "<li class=\"meta\">… et " + (missed.length - 12) + " autres.</li>" : "") : "<li>Rien à revoir.</li>";
  $("r-retry").disabled = missed.length === 0;
  $("r-copied").hidden = true;
  show("res");
  window.scrollTo({ top: 0, behavior: "auto" });
}
function rowHtml(r) {
  var p = pct(r.a, r.b), cls = p >= 75 ? "hi" : (p < 40 ? "lo" : "");
  return "<div class=\"row\"><span class=\"lbl\">" + esc(r.l) + "</span><span class=\"trk\" role=\"img\" aria-label=\"" + p + " %\"><i class=\"" + cls + "\" style=\"width:" + Math.max(p, 2) + "%\"></i></span><span class=\"val\">" + r.a + "/" + r.b + "</span></div>";
}
$("r-again").addEventListener("click", function () { startGame(buildQuestions(game.cfg), game.cfg); });
$("r-retry").addEventListener("click", function () {
  var ids = game.answers.filter(function (a) { return a && !a.ok; }).map(function (a) { return a.mid; });
  if (!ids.length) return;
  var c2 = JSON.parse(JSON.stringify(game.cfg)); if (c2.mode === "blitz") c2.mode = "classic"; delete c2.daily;
  startGame(buildQuestions(c2, ids), c2);
});
$("r-setup").addEventListener("click", goMenu);
function shareText() {
  if (game.cfg.daily) { var dd = store(DAILY_KEY); if (dd && dd.n === game.cfg.daily) return dailyShareText(dd, streakNow()); }
  var r = game.result, sq = game.answers.filter(Boolean).slice(0, 20).map(function (a) { return a.ok ? "🟩" : (a.type === "multi" && a.good ? "🟨" : "🟥"); }).join("");
  var rk = gameRank(game.team || gameStats(game.answers.filter(Boolean))), team = rk.length ? "\nJe suis Team " + last(rk[0].c.name) + " 🎽" : "";
  return "Qui a proposé ça ? 🗳️ " + r.score + "/" + r.total + " (" + r.pct + " %)\n« " + r.label + " »\n" + sq + team + "\nÀ toi de jouer : " + siteUrl();
}
$("r-share").addEventListener("click", function () {
  var txt = shareText(), done = function (msg) { $("r-copied").textContent = msg; $("r-copied").hidden = false; };
  if (navigator.share) { navigator.share({ title: "Qui a proposé ça ?", text: txt }).catch(function () {}); return; }
  try { navigator.clipboard.writeText(txt).then(function () { done("Copié, à coller où tu veux."); }, function () { done(txt); }); } catch (e) { done(txt); }
});
$("r-copy").addEventListener("click", function () {
  var r = game.result, lab = { classic: "mode classique", duel: "confrontation", blitz: "mode éclair", target: "mode ciblé", multi: "multi-réponses", accord: "« Ils sont d’accord ! »", casier: "« Casier & polémiques »", citations: "« Qui a dit ça ? »", conseil: "« Le Conseil constitutionnel tousse »" }[game.cfg.mode];
  var extra = game.cfg.mode === "duel" ? " (" + last(CBY[game.cfg.duel[0]].name) + " / " + last(CBY[game.cfg.duel[1]].name) + ")" : "";
  var txt = "Qui a proposé ça ? Présidentielle 2027, " + lab + extra + " : " + fmt(r.pts) + " points, " + r.score + "/" + r.total + " (" + r.pct + " %), « " + r.label + " ». À toi : " + siteUrl();
  var done = function (msg) { $("r-copied").textContent = msg; $("r-copied").hidden = false; };
  try { navigator.clipboard.writeText(txt).then(function () { done("Copié, à coller où tu veux."); }, function () { done(txt); }); } catch (e) { done(txt); }
});

/* ---------- Explorer ---------- */
function initExplorer() {
  $("ex-c").innerHTML = "<option value=\"\">Tous les candidats</option><option value=\"__main\">Les 7 principaux</option><option value=\"__shared\">Mesures partagées</option>" + C.map(function (c) { return "<option value=\"" + c.id + "\">" + c.n + ". " + esc(c.name) + "</option>"; }).join("");
  $("ex-t").innerHTML = "<option value=\"\">Tous les thèmes</option>" + THEMES.map(function (t) { return "<option>" + esc(t) + "</option>"; }).join("");
  $("ex-q").placeholder = "Rechercher une mesure (retraites, Smic, Otan, sardines…)";
  ["ex-q", "ex-c", "ex-t"].forEach(function (id) { $(id).addEventListener("input", renderExplorer); });
}
function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
function renderExplorer() {
  var q = norm($("ex-q").value.trim()), fc = $("ex-c").value, ft = $("ex-t").value;
  var list = M.filter(function (x) {
    if (special(x)) return false;
    var okc = !fc || (fc === "__main" ? x.cs.some(function (c) { return MAIN.indexOf(c) >= 0; }) : fc === "__shared" ? x.shared : x.cs.indexOf(fc) >= 0);
    return okc && (!ft || x.t === ft) && (!q || norm(x.m + " " + x.t + " " + names(x.cs)).indexOf(q) >= 0);
  });
  var count = list.length;
  $("ex-count").textContent = count ? plural(count, "mesure", "mesures") : "";
  var html = C.map(function (c) {
    if (fc && fc !== "__main" && fc !== "__shared" && fc !== c.id) return "";
    var mine = list.filter(function (x) { return x.cs.indexOf(c.id) >= 0; });
    if (!mine.length) return "";
    return "<section class=\"ex-group\"><h3><span class=\"num\">" + c.n + "</span>" + esc(c.name) + "<small>" + esc(c.party) + " · " + plural(mine.length, "mesure", "mesures") + "</small></h3><div class=\"ex-list\">" +
      mine.map(function (x) {
        var also = x.shared ? "<span class=\"also\">Aussi proposé par " + esc(names(x.cs.filter(function (k) { return k !== c.id; }))) + "</span>" : "";
        return "<article class=\"card ex-item\"><p>" + esc(x.m) + "</p><div class=\"meta\"><span class=\"th\">" + esc(x.t) + "</span>" + also + "<span>" + srcHtml(x) + "</span></div></article>";
      }).join("") + "</div></section>";
  }).join("");
  $("ex-out").innerHTML = html || "<p>Aucune mesure ne correspond. Même les programmes ont leurs limites.</p>";
}

/* ---------- Effets ---------- */
var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function countUp(el, to, ms, from) {
  from = from || 0;
  if (REDUCED || !window.requestAnimationFrame) { el.textContent = fmt(to); return; }
  var t0 = null;
  if (el._raf) cancelAnimationFrame(el._raf);
  function step(t) {
    if (!t0) t0 = t;
    var k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(Math.round(from + (to - from) * e));
    if (k < 1) el._raf = requestAnimationFrame(step);
  }
  el._raf = requestAnimationFrame(step);
}
function stagger(box) {
  if (REDUCED) return;
  box.classList.remove("pop");
  Array.prototype.forEach.call(box.children, function (ch, i) { ch.style.animationDelay = Math.min(i * 35, 600) + "ms"; });
  void box.offsetWidth; box.classList.add("pop");
}
function floatGain(txt) {
  if (REDUCED) return;
  var host = document.querySelector(".hud .pts"), f = document.createElement("span");
  f.className = "float"; f.textContent = txt; host.appendChild(f);
  setTimeout(function () { f.remove(); }, 1200);
}
function confetti(n) {
  if (REDUCED) return;
  var cs = getComputedStyle(document.documentElement), cols = ["#000091", "#ffffff", "#e1000f"];
  for (var i = 0; i < n; i++) {
    var d = document.createElement("i");
    d.className = "confetti";
    d.style.left = (Math.random() * 100) + "vw";
    d.style.background = cols[i % cols.length]; if (i % 3 === 1) d.style.boxShadow = "0 0 0 1px rgba(0,0,0,.15)";
    d.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    d.style.setProperty("--rot", (Math.random() * 900 - 450) + "deg");
    d.style.animationDuration = (1.6 + Math.random() * 1.6) + "s";
    d.style.animationDelay = (Math.random() * .35) + "s";
    document.body.appendChild(d);
    (function (el) { setTimeout(function () { el.remove(); }, 3800); })(d);
  }
}

/* ---------- Fin de partie : dépouillement ---------- */
var fxTimers = [], fxOpenAt = 0;
function endFx(pts, sub, label, record) {
  if (REDUCED) return false;
  var fx = $("endfx"), urne = $("fx-urne");
  fxTimers.forEach(clearTimeout); fxTimers = [];
  fx.classList.remove("out"); fx.hidden = false; fxOpenAt = Date.now();
  $("fx-k").textContent = "Dépouillement en cours…";
  $("fx-sc").textContent = "0"; $("fx-sub").textContent = sub;
  var st = $("fx-st"); st.textContent = record ? "Record battu" : label; st.classList.remove("on");
  urne.querySelectorAll(".bal").forEach(function (b) { b.remove(); });
  for (var i = 0; i < 6; i++) { var bl = document.createElement("span"); bl.className = "bal"; bl.style.animationDelay = (0.55 + i * 0.16) + "s"; bl.style.left = (42 + (i % 3 - 1) * 6) + "%"; urne.appendChild(bl); }
  function later(fn, ms) { fxTimers.push(setTimeout(fn, ms)); }
  later(function () { countUp($("fx-sc"), pts, 1100); }, 900);
  later(function () { $("fx-k").textContent = "Les résultats sont tombés"; }, 1900);
  later(function () { st.classList.add("on"); confetti(record ? 140 : 90); }, 2100);
  later(closeFx, 4300);
  return true;
}
function closeFx() {
  var fx = $("endfx"); if (fx.hidden || fx.classList.contains("out") || Date.now() - fxOpenAt < 700) return;
  fxTimers.forEach(clearTimeout); fxTimers = [];
  fx.classList.add("out");
  setTimeout(function () { fx.hidden = true; fx.classList.remove("out"); }, 650);
}
$("endfx").addEventListener("click", closeFx);
document.addEventListener("keydown", function (e) { if (!$("endfx").hidden && (e.key === "Escape" || e.key === "Enter" || e.key === " ")) { e.preventDefault(); closeFx(); } });

/* ---------- Compte à rebours ---------- */
var VOTE = Date.UTC(2027, 3, 18, 6, 0, 0); // dimanche 18 avril 2027, 8 h à Paris (UTC+2)
var cdPrev = {};
function pad(n) { return (n < 10 ? "0" : "") + n; }
function cdSet(id, v) { var el = $(id); if (cdPrev[id] === v) return; cdPrev[id] = v; el.textContent = v; if (!REDUCED) { el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } }
function cdTick() {
  var ms = VOTE - Date.now();
  if (ms <= 0) {
    $("cd-j").textContent = "Jour J"; $("hero-j").textContent = "Jour J,"; $("cd-chip").textContent = "1er tour : c’est aujourd’hui (ou c’est passé)";
    ["cd-d", "cd-h", "cd-m", "cd-s"].forEach(function (id) { $(id).textContent = "00"; });
    $("cd-quip").textContent = "Les bureaux de vote sont ouverts. Le quiz, lui, ne ferme jamais.";
    return;
  }
  var s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
  var jd = Math.ceil(ms / 86400000);
  $("cd-j").textContent = "J-" + jd; $("hero-j").textContent = "J-" + jd;
  $("cd-chip").textContent = "1er tour J-" + jd;
  cdSet("cd-d", String(d)); cdSet("cd-h", pad(h)); cdSet("cd-m", pad(m)); cdSet("cd-s", pad(sec));
}
function cdQuip() {
  var days = Math.max(1, Math.ceil((VOTE - Date.now()) / 86400000));
  var perDay = (NPROG / days).toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  var lines = CD_QUIPS.concat(["Pour connaître les " + fmt(NPROG) + " mesures de ce quiz d’ici là : " + perDay + " par jour. Faisable, entre deux cafés."]);
  $("cd-quip").textContent = pick(lines);
}

/* ---------- Démarrage ---------- */
cdTick(); cdQuip();
setInterval(cdTick, 1000);
setInterval(cdQuip, 12000);
initExplorer();
renderHome();
runIntro();
$("contact-line").innerHTML = "écris à <a href=\"mailto:" + CONTACT_EMAIL + "\">" + CONTACT_EMAIL + "</a>, ou utilise le formulaire « Nous écrire » et le lien « Signaler une erreur » sous chaque réponse.";
if (location.hash === "#explorer") { show("explorer"); renderExplorer(); } else if (location.hash === "#antiseches") { show("cheat"); renderCheat(); } else if (location.hash === "#sondages") { show("polls"); renderPolls(); } else if (location.hash === "#stats") { show("stats"); renderStats(); } else if (location.hash === "#contact") { show("contact"); } else show("setup");
window.addEventListener("hashchange", function () { if (checkHashChallenge() || checkHashLeague()) return; if (location.hash === "#explorer") { show("explorer"); renderExplorer(); } });
checkHashChallenge(); checkHashLeague();
})();

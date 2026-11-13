"""Génère les pages statiques indexables (programmes par candidat), robots.txt et sitemap.xml.
Usage : python3 gen_seo.py <dossier_du_site>   (lit data.js via node)"""
import json, os, subprocess, sys, unicodedata, re, html, datetime

SITE = "https://quiapropose.fr/"
here = os.path.dirname(os.path.abspath(__file__))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "..", "quiapropose.github.io")
raw = subprocess.run(["node", "-e", 'var fs=require("fs");eval(fs.readFileSync("data.js","utf8"));'
                      'process.stdout.write(JSON.stringify({C:C,RAW:RAW,SHARED:SHARED,S:S,FAMILY:FAMILY}))'],
                     cwd=here, capture_output=True, text=True, check=True).stdout
D = json.loads(raw)
C, RAW, SHARED, S, FAMILY = D["C"], D["RAW"], D["SHARED"], D["S"], D["FAMILY"]
CBY = {c["id"]: c for c in C}
today = datetime.date.today().isoformat()
e = html.escape

def slug(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

SLUG = {c["id"]: slug(c["name"]) for c in C}
ORDER = sorted(C, key=lambda c: slug(c["name"].split(" ", 1)[-1]))  # ordre alphabétique des noms

CSS = """
:root{--bleu:#000091;--rouge:#e1000f;--ink:#13203a;--muted:#5a6478;--line:#cfd5de;--paper:#f4f6f9}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
body::before{content:"";display:block;height:6px;background:linear-gradient(90deg,var(--bleu) 0 33.3%,#fff 33.3% 66.6%,var(--rouge) 66.6%)}
.w{max-width:860px;margin:0 auto;padding:22px 18px 60px}
a{color:var(--bleu)}nav.crumb{font-size:14px;color:var(--muted);margin-bottom:10px}
.brand{font:900 22px/1 Impact,"Arial Narrow",sans-serif;text-transform:uppercase;text-decoration:none;color:var(--ink)}.brand em{font-style:normal;color:var(--bleu)}.brand b{color:var(--rouge)}
h1{font:800 clamp(28px,5vw,42px)/1.1 system-ui,sans-serif;margin:14px 0 8px;letter-spacing:-.01em}
.lede{font-size:18px;color:var(--muted);margin:0 0 18px}
.cta{display:inline-block;background:var(--bleu);color:#fff;text-decoration:none;font-weight:800;padding:13px 18px;border-radius:4px;box-shadow:inset 0 -4px 0 var(--rouge);margin:4px 8px 4px 0}
.cta.alt{background:#fff;color:var(--bleu);border:2px solid var(--bleu);box-shadow:none}
h2{font:800 22px/1.2 system-ui,sans-serif;margin:30px 0 8px;padding-bottom:6px;border-bottom:2px solid var(--line)}
ul.m{list-style:none;padding:0;margin:0}ul.m li{background:#fff;border:1px solid var(--line);border-left:4px solid var(--fam,var(--bleu));padding:10px 12px;margin:6px 0;border-radius:3px}
ul.m small{display:block;color:var(--muted);font-size:13px;margin-top:3px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px;margin:14px 0}
.card{display:block;background:#fff;border:1px solid var(--line);border-left:5px solid var(--fam,var(--bleu));padding:12px 14px;border-radius:3px;text-decoration:none;color:var(--ink)}
.card b{display:block;font-size:17px}.card span{font-size:13px;color:var(--muted)}
.note{font-size:14px;color:var(--muted);background:#fff;border:1px dashed var(--line);padding:10px 12px;border-radius:3px}
footer{margin-top:40px;font-size:13px;color:var(--muted)}
.others{font-size:14px;line-height:1.9}
"""

FAMCOL = {"Extrême gauche": "#b3261e", "Gauche radicale": "#d0342c", "Gauche (communiste)": "#c62828", "Gauche": "#e0554f",
          "Gauche sociale-démocrate": "#e57373", "Écologistes": "#17784a", "Sans étiquette": "#8a5cc7", "Centre (camp présidentiel)": "#e8a400",
          "Centre droit": "#4f6bd8", "Droite": "#000091", "Droite souverainiste": "#2b3a8f", "Souverainistes (Frexit)": "#5a6478",
          "Souverainistes": "#7a8295", "Extrême droite": "#13203a"}

def page(title, desc, canon, body, jsonld):
    return f"""<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(desc)}"><link rel="canonical" href="{canon}">
<meta property="og:type" content="article"><meta property="og:locale" content="fr_FR"><meta property="og:url" content="{canon}">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:image" content="{SITE}og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='21' height='64' fill='%23000091'/%3E%3Crect x='21' width='22' height='64' fill='%23fff'/%3E%3Crect x='43' width='21' height='64' fill='%23e1000f'/%3E%3C/svg%3E">
<style>{CSS}</style>
<script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False)}</script>
</head><body><div class="w">
<a class="brand" href="{SITE}">Qui a <em>proposé</em> ça <b>?</b></a>
{body}
<footer>Site indépendant, lié à aucun candidat ni parti. Chaque mesure est une reformulation courte et neutre, avec un lien vers sa source. Une erreur ? Écris-nous : contact@quiapropose.fr · <a href="{SITE}">Le quiz</a> · <a href="{SITE}programmes/">Tous les programmes</a></footer>
</div></body></html>
"""

def src_txt(key):
    s = S.get(key) or {}
    if not s: return ""
    return f'Source : <a href="{e(s.get("u",""))}" rel="nofollow noopener" target="_blank">{e(s.get("s",""))}</a> · {e(s.get("d",""))}'

os.makedirs(os.path.join(out, "programmes"), exist_ok=True)
urls = [(SITE, "1.0"), (SITE + "programmes/", "0.9")]
counts = {}
for c in C:
    cid = c["id"]
    own = [r for r in RAW if r[0] == cid]
    shared = [r for r in SHARED if cid in r[0]]
    counts[cid] = len(own) + len(shared)
    themes = {}
    for r in own: themes.setdefault(r[1], []).append(r)
    col = FAMCOL.get(FAMILY.get(cid, ""), "#000091")
    n = counts[cid]
    title = f"Programme de {c['name']} 2027 : {n} mesures sourcées | Qui a proposé ça ?"
    desc = f"Les {n} propositions de {c['name']} ({c['party']}) pour la présidentielle 2027, classées par thème, avec leurs sources. Teste-toi : sauras-tu les reconnaître ?"
    canon = f"{SITE}programmes/{SLUG[cid]}"
    body = [f'<nav class="crumb"><a href="{SITE}">Accueil</a> › <a href="{SITE}programmes/">Programmes 2027</a> › {e(c["name"])}</nav>',
            f'<h1>Programme de {e(c["name"])} pour 2027</h1>',
            f'<p class="lede">{e(c["party"])}' + (f' · {e(FAMILY.get(cid, ""))}' if FAMILY.get(cid, "") != c["party"] else "") + f' · {n} mesures recensées, classées par thème.</p>',
            f'<a class="cta" href="{SITE}">Sauras-tu reconnaître ses mesures ? Jouer →</a><a class="cta alt" href="{SITE}programmes/">Comparer avec les autres</a>',
            '<p class="note">Mesures reformulées de façon courte et neutre à partir des programmes, sites et déclarations du candidat. Elles ne sont ni jugées ni classées par importance. Le programme peut évoluer : on met à jour dès qu’une nouvelle version sort.</p>']
    for t in sorted(themes, key=lambda t: (-len(themes[t]), t)):
        body.append(f"<h2>{e(t)} <small>({len(themes[t])})</small></h2><ul class=\"m\" style=\"--fam:{col}\">")
        body += [f"<li>{e(r[2])}<small>{src_txt(r[3])}</small></li>" for r in themes[t]]
        body.append("</ul>")
    if shared:
        body.append(f"<h2>Mesures partagées avec d’autres candidats <small>({len(shared)})</small></h2><ul class=\"m\" style=\"--fam:{col}\">")
        for r in shared:
            others = ", ".join(CBY[o]["name"] for o in r[0] if o != cid)
            body.append(f"<li>{e(r[2])}<small>Aussi proposé par : {e(others)} · {e(r[1])} · {src_txt(r[3].get(cid, ''))}</small></li>")
        body.append("</ul>")
    body.append('<h2>Les autres candidats</h2><p class="others">' + " · ".join(
        f'<a href="{SITE}programmes/{SLUG[o["id"]]}">{e(o["name"])}</a>' for o in ORDER if o["id"] != cid) + "</p>")
    ld = [{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE},
              {"@type": "ListItem", "position": 2, "name": "Programmes 2027", "item": SITE + "programmes/"},
              {"@type": "ListItem", "position": 3, "name": c["name"], "item": canon}]},
          {"@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc, "inLanguage": "fr-FR",
           "dateModified": today, "about": {"@type": "Person", "name": c["name"]}, "publisher": {"@type": "Organization", "name": "Qui a proposé ça ?", "url": SITE}}]
    open(os.path.join(out, "programmes", SLUG[cid] + ".html"), "w", encoding="utf8").write(page(title, desc, canon, "\n".join(body), ld))
    urls.append((canon, "0.8"))

total = len(RAW) + len(SHARED)
cards = "".join(f'<a class="card" style="--fam:{FAMCOL.get(FAMILY.get(c["id"], ""), "#000091")}" href="{SITE}programmes/{SLUG[c["id"]]}"><b>{e(c["name"])}</b><span>{e(c["party"])} · {counts[c["id"]]} mesures</span></a>' for c in ORDER)
idx_title = f"Programmes de la présidentielle 2027 : les {len(C)} candidats et leurs {total} mesures | Qui a proposé ça ?"
idx_desc = f"Comparer les programmes de la présidentielle 2027 : {total} mesures sourcées de {len(C)} candidats (Mélenchon, Le Pen, Philippe, Attal, Retailleau, Glucksmann, Tondelier…), classées par thème."
idx_body = f"""<nav class="crumb"><a href="{SITE}">Accueil</a> › Programmes 2027</nav>
<h1>Les programmes de la présidentielle 2027</h1>
<p class="lede">{total} mesures sourcées, {len(C)} candidats, classées par thème. Choisis un candidat pour lire ses propositions, ou teste-toi avec le quiz.</p>
<a class="cta" href="{SITE}">Jouer au quiz « Qui a proposé ça ? » →</a>
<div class="grid">{cards}</div>
<p class="note">Candidats classés par ordre alphabétique. Premier tour le 18 avril 2027, second tour le 2 mai 2027. Les mesures sont reformulées de façon neutre, avec un lien vers chaque source.</p>"""
idx_ld = {"@context": "https://schema.org", "@type": "CollectionPage", "name": idx_title, "description": idx_desc, "inLanguage": "fr-FR", "url": SITE + "programmes/",
          "hasPart": [{"@type": "WebPage", "name": "Programme de " + c["name"], "url": f"{SITE}programmes/{SLUG[c['id']]}"} for c in ORDER]}
open(os.path.join(out, "programmes", "index.html"), "w", encoding="utf8").write(page(idx_title, idx_desc, SITE + "programmes/", idx_body, idx_ld))

open(os.path.join(out, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}sitemap.xml\n")
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
sm += [f"  <url><loc>{u}</loc><lastmod>{today}</lastmod><priority>{p}</priority></url>" for u, p in urls]
sm.append("</urlset>")
open(os.path.join(out, "sitemap.xml"), "w").write("\n".join(sm) + "\n")
print(len(urls), "URL ·", total, "mesures")

# Mise à jour de quiapropose.fr

Les sources du site sont dans ce dossier `_src/`. Le site publié (`index.html`, `programmes/`, `sitemap.xml`, `robots.txt`) se trouve à la racine du dépôt et il est **généré** : ne jamais le modifier à la main.

## Fichiers

- `data.js` : toutes les données.
  - `C` : les candidats.
  - `FAMILY` : la famille politique de chaque candidat.
  - `S` : les sources (`clé: { s: titre, d: date, u: url }`).
  - `RAW` : les mesures propres à un candidat (`[idCandidat, thème, texte, cléSource]`).
  - `SHARED` : les mesures communes à plusieurs candidats.
  - `POLLS` / `POLLS_MAJ` : les sondages.
  - `NEWS` / `NEWS_MAJ` : le fil info du haut de page.
- `expl.js` : l'explication « En clair » de chaque mesure (`EXPL`, clé = texte exact de la mesure), affichée par le bouton « i » pendant la partie.
- `app.js` et `head.html` : l'interface. On n'y touche que pour corriger un bug.
- `check.js` : les vérifications automatiques.
- `publish.sh` : vérifie, compile et met à jour la racine du dépôt.
- `supabase.sql` : le schéma du classement en ligne. Il est déjà installé : ne pas le rejouer.

## Mise à jour quotidienne

1. **Veille.** Chercher les nouvelles des dernières 24 à 48 heures sur la présidentielle 2027 :
   - candidatures déclarées ou retirées ;
   - programmes et nouvelles mesures chiffrées ou précises ;
   - nouveaux sondages d'intentions de vote au 1er tour ;
   - meetings et débats, dates clés.

   Sources à privilégier : les dépêches AFP reprises par les médias (France 24, TV5Monde, Le Point, La Libre, Boursorama…), les sites officiels des candidats, la Commission des sondages, LCP, franceinfo, Le Monde, RFI.
2. **Fil info (`NEWS`).** Il doit rester très simple : **6 éléments au maximum**, les plus récents en tête.
   - Une seule ligne par sujet. Regrouper ce qui va ensemble : une candidature et la réaction qu'elle suscite, un programme et le meeting qui le lance.
   - Éviter plusieurs lignes à la même date. Si deux sujets distincts tombent le même jour, la date n'est affichée qu'une fois.
   - Un seul élément « À venir » (`d: "À venir"`, `k: "agenda"`) qui liste les 2 ou 3 prochaines dates clés ; retirer les dates passées.
   - Format : `{ d: "13 nov.", k: type, t: texte, s: média, u: url }`, avec pour `k` l'une des valeurs `declare`, `programme`, `mesure`, `agenda`, `insolite` ou `debat`.
   - Texte factuel, court (140 caractères environ, 160 au maximum), neutre, sans adjectif de jugement. Une touche légère (un bon mot assumé par un candidat, un lieu de meeting inattendu) est bienvenue, jamais une moquerie.
   - Indiquer « AFP via <média> » quand l'article est une dépêche AFP.
   - Mettre à jour `NEWS_MAJ`.
3. **Mesures (`RAW`).**
   - Pour chaque mesure nouvelle et vérifiable : ajouter une source dans `S` (avec une URL https qui pointe vers le texte original ou un article qui le cite), puis une ligne dans `RAW`.
   - Reformuler en une phrase neutre à l'infinitif, sans reprendre de slogan.
   - Pas de doublon : `check.js` les détecte.
   - Ajouter dans `expl.js` l'explication « En clair » de chaque nouvelle mesure (1 ou 2 phrases, 320 caractères au maximum) : ce que la mesure change concrètement et la situation actuelle en France, en expliquant les termes techniques. Elle s'affiche avant la réponse : ne jamais nommer ni suggérer le candidat ou son camp, aucun jugement, aucun chiffre incertain. `check.js` refuse une mesure sans explication.
   - Si la mesure demande de réviser la Constitution ou s'y heurte en l'état, ajouter une ligne dans `CONSTIT` (fichier `expl.js`) : verdict, explication courte et source dans `CSRC` (texte de la Constitution, décision du Conseil constitutionnel ou analyse de juristes). Ne rien affirmer sans base claire.
   - Coût : ne jamais estimer soi-même. N'ajouter une ligne dans `COUT` (fichier `expl.js`) que si une source chiffre la mesure ou une mesure identique ou proche : chiffrage indépendant (Institut Montaigne, qui annonce ses chiffrages 2027 pour le 1er trimestre 2027, Cour des comptes, OFCE, Drees, études d'impact…) ou chiffre annoncé par le candidat. Le 2e champ dit qui a chiffré, sans nommer le candidat ni son parti : il s'affiche avant la réponse. Si le texte d'une mesure change, changer aussi sa clé dans `expl.js`.
   - Pour un nouveau candidat déclaré : l'ajouter dans `C` (avec `main: true` seulement s'il est à 5 % ou plus dans les sondages) et dans `FAMILY`, avec au moins 8 mesures sourcées.
   - Mettre à jour la date dans le commentaire d'en-tête de `data.js`.
4. **Sondages (`POLLS`).**
   - N'ajouter un sondage que si sa notice ou un article sérieux donne : l'institut, le commanditaire, les dates du terrain, la taille de l'échantillon, la méthode et la marge d'erreur (loi du 19 juillet 1977).
   - Chaque hypothèse doit totaliser 100 %.
   - Garder au maximum 4 instituts, les plus récents (un sondage par institut).
   - Mettre à jour `POLLS_MAJ`.
   - Un candidat absent de `C` peut figurer dans un sondage sous son nom complet. Si besoin, ajouter sa famille dans `EXTRA_FAM` (fichier `app.js`).
5. **Publier.** Depuis la racine du dépôt :
   - lancer `sh _src/publish.sh` ;
   - si tout est OK : `git add -A && git -c user.name="quiapropose" -c user.email="quiapropose@users.noreply.github.com" commit -m "Mise à jour du <date>"` puis `git push origin main`.

   S'il n'y a rien de nouveau, ne rien publier.

## Règles à ne jamais enfreindre

- **Neutralité.** Les candidats sont traités de la même façon. Pas d'avis, pas de classement moral, pas de photo de personnalité.
- **Anonymat.**
  - Aucun nom de personne liée au site, aucune adresse e-mail personnelle, aucune URL personnelle.
  - Commits uniquement sous l'auteur « quiapropose », sans ligne Co-Authored-By ni autre attribution.
- **Supabase.** Ne jamais demander, utiliser ni publier de clé « secret » ou « service_role ». Seules l'URL du projet et la clé publishable figurent dans `build.py`.
- **Joueurs.** Ne jamais présenter les réponses des joueurs comme un sondage.
- **Sources.** Chaque mesure, info ou sondage a une source vérifiable. En cas de doute, ne pas publier.

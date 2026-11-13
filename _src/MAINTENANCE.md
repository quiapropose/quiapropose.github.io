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
2. **Fil info (`NEWS`).**
   - Ajouter en tête les nouveautés : 3 au maximum par jour, et 14 éléments au maximum au total (les plus anciens sortent).
   - Format : `{ d: "13 nov.", k: type, t: texte, s: média, u: url }`, avec pour `k` l'une des valeurs `declare`, `programme`, `mesure`, `agenda`, `insolite` ou `debat`.
   - Texte factuel, court (160 caractères au maximum), neutre, sans adjectif de jugement.
   - Le type `insolite` est réservé à un fait réel et léger (un bon mot assumé, un lieu de meeting inattendu), jamais à une moquerie.
   - Indiquer « AFP via <média> » quand l'article est une dépêche AFP.
   - Les éléments « À venir » (`agenda`) restent tant que la date n'est pas passée.
   - Mettre à jour `NEWS_MAJ`.
3. **Mesures (`RAW`).**
   - Pour chaque mesure nouvelle et vérifiable : ajouter une source dans `S` (avec une URL https qui pointe vers le texte original ou un article qui le cite), puis une ligne dans `RAW`.
   - Reformuler en une phrase neutre à l'infinitif, sans reprendre de slogan.
   - Pas de doublon : `check.js` les détecte.
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

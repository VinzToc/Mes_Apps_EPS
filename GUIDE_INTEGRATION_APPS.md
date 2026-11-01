# Guide d'intégration d'une application à Mes Apps EPS (eps-core.js v2.2)

Principe : toutes les applications hébergées sous `https://vinztoc.github.io/…` partagent la **même base locale** (IndexedDB « MesAppsEPS »), car le stockage du navigateur est lié au domaine, pas au dépôt. Une application enregistre donc ses données **directement** dans Mes Apps EPS, sans passer par un fichier. Le fichier .xlsx sert de sauvegarde et de transfert entre appareils.

## À faire dans chaque application

1. **Ajouter `eps-core.js` (v2.1)** à la racine du dépôt de l'application, le charger avant son propre script (`<script src="eps-core.js"></script>`) et l'ajouter à la liste de fichiers de son `sw.js` (usage hors ligne).
2. **Choisir un identifiant d'application** stable et sans espace, par exemple `orienrun`. Il doit être identique dans le code et dans `apps.json` (champ `id`).
3. **Lire les élèves** : `const eleves = await EPS.all();` (champs `id, nom, prenom, naissance, classe, regime`). Garder l'`id` de l'élève pour l'enregistrement. Si la liste est vide (appareil sans base), proposer un bouton « Charger la liste » : `await EPS.importFile(fichier)` accepte le .xlsx ou le .csv de Mes Apps EPS.
4. **Enregistrer** (au moment de valider une saisie, et via un bouton « 💾 Enregistrer dans Mes Apps EPS » avec message d'état) :
   - plusieurs saisies datées par élève (mode « lignes », recommandé) :
     `await EPS.addLigne('mon_app', eleve.id, { Date:'2026-10-31', Activité:'…', Résultat:'…' });`
     La date doit être au format `AAAA-MM-JJ`. Un clic répété n'ajoute pas de doublon.
   - une seule saisie par élève (mode « colonnes ») : `await EPS.setExt('mon_app', eleve.id, { champ:valeur });`
5. **Exporter** au format Mes Apps EPS :
   `EPS.downloadXLSX(await EPS.exportXLSX({ ids:[…], apps:['mon_app'] }), 'MonApp_2026-10-31.xlsx');`
   (`ids` et `apps` sont facultatifs : sans eux, tout le classeur compilé est exporté.)
6. **Déclarer l'application** dans `apps.json` du portail : `id`, `nom`, `url`, `icon`, `emoji`, et `"categorie"` (Performances, Réalisations ou Projets) pour le regroupement dans la fiche élève.

## Limites à connaître
- L'enregistrement direct ne marche que si le portail et l'application sont sur le **même domaine** et dans le **même navigateur** de l'appareil. Sur iPhone/iPad, une application ajoutée à l'écran d'accueil a son propre stockage, distinct de Safari : dans ce cas, utiliser l'export .xlsx puis l'import dans le portail.
- Une application sans élève sélectionné (saisie libre) ne peut pas être rattachée à Mes Apps EPS.

---

# Deux catalogues : « Applis pour le prof » et « Applis pour les élèves »

| | Applis pour le prof | Applis pour les élèves |
|---|---|---|
| Portail | Mes Apps EPS (`Mes_Apps_EPS`) | Applis EPS Élèves (`Applis_EPS_Eleves`), partagé aux élèves par lien ou QR code |
| Catalogue | `apps.json` du portail prof | `apps.json` du portail élèves |
| Élèves | liste Pronote importée dans le portail (`EPS.all()`, `EPS.addLigne`…) | identification manuelle : nom, prénom, classe, ou rien (`ELEVE`, `eleve-core.js`) |
| Base locale | `MesAppsEPS` | `EPSEleves` (distincte) |

**Ajouter une application prof** : une ligne dans `apps.json` de `Mes_Apps_EPS` (voir plus haut).
**Ajouter une application élève** : une ligne dans `apps.json` de `Applis_EPS_Eleves` (`id`, `nom`, `url`, `icon` relatif à ce dépôt, `emoji`, `categorie`). Elle apparaît aussi dans la zone « Applis pour les élèves » du portail prof, qui lit ce catalogue.

## Dans chaque application élève
1. Charger `eps-core.js` (v2.2) puis `eleve-core.js` (le second appelle `EPS.useDB('EPSEleves')`). Ne **jamais** importer de liste d'élèves.
2. Pas de sauvegarde nécessaire → ne rien faire (aucune identification).
3. Sauvegarde nécessaire :
   - `await ELEVE.demander();` ouvre la fenêtre « Qui es-tu ? » si l'élève n'est pas encore identifié (une seule fois pour toutes les applis élèves du domaine). Retourne `null` s'il choisit « sans m'identifier ».
   - `await ELEVE.enregistrer('mon_app', {Date:'AAAA-MM-JJ', …})` (mode lignes) ou `ELEVE.enregistrerChamps('mon_app', {…})` ; retourne `false` si non identifié (rien n'est sauvegardé).
   - `ELEVE.bandeau(element)` affiche l'élève courant ; `ELEVE.exporter()` télécharge son .xlsx à remettre au professeur.
4. Le professeur importe ce fichier dans Mes Apps EPS : la feuille est rattachée à l'élève par **Nom + Prénom (+ Classe)** (la date de naissance n'étant pas saisie). Homonymes dans la même classe ou élève absent de la liste : lignes ignorées (le portail le signale).

## Limite de la séparation
Les deux portails sont publics sur GitHub Pages : « séparer » veut dire que le portail élèves ne propose ni ne cite aucune application prof, pas que celles-ci sont protégées par un mot de passe. Les données d'élèves, elles, ne sont jamais publiées (stockage local uniquement).

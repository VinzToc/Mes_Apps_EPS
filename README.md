# Mes Apps EPS
Déploiement : créer le dépôt `Mes_Apps_EPS`, y déposer tout le contenu de ce dossier, puis Settings → Pages → Branch `main` / root.
URL : https://vinztoc.github.io/Mes_Apps_EPS/

## Intégrer une application
1. Héberger l'app sur le même compte GitHub Pages (même origine `vinztoc.github.io`).
2. Ajouter une entrée dans `apps.json` (id, nom, desc, url, emoji ou icon, couleur).
3. Dans l'app : copier `eps-core.js` à côté de son index.html (et l'ajouter à son cache SW), puis :
```js
const eleves = await EPS.getExt('appel_qr');            // liste globale + data propre à l'app
await EPS.setExt('appel_qr', eleves[0].id, {presence:'P'}); // devient la colonne APP_appel_qr_presence à l'export
```

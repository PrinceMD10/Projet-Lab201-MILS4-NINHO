# Ninho — M.I.L.S 4 React

Version restructurée avec une architecture plus professionnelle :

- styles séparés par composant avec `*.module.css` ;
- `global.css` limité aux variables, reset et animations partagées ;
- dashboard public avec KPIs ;
- back-office avec dashboard, commandes, dates, articles et abonnés ;
- effets hover, glassmorphism, animations, cartes interactives ;
- lecteur audio prêt pour des vrais fichiers `.mp3` autorisés ;
- billetterie démo avec sauvegarde `localStorage` et endpoint mail configurable.

## Installation

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Déploie ensuite le dossier `dist/`.

## Audio

Les vrais morceaux officiels ne sont pas inclus pour des raisons de droits. Ajoute tes fichiers autorisés dans :

```txt
public/audio/
```

Les chemins attendus sont définis dans `src/data/tracks.js`.

## E-mail

Pour un vrai envoi d'e-mail automatique, ajoute un endpoint backend/serverless :

```env
VITE_MAIL_API_ENDPOINT=https://ton-domaine.com/api/send-ticket-email
VITE_TICKETING_RECIPIENT=billetterie@ton-domaine.com
```

Sans endpoint, l'application garde un lien `mailto:` de secours.

## Back-office

Mot de passe démo : `mils4`

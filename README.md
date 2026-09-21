# odeman-portfolio

Site portfolio personnel — cybersécurité (SOC/GRC), qualité logicielle et automatisation des tests.

## Stack

- [Astro](https://astro.build) (site statique, TypeScript strict)
- Déploiement : GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)
- Contenu : Astro Content Collections (`src/content/projects`, `src/content/blog`)

## Développement local

```bash
npm install
npm run dev
```

Le site est servi sur http://localhost:4321

## Build

```bash
npm run build
npm run preview
```

Le résultat est généré dans `dist/`.

## À personnaliser avant mise en ligne

- `src/config/site.ts` : email de contact, URL du domaine final, liens GitHub/LinkedIn
- `astro.config.mjs` : champ `site` (URL de production)
- `public/cv-nathalie-blitte.pdf` : à ajouter (CV téléchargeable)
- `public/images/og-default.png` : image de partage (Open Graph), 1200×630px recommandé
- Compléter `src/pages/cv.astro` avec les expériences détaillées

## Déploiement

1. Créer le repo GitHub `nblitte.github.io` (ou `nblitte/portfolio`)
2. Pousser ce projet sur `main`
3. Dans GitHub → Settings → Pages → Source : "GitHub Actions"
4. Le workflow build + déploie automatiquement à chaque push sur `main`

## Domaine personnalisé (optionnel)

Une fois le domaine confirmé (ex: OVH), ajouter un fichier `public/CNAME` contenant le domaine,
et configurer chez le registrar :
- Enregistrement `A`/`ALIAS` pour l'apex (ex: `nathalieblitte.fr`) vers les IPs GitHub Pages
- Enregistrement `CNAME` pour `www` vers `nblitte.github.io`

Voir la documentation GitHub : https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

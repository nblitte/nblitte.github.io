# Journal du projet — Portfolio cybersécurité (odeman-portfolio)

Dernière mise à jour : 20 septembre 2026

Ce fichier retrace ce qui a été fait, pourquoi, et ce qui reste à faire. Il vit dans le projet lui-même (`odeman-portfolio/JOURNAL.md`) pour rester accessible à chaque reprise du travail.

---

## 1. Contexte de départ

Objectif exprimé : construire un portfolio (site web) avec scripts de démonstration, éventuellement un blog, en vue de décrocher un poste d'ingénieur cybersécurité ou GRC (objectif n°1), et à terme faire du blog une source de revenus (objectif n°2).

Contraintes matérielles :
- Développement possible sur le PC gaming **Zeus** (Windows)
- Un **NAS Synology** disponible, mais qui ne peut pas être exposé à Internet pour héberger le site
- Une **Flybox** comme connexion Internet (pas d'IP fixe/hébergement maison fiable)
- Un domaine **odeman.fr** déjà possédé par le passé (statut à vérifier)

Trois documents Word (exports de conversations ChatGPT antérieures, dossier `Conversations ChatGPT/`) ont été fournis et lus intégralement :
1. `01-Portfolio - Github et Astro.docx` — scripts d'audit Wi-Fi défensif, structuration GitHub, squelettes de projets Selenium/API/CI
2. `02-Projet professionnel.docx` — structure du site web (Astro), choix du domaine `odeman.fr`, code de base (BaseLayout, Header, Footer, Hero, pages)
3. `03-Développement site Web pro.docx` — workflow dev → NAS (pré-prod) → OVH (prod), installation WSL2/Node/Git/SSH sur Windows

## 2. Analyse et recommandations données

Après lecture complète des trois documents, les recommandations suivantes ont été formulées :

- **Pas besoin d'héberger soi-même** : un site Astro compile en fichiers statiques (HTML/CSS/JS) qui n'ont besoin d'aucun serveur applicatif. La Flybox et l'absence d'hébergement sur le NAS ne sont donc pas des obstacles.
- **Architecture recommandée** :
  - Développement local sur Zeus (Node/Astro, déjà configuré avec WSL2 selon les échanges précédents)
  - **GitHub** comme pivot (dépôt `nblitte.github.io` ou `nblitte/portfolio`)
  - **NAS Synology** = environnement de pré-prod/validation uniquement (Docker + Nginx), jamais exposé à Internet — zéro risque de sécurité côté domicile
  - **Production = GitHub Pages** : gratuit, HTTPS automatique, domaine personnalisé supporté (vérifié via la documentation GitHub officielle)
  - **CI/CD** : GitHub Actions build + déploie automatiquement à chaque push sur `main`
- **Sur le domaine `odeman.fr`** : statut non vérifiable depuis l'environnement Claude (le protocole WHOIS est bloqué par le proxy réseau, et aucune trace d'un site actif n'apparaît dans les résultats de recherche). **Action requise côté utilisatrice** : vérifier dans l'espace client OVH si le domaine est toujours détenu et jusqu'à quand.
- **Remarque sur le nom** : pour un positionnement cybersécurité, un nom nécessitant une explication (« odeman » = clan/tribu en ojibwé) consomme une partie du pitch recruteur. Une alternative comme `nathalieblitte.fr` irait plus directement à l'essentiel — à trancher selon la préférence personnelle.
- Cette chaîne (dev local → GitHub → CI/CD → hébergement statique séparé) constitue en elle-même un argument d'entretien : elle démontre une architecture propre (surface d'attaque minimale, séparation dev/pré-prod/prod), pertinente pour un poste GRC/SOC.

## 3. Site construit (odeman-portfolio)

### 3.1 Stack technique

- **Astro 7.3.3** (site statique, TypeScript strict)
- Content Collections pour le portfolio et le blog (ajouter un article = déposer un `.md`)
- Déploiement prévu : GitHub Pages via GitHub Actions

### 3.2 Pages créées

| Page | Fichier | Contenu |
|---|---|---|
| Accueil | `src/pages/index.astro` | Hero, 3 blocs de compétences, 3 projets en vedette |
| À propos | `src/pages/a-propos.astro` | Parcours, ce qu'apporte le profil, outils |
| Compétences | `src/pages/skills.astro` | Cybersécurité, Tests/Qualité (ISTQB), Automatisation, API, DevOps, Gestion, Certifications |
| CV | `src/pages/cv.astro` | Squelette à compléter (profil, expériences, formations) |
| Portfolio | `src/pages/portfolio.astro` | Liste des projets + section Roadmap (projets à venir) |
| Blog | `src/pages/blog/index.astro` + `[...slug].astro` | Liste + rendu d'articles (vide pour l'instant) |
| Contact | `src/pages/contact.astro` | Liens email/LinkedIn/GitHub |
| Projet (détail) | `src/pages/projects/[...slug].astro` | Rendu d'une fiche projet |

### 3.3 Composants

`Header`, `Footer`, `Hero`, `ProjectCard`, `Seo` (dans `src/components/`) + `BaseLayout.astro` (dans `src/layouts/`) qui assemble tout et injecte les balises SEO/OpenGraph.

### 3.4 Configuration centralisée

`src/config/site.ts` regroupe : nom du site, titre, description, URL, liens (GitHub, LinkedIn, CV PDF, email), et le menu de navigation. **C'est le fichier à modifier en premier** pour personnaliser le site (email de contact notamment, actuellement un placeholder).

### 3.5 Projets du portfolio (Content Collections)

**a) `wifi-defensive-audit`** (`src/content/projects/wifi-defensive-audit.md`)
Basé sur le script bash réel déjà écrit dans les conversations précédentes : scan ARP (`arp-scan`), comparaison à une baseline, scoring de risque heuristique, génération d'un rapport Markdown en 10 sections (contexte, méthodologie, résultats, anomalies, recommandations priorisées, limites, annexes). Ce script existe déjà en tant que code — il reste à le déposer dans un vrai dépôt GitHub `wifi-defensive-audit`.

**b) `appsec-regression-testing`** (`src/content/projects/appsec-regression-testing.md`) — *ajouté lors de cette mise à jour*
Projet de non-régression sécurité sur OWASP Juice Shop, entièrement spécifié dans les conversations mais pas encore mis en œuvre dans un dépôt réel :
- **Web** : Selenium + Pytest — redirection si non authentifié, invalidation de session au logout, absence de messages d'erreur verbeux, contrôle RBAC sur l'interface admin
- **API** : Postman/Newman avec **extraction automatique de tokens** (script `api/get_tokens.py` qui se logue via `/rest/user/login` et injecte `user_token`/`admin_token` dans l'environnement Postman) — tests RBAC croisés (token standard refusé sur un endpoint admin, token admin accepté)
- **Rapports** : HTML (`pytest-html`, `newman-reporter-htmlextra`) + JUnit, archivés comme preuves
- **CI double version** :
  - **Jenkinsfile** : stages Checkout → Setup → tests Web → tests API → `post { always { junit ...; archiveArtifacts ... } }`
  - **GitHub Actions** (`.github/workflows/ci.yml`) : démarre Juice Shop en Docker, attend sa disponibilité, exécute la suite, publie les rapports en artifact, puis un second job (**`publish-reports`**) déploie automatiquement les rapports HTML sur GitHub Pages à chaque push sur `main`
- Un résumé exécutif Markdown auto-généré (`scripts/generate_summary_md.py`) liste les artefacts produits à chaque exécution

**c) Section Roadmap** (ajoutée sur `/portfolio`)
Quatre projets nommés dans les conversations mais jamais détaillés au-delà du nom — affichés comme cartes "à construire" pour montrer une trajectoire cohérente sans prétendre qu'ils existent déjà :
- `security-auth-controls-automation` — validation des contrôles d'authentification (web + API)
- `risk-register-mini-iso27001` — registre de risques façon ISO 27001/NIST
- `log-analysis-lab` — parsing de logs et détection d'anomalies (SOC)
- `policies-starter-pack` — modèles de politiques de sécurité (PSSI, charte, mots de passe)

## 4. Étapes techniques réalisées (avec commandes)

### 4.1 Vérification de l'environnement sur Zeus

```bash
which node npm git
node -v   # v22.23.2
npm -v    # 10.9.8
git --version   # 2.34.1
```

### 4.2 Construction du site

Le scaffolder officiel (`npm create astro@latest`) a échoué (pas de réseau direct depuis le shell distant sur Zeus, puis erreur de template côté environnement cloud). Le site a donc été **construit fichier par fichier** dans un environnement cloud disposant d'un accès réseau, puis testé (`npm install && npm run build`), avant d'être transféré sur Zeus via une archive `.tar.gz` (upload dans la conversation puis écriture dans le dossier connecté).

```bash
# Dans l'environnement de build (accès réseau)
npm install
npm run build     # génère dist/ — validation avant transfert
```

### 4.3 Incident rencontré et résolu : paquet `zod` corrompu

Lors de la première installation des dépendances **directement sur Zeus** (via le dossier réseau monté), le paquet `zod` (dépendance interne d'Astro) s'est retrouvé incomplet après téléchargement : 15 fichiers présents au lieu des 840 attendus, provoquant une erreur `ERR_MODULE_NOT_FOUND` sur `zod/v4/index.js` au build. Le problème persistait même après un `npm cache clean --force` et une réinstallation complète, ce qui a permis d'isoler la cause : **la copie du paquet extrait vers le dossier réseau monté (`$HOME/mnt/Cybersécurité/...`) tronquait silencieusement certains fichiers**, probablement lié à la connexion Flybox et/ou au montage réseau lui-même — pas un problème de dépendances npm.

**Correctif appliqué** :
```bash
# Téléchargement direct du tarball du paquet
curl -sS -o /tmp/zod.tgz https://registry.npmjs.org/zod/-/zod-4.6.5.tgz

# Extraction hors du montage réseau (dans /tmp, local au shell)
mkdir /tmp/zod_extract && tar xzf /tmp/zod.tgz -C /tmp/zod_extract

# Vérification : 840 fichiers présents, dossier v4/ intact
find /tmp/zod_extract/package -type f | wc -l

# Copie du paquet correctement extrait dans node_modules
rm -rf node_modules/zod
cp -r /tmp/zod_extract/package node_modules/zod
```

**Point de vigilance pour la suite** : si une future installation de dépendances échoue de façon similaire (erreur `ERR_MODULE_NOT_FOUND` sur un paquet qui devrait exister), il est probable que ce soit le même phénomène de troncature sur le montage réseau. La solution consiste à télécharger/extraire le paquet en dehors du dossier réseau (par exemple dans un dossier temporaire local à Zeus) puis à le copier ensuite.

### 4.4 Permissions de suppression

Le dossier `Cybersécurité` était initialement protégé contre la suppression de fichiers (protection par défaut). Une autorisation a été explicitement demandée et accordée pour permettre le nettoyage de `node_modules` pendant le dépannage ci-dessus ; elle reste active pour le reste de la session.

## 5. Arborescence actuelle du site

```
odeman-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD : build + déploiement GitHub Pages
├── .gitignore
├── README.md                       # Instructions de build/déploiement/personnalisation
├── JOURNAL.md                      # Ce fichier
├── astro.config.mjs                # URL du site (à mettre à jour selon le domaine choisi)
├── package.json
├── package-lock.json
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/                     # (vide — à remplir : og-default.png, portrait, etc.)
└── src/
    ├── content.config.ts           # Schémas des collections (projects, blog)
    ├── config/
    │   └── site.ts                 # Config centrale : nom, liens, email, navigation
    ├── components/
    │   ├── Header.astro
    │   ├── Footer.astro
    │   ├── Hero.astro
    │   ├── ProjectCard.astro
    │   └── Seo.astro
    ├── layouts/
    │   └── BaseLayout.astro
    ├── styles/
    │   └── global.css
    ├── content/
    │   ├── projects/
    │   │   ├── wifi-defensive-audit.md
    │   │   └── appsec-regression-testing.md
    │   └── blog/                   # (vide — premier article à venir)
    └── pages/
        ├── index.astro             # Accueil
        ├── a-propos.astro
        ├── cv.astro
        ├── skills.astro
        ├── contact.astro
        ├── portfolio.astro         # Liste projets + Roadmap
        ├── projects/
        │   └── [...slug].astro     # Template fiche projet
        └── blog/
            ├── index.astro
            └── [...slug].astro     # Template article
```

## 6. Comment continuer localement

Depuis `C:\Users\natha\Claude\Cybersécurité\odeman-portfolio` :

```bash
npm install       # si pas déjà fait / après modification de package.json
npm run dev       # serveur de développement sur http://localhost:4321
npm run build     # génère le site statique dans dist/
npm run preview   # sert le build de production en local pour vérification finale
```

## 7. Prochaines étapes

### Personnalisation immédiate (avant toute mise en ligne)
- [ ] Vérifier le statut du domaine `odeman.fr` dans l'espace client OVH (ou choisir une alternative, ex. `nathalieblitte.fr`)
- [ ] Renseigner un email de contact réel dans `src/config/site.ts` (actuellement un placeholder)
- [ ] Déposer un CV au format PDF dans `public/cv-nathalie-blitte.pdf`
- [ ] Compléter `src/pages/cv.astro` avec les expériences détaillées
- [ ] Ajouter une image Open Graph (`public/images/og-default.png`, 1200×630px) pour un bon rendu au partage LinkedIn

### Mise en ligne
- [ ] Créer le dépôt GitHub `nblitte.github.io` (ou `nblitte/portfolio`)
- [ ] Pousser le projet, activer GitHub Pages (Settings → Pages → Source : GitHub Actions)
- [ ] Une fois le domaine confirmé : ajouter `public/CNAME` + configurer les enregistrements DNS chez le registrar (A/ALIAS pour l'apex, CNAME pour `www`)

### Projets à construire réellement (dépôts GitHub à créer)
- [x] `wifi-defensive-audit` — dossier prêt (voir §8) ; reste à créer le dépôt GitHub et à y ajouter un rapport généré sur ton vrai réseau comme preuve
- [x] `appsec-regression-testing` — dossier prêt (voir §8) ; reste à l'exécuter contre le vrai Juice Shop (Docker) et à créer le dépôt GitHub
- [ ] `security-auth-controls-automation`, `risk-register-mini-iso27001`, `log-analysis-lab`, `policies-starter-pack` — à spécifier puis construire, dans cet ordre de priorité suggéré : contrôles d'authentification → registre de risques → analyse de logs → politiques

### Contenu éditorial
- [ ] Rédiger un premier article de blog (déposer un `.md` dans `src/content/blog/`)
- [ ] Ajouter le lien du portfolio sur le profil LinkedIn

### Infrastructure (optionnel, phase 2)
- [ ] Mettre en place le NAS Synology comme environnement de pré-prod (Docker + Nginx), jamais exposé à Internet
- [ ] Si Jenkins est utilisé réellement (au-delà du portfolio), envisager son installation sur le NAS plutôt qu'en exposition directe

## 8. Deuxième passe : scripts, dépôts, finitions professionnelles

### 8.1 Ce qui a été ajouté
Dossiers frères de `odeman-portfolio/` dans `Cybersécurité/` :

| Dossier | Contenu |
|---|---|
| `wifi-defensive-audit/` | Script d'audit ARP (`wifi_audit_full_md.sh`), simulateur d'intrus pour VM (`intrus_simulator.sh`), README, LICENSE MIT, SECURITY.md, workflow ShellCheck |
| `appsec-regression-testing/` | Selenium + Pytest (page objects), Postman/Newman avec extraction de tokens et contrôle RBAC, Jenkinsfile, GitHub Actions (tests, rapports publiés sur Pages), Dependabot, README, LICENSE, SECURITY.md |
| `nblitte/` | README de profil GitHub (à publier dans un dépôt nommé exactement `nblitte`) |

### 8.2 Ce qui a été vérifié (et ce qui ne l'a pas été)
- **wifi-defensive-audit** : `shellcheck` sans avertissement après corrections ; test fonctionnel complet avec `sudo`/`ip`/`arp-scan` simulés, en deux passes (baseline puis détection d'un nouvel appareil). Un bug de séparateur dans la construction des raisons de risque, invisible pour ShellCheck, a été trouvé et corrigé grâce à ce test. **Non testé** sur un vrai réseau.
- **appsec-regression-testing** :
  - API : validée contre un faux serveur imitant Juice Shop, y compris une régression RBAC volontaire (`BREAK_RBAC=1`) qui fait bien échouer la collection.
  - Web : validée dans un vrai Chrome headless contre une petite SPA factice reproduisant les sélecteurs de Juice Shop : 4 tests passent ; une régression RBAC volontaire fait échouer le test attendu.
  - Lint : `actionlint` (3 workflows), `shellcheck`, `pyflakes` propres.
  - **Non testé contre le vrai Juice Shop** (Docker indisponible dans l'environnement de build). Premier vrai run à faire chez toi : `docker run -d -p 3000:3000 bkimminich/juice-shop`, puis `./scripts/bootstrap.sh && ./scripts/run_all.sh`. Si un sélecteur ne correspond plus à la version de Juice Shop, les tests le disent (« Update selectors »).
- Modifications faites suite à ces tests : `webdriver-manager` supprimé au profit de Selenium Manager (intégré à Selenium, plus de téléchargement de driver à part) ; ajout de `login_and_wait` pour éviter une course entre le clic de connexion et la navigation suivante ; `run_all.sh` continue jusqu'aux rapports même si un test échoue, puis retourne un code d'erreur.

### 8.3 Ajouts « pro » et raisonnement
- **Dependabot** : ajouté sur `appsec-regression-testing` et `odeman-portfolio` (dépendances pip/npm + GitHub Actions). **Pas** sur `wifi-defensive-audit` : script bash pur, sans gestionnaire de paquets, donc rien à surveiller. Remplacé par un workflow ShellCheck, qui apporte une vraie valeur à ce dépôt.
- **SECURITY.md + LICENSE MIT** sur les trois dépôts.
- **Sitemap** : `@astrojs/sitemap` génère `sitemap-index.xml` (et non `sitemap.xml`) ; `robots.txt` corrigé en conséquence. La page `/neovim` en est exclue.
- **Bug corrigé** : `skills.astro`, `projects/[...slug].astro` et `blog/[...slug].astro` passaient `title=` au layout, qui attend `pageTitle=` ; les titres d'onglet retombaient sur le titre par défaut. Corrigé.

### 8.4 Décision : template Neovim
Le template Neovim repéré (`potfolio2.0`, ~61 fichiers, gestion d'état curseur/clavier en TypeScript) n'a pas été migré en entier : trop lourd et fragile pour un site que des recruteurs doivent parcourir en quelques secondes, souvent depuis un téléphone. Décision prise à partir de ta précision (les visiteurs de ton GitHub sont des informaticiens, le CV part par d'autres canaux) :
- le **site principal reste sobre**, lisible tout de suite ;
- une **page `/neovim`** (bouton « nvim » dans l'en-tête) offre une version éditeur : arborescence, `j/k`, `gg/G`, `1..9`, `:e`, `:ls`, `:q`, `?`. Elle se construit à partir des mêmes projets que le site, donc reste à jour toute seule.
Testée dans Chrome headless (navigation, commandes, aide, retour au site). Pour aller plus loin plus tard : récupérer thème ou animations du template d'origine.

### 8.5 À faire de ton côté
- [ ] Créer les dépôts GitHub : `nblitte.github.io` (site), `wifi-defensive-audit`, `appsec-regression-testing`, `nblitte` (profil)
- [ ] Exécuter `appsec-regression-testing` contre le vrai Juice Shop et corriger les sélecteurs si besoin
- [ ] Générer un vrai rapport avec `wifi-defensive-audit` sur ton réseau et le déposer dans `evidence/`
- [ ] Renseigner un email public réel, déposer le CV PDF
- [ ] Le blog est vide : publier au moins un premier article (un `.md` dans `src/content/blog/`)

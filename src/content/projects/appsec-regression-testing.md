---
title: "Non-régression sécurité applicative : Selenium + API + CI"
subtitle: "Validation automatisée de contrôles de sécurité (Web + API) sur OWASP Juice Shop, avec pipeline CI et rapports HTML/JUnit."
date: "2026-09-20"
track: "Mixed"
tags: ["Selenium", "Pytest", "Postman/Newman", "Jenkins", "GitHub Actions", "RBAC"]
github: "https://github.com/nblitte/appsec-regression-testing"
deliverables: ["Rapport HTML Pytest", "Rapport HTML Newman (htmlextra)", "Rapports JUnit archivés en CI", "Pipeline Jenkins + GitHub Actions", "Publication des rapports sur GitHub Pages"]
---

> **Statut : squelette et pipeline entièrement spécifiés — mise en œuvre du repo GitHub en cours.**

## Contexte

S'assurer qu'une application reste conforme à des contrôles de sécurité essentiels après chaque évolution, en combinant tests Web (Selenium) et tests API (Postman/Newman), exécutés automatiquement en intégration continue. Application cible : [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/), volontairement vulnérable, riche et reconnue des recruteurs.

## Objectifs

Vérifier en continu, après chaque changement, que l'application respecte des contrôles de sécurité essentiels :

**Web (Selenium + Pytest)**
- Accès non authentifié → redirection vers login
- Logout → session correctement invalidée
- Messages d'erreur non verbeux (pas de stack trace ni d'informations sensibles exposées)
- RBAC UI : la page d'administration est inaccessible à un utilisateur standard

**API (Postman/Newman)**
- Endpoint protégé refuse l'accès sans token (401/403)
- Endpoint protégé accessible avec un token utilisateur standard
- Endpoint admin refusé à un token standard, accepté avec un token admin (contrôle RBAC croisé)
- Vérification "no-leak" basique dans les réponses d'erreur (pas de trace technique)

## Méthodologie

1. Lancement de l'application cible (Docker : `docker run --rm -p 3000:3000 bkimminich/juice-shop`)
2. Extraction automatique des tokens utilisateur standard et admin via l'API de login (`api/get_tokens.py`), injectés dans l'environnement Postman
3. Exécution des tests Selenium/Pytest (Web) et Postman/Newman (API)
4. Génération de rapports HTML (pytest-html, newman-reporter-htmlextra) et JUnit (exploitables en CI)
5. Archivage des rapports comme preuves d'audit à chaque exécution

## Intégration continue

Le pipeline est spécifié en **double version** :

- **Jenkinsfile** : stages Checkout → Setup (venv Python + Newman) → tests Web → tests API → archivage JUnit + artefacts (`post { always { junit ...; archiveArtifacts ... } }`)
- **GitHub Actions** (`.github/workflows/ci.yml`) : démarre Juice Shop en conteneur Docker, attend sa disponibilité, exécute la suite complète, publie les rapports en artifact téléchargeable, puis un second job publie automatiquement les rapports HTML sur GitHub Pages à chaque push sur `main`

## Approche qualité & preuve

- Règles d'acceptation explicites par contrôle (ex : `WhoAmI sans token => 401/403 (ACCEPT), 200 (FAIL)`)
- Reproductibilité : tokens et configuration extraits automatiquement, jamais codés en dur
- Résumé exécutif auto-généré (`SUMMARY.md`) listant les artefacts produits à chaque run

## Limites

- Les sélecteurs UI peuvent varier selon la version de Juice Shop utilisée (à figer par tag Docker)
- Validation de contrôles uniquement — aucune exploitation, aucune tentative d'intrusion
- Le badge Jenkins n'a de sens que si le serveur Jenkins est accessible publiquement ; sinon privilégier le badge GitHub Actions

## Ce que je ferais en v2

- Tests de headers de sécurité (CSP, HSTS, X-Frame-Options selon contexte)
- Tests de limitation de débit (rate limiting) si configuré côté application
- Exécution planifiée (nightly) avec historisation des rapports par date/commit plutôt qu'un écrasement à chaque run

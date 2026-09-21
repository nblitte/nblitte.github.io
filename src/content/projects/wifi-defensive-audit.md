---
title: "Audit Wi-Fi défensif : inventaire & détection d'anomalies"
subtitle: "Baseline réseau, détection de nouveaux hôtes, rapport Markdown exploitable en audit."
date: "2026-09-20"
track: "SOC"
tags: ["Réseau", "Détection", "Reporting", "Bash"]
github: "https://github.com/nblitte/wifi-defensive-audit"
deliverables: ["Rapport Markdown complet", "Baseline CSV", "Preuves arp-scan horodatées", "Scoring de risque"]
---

## Contexte

Simulation d'un environnement type PME : détecter l'apparition d'un appareil non référencé sur le LAN Wi-Fi et produire un livrable exploitable en audit.

## Objectifs

- Inventorier les hôtes actifs sur le réseau local (scan ARP)
- Détecter les nouveaux appareils et les appareils disparus par rapport à une baseline
- Produire un rapport Markdown structuré et priorisé (contexte, méthodologie, résultats, risques, recommandations)

## Méthodologie

1. Découverte des hôtes actifs via `arp-scan` sur l'interface réseau locale
2. Normalisation des résultats (IP, MAC en minuscules, vendor)
3. Comparaison avec une baseline de référence (nouveaux / disparus)
4. Scoring de risque heuristique pour prioriser la revue (MAC non approuvée, vendor inconnu, nouvel appareil)

## Résultats

- Détection automatique des nouveaux hôtes avec preuve horodatée
- Rapport Markdown en 10 sections : contexte, méthodologie, synthèse, inventaire, anomalies, variations, analyse de risques, recommandations priorisées, limites, annexes
- Recommandations classées par priorité (WPS off, WPA2-AES/WPA3, réseau invité, segmentation IoT)

## Approche qualité & méthodologie

- Scénarios de test définis en amont (nouvel hôte, isolation réseau invité, durcissement de configuration)
- Critères de succès/échec explicites
- Reproductibilité et traçabilité des résultats (preuves brutes conservées)

## Limites

- Visibilité limitée au segment L2 (scan ARP)
- Les adresses MAC aléatoires (mobiles) peuvent générer de faux positifs "nouveaux appareils"
- Le réseau scanné est une approximation en /24, à ajuster selon l'architecture réelle

## Ce que je ferais en v2

- Enrichissement du vendor lookup (base OUI locale)
- Export multi-format (Markdown + JSON + CSV)
- Historisation des rapports (un dossier horodaté par exécution)

# SUIVO — Dossier complet pour le concours JNSP « Sprint Digital » 2026

**Problématique** : suivi des demandes administratives.
**Solution** : une plateforme web et mobile (PWA) qui donne un **numéro de suivi** à chaque demande, relie les services qui la traitent avec leurs délais, et permet à l'usager de **suivre et faire avancer son dossier à distance** par l'appli, SMS ou WhatsApp.
**Promesse** : *« Votre dossier administratif, suivi comme un colis. »*

## Sommaire des livrables

| # | Livrable | Fichier | Critère du jury servi |
|---|---|---|---|
| 00 | **Prompt maître** réutilisable pour produire tout le dossier | [00-PROMPT-MAITRE.md](./00-PROMPT-MAITRE.md) | — |
| 00b | **Prompt « dossier PDF »** : maquette complète et structurée de tout le projet en un seul PDF | [00b-PROMPT-DOSSIER-PDF.md](./00b-PROMPT-DOSSIER-PDF.md) | Tous |
| 📘 | **Dossier de candidature complet (PDF, 69 pages)**, produit avec le prompt 00b | [SUIVO-dossier-JNSP-2026.pdf](./SUIVO-dossier-JNSP-2026.pdf) · [sources et rapport](./dossier-pdf/) | Tous |
| 01 | Études : arbre à problèmes, coût du statu quo, TAM/SAM/SOM, benchmark, personas, plan de recherche, PESTEL, SWOT | [01-etudes.md](./01-etudes.md) | Pertinence, impact |
| 02 | Business Model Canvas, Lean Canvas, Value Proposition Canvas | [02-business-model-canvas.md](./02-business-model-canvas.md) | Viabilité |
| 03 | Product Vision Board + métriques (North Star) | [03-product-vision-board.md](./03-product-vision-board.md) | Pertinence, innovation |
| 04 | Product backlog : 11 épopées, 26 user stories, MoSCoW, RICE, sprints, DoR/DoD (+ CSV pour Jira/Trello) | [04-product-backlog.md](./04-product-backlog.md) · [CSV](./04-product-backlog.csv) | Faisabilité |
| 05 | User workflows (dépôt, traitement, pièce manquante, relance, USSD, machine à états, arborescence) | [05-user-workflows.md](./05-user-workflows.md) | Pertinence |
| 06 | Élaboration du processus : AS-IS → TO-BE, gains, SLA, RACI, conduite du changement, intégration aux SI, conformité | [06-processus.md](./06-processus.md) | Impact, passage à l'échelle |
| 07 | Modèle financier 36 mois (Excel avec formules, 3 scénarios) | [07-modele-financier/](./07-modele-financier) | Viabilité |
| 08 | Pitch deck (PowerPoint, HTML et PDF), script de 3 minutes, 15 questions du jury | [08-pitch-deck/](./08-pitch-deck) | Pitch |
| 09 | Maquettes, prototype, charte graphique | [09-maquettes-prototype.md](./09-maquettes-prototype.md) | Innovation, UX |
| 10 | Organisation de la startup : organigrammes 0/12/36 mois, rôles, gouvernance OHADA, rituels, OKR, recrutement | [10-organisation.md](./10-organisation.md) | Équipe |
| 11 | **MVP fonctionnel** React + Tailwind (PWA) · Node.js + Express · PostgreSQL | [mvp/](./mvp) | Faisabilité, démo |

## Correspondance avec le prompt maître

Chaque section du [prompt maître](./00-PROMPT-MAITRE.md) a son livrable, et chaque livrable se termine par « Risques & hypothèses critiques » et « Prochaine action en 48 h » (règle n° 8).

| Section du prompt | Où la trouver |
|---|---|
| 0. Nom, promesse, pitch d'une phrase | [01-etudes.md §0](./01-etudes.md) |
| 1. Études (1.1 à 1.6) | [01-etudes.md](./01-etudes.md) |
| 2. Business Model Canvas, Lean Canvas, Value Proposition Canvas | [02-business-model-canvas.md](./02-business-model-canvas.md) |
| 3. Product Vision Board | [03-product-vision-board.md](./03-product-vision-board.md) |
| 4. Product backlog + export CSV | [04-product-backlog.md](./04-product-backlog.md) · [CSV](./04-product-backlog.csv) |
| 5. User workflows (a) à (f) | [05-user-workflows.md](./05-user-workflows.md) |
| 6. Élaboration du processus | [06-processus.md](./06-processus.md) |
| 7. Modèle financier 36 mois, tableur avec formules | [07-modele-financier/](./07-modele-financier) |
| 8. Prototype et maquettes | [09-maquettes-prototype.md](./09-maquettes-prototype.md) ; le prototype cliquable est le MVP |
| 9. MVP | [mvp/](./mvp) |
| 10. Pitch deck, script, questions du jury | [08-pitch-deck/](./08-pitch-deck) |
| 11. Organisation de la startup | [10-organisation.md](./10-organisation.md) |
| Format : sommaire, tableau des critères, checklist, plan J-30 → J-0 | Ce README |

## Chiffres clés

| | |
|---|---|
| Déplacements par démarche | 4–5 → **1 à 2** |
| Coût pour l'usager par démarche | ≈ 7 000 FCFA → ≈ 2 000 FCFA |
| Cible à 36 mois | 25 communes + 2 organismes nationaux, ≈ 650 000 demandes suivies/an |
| Chiffre d'affaires à 3 ans (scénario central) | 256 M FCFA, marge brute de 77 %, équilibre vers le mois 36 |
| Besoin de financement | 393 M FCFA sur 36 mois (dont 85 M pour livrer le pilote) |

## Lancer la démo en 1 minute
```bash
cd mvp && docker compose up      # puis http://localhost:5173
```
Comptes et scénario de démo : [mvp/README.md](./mvp/README.md).

## Checklist « Prêt pour le jury »
- [x] Problème chiffré et sourcé (hypothèses identifiées)
- [x] Solution démontrable : le MVP tourne, 7 tests passent, parcours vérifié dans un navigateur
- [x] Modèle économique où le citoyen ne paie jamais pour le suivi de base
- [x] Inclusion : guichet assisté, SMS, USSD (feuille de route)
- [x] Conformité : ARTCI, données minimales, journal d'audit
- [ ] Réaliser 10 entretiens usagers et 3 entretiens agents avant le jury (citer 2 verbatims dans le pitch)
- [ ] Obtenir une lettre d'intention d'une mairie
- [ ] Répéter le pitch 10 fois avec chronomètre (3 min), dont 2 fois devant des inconnus
- [ ] Préparer une démo hors ligne de secours (vidéo de 60 s + captures)
- [ ] Vérifier la disponibilité du nom de domaine et de la marque SUIVO

## Plan d'action J-30 → J-0
| Période | Actions |
|---|---|
| J-30 → J-21 | Entretiens terrain (devant 5 mairies), questionnaire, ajuster les hypothèses du modèle financier |
| J-20 → J-14 | Rencontre avec le secrétaire général d'une mairie pilote ; modélisation de ses 3 procédures réelles dans SUIVO |
| J-13 → J-7 | Déployer le MVP sur un hébergement public ; brancher une passerelle SMS de test ; vidéo de démo |
| J-6 → J-2 | Répétitions du pitch, questions/réponses, impressions (PDF du deck, reçu QR de démonstration) |
| J-1 → J-0 | Vérification du matériel, démo de secours, repos |

> Les données de démonstration (noms, numéros de téléphone, dossiers) sont **fictives**. Les chiffres marqués [H] dans les livrables sont des hypothèses à valider pendant la phase de découverte.

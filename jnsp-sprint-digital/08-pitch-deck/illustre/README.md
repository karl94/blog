# Pitch deck illustré — sources et rapport

Produit en exécutant le prompt [`00c-PROMPT-PITCH-ILLUSTRE.md`](../../00c-PROMPT-PITCH-ILLUSTRE.md).

- **Deck** : [`../SUIVO-pitch-illustre.pptx`](../SUIVO-pitch-illustre.pptx), 15 diapositives 16:9, modifiable, notes orales sur chaque diapositive.
- **PDF** : [`../SUIVO-pitch-illustre.pdf`](../SUIVO-pitch-illustre.pdf), polices intégrées.
- **Illustrations sources** : dossier [`svg/`](./svg) (vectoriel, réutilisable dans d'autres supports).
- **Régénération** : `npm install pptxgenjs@3.12.0 sharp@0.33.5 react@18.3.1 react-dom@18.3.1 react-icons@5.4.0 && node generer.js`

## Rapport

### Choix éditorial
Aucune étude de marché n'ayant été menée, le deck **n'affiche aucun chiffre ni estimation non mesurés** (taille de marché, coût du problème, prix, chiffre d'affaires, objectif chiffré). Il démontre la **valeur ajoutée pour chaque acteur**, de façon qualitative et vérifiable, et propose de mesurer les gains réels pendant le pilote.

### Diapositives produites — alignées sur les 7 points attendus par le jury (10 minutes)
| # | Critère du jury | Diapositive | Temps |
|---|---|---|---|
| 1 | — | Page de garde | 20 s |
| 2 | — | Sommaire : les 7 points | 15 s |
| 3 | 1 · Problème à résoudre | « Revenez la semaine prochaine » : 4 vignettes, 3 constats | 45 s |
| 4 | 1 · Problème à résoudre | Trois personnes, une même attente (personas fictifs) | 40 s |
| 5 | 2 · Solution proposée | Une plateforme de suivi des demandes (captures annotées, 4 bénéfices) | 40 s |
| 6 | 2 · Fonctionnement | Parcours en 4 étapes, couloirs usager / administration, sans smartphone | 40 s |
| 7 | 2 · Cas pratique | Capital décès d'Awa, du dépôt au retrait : 16 événements, 5 acteurs | 1 min |
| 8 | 2 · Cas pratique | Ce que reçoit Awa (SMS), ce que voient l'agent, le chef de service, le ministère | 40 s |
| 9 | 3 · Impact | Pour le citoyen (citoyen, sans smartphone, familles) / pour le service public (agent, chef de service, État) | 50 s |
| 10 | 4 · Caractère innovant | Le suivi de colis appliqué au service public : 6 innovations | 45 s |
| 11 | 5 · Faisabilité | Faisabilité technique établie (conception, technologies éprouvées, briques existantes) ; « Où en sommes-nous ? » (fait / à réaliser / ensuite) ; architecture | 50 s |
| 12 | 6 · Expérience utilisateur et inclusion | Simplicité (écran réel) et 5 situations d'inclusion | 45 s |
| 13 | 7 · Déploiement | Pilote → extension → généralisation ; pourquoi c'est reproductible | 40 s |
| 14 | 7 · Pérennisation | Modèle durable : flux de valeur, principes, ancrage institutionnel | 40 s |
| 15 | — | Notre demande et notre engagement | 30 s |
| | | **Total** | **10 min** |

**Statut présenté au jury :** la solution n'est pas encore développée et il n'y a pas de prototype à tester. Sa faisabilité technique est établie : fonctions conçues et maquettées, technologies standard et éprouvées, briques existantes (SMS, USSD, hébergement local). Les visuels de l'application sont présentés comme des **maquettes**.

Le minutage figure au début de chaque note du présentateur (« [≈ 45 s] »). Les éléments annoncés comme « prévus » (code USSD, messages vocaux en langues locales) ne sont pas encore développés dans le prototype : ils sont présentés honnêtement comme tels.

Motif récurrent : une ligne de points d'étape (un par diapositive) en haut à droite, comme un suivi de colis, qui avance de diapositive en diapositive.

### Sources du contenu
Problème et personas : 01-etudes.md · Fonctionnalités et parcours : MVP, 05-user-workflows.md, 06-processus.md · Modèle : 02-business-model-canvas.md (sans les prix).

### Contrôles
- Fichier validé (structure OOXML) ; rendu de chaque diapositive vérifié en image ; corrigés : pastilles qui masquaient une bulle, chiffre qui débordait, nom de persona sur deux lignes, repères qui cachaient la capture, titres trop longs, titre de clôture trop long.
- Texte alternatif sur chaque image, graphique natif modifiable, police Calibri.

### À personnaliser
- Photos et noms de l'équipe (à ajouter si vous présentez l'équipe), logo définitif.

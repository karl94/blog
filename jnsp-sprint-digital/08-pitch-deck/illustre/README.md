# Pitch deck illustré — sources et rapport

Produit en exécutant le prompt [`00c-PROMPT-PITCH-ILLUSTRE.md`](../../00c-PROMPT-PITCH-ILLUSTRE.md).

- **Deck** : [`../SUIVO-pitch-illustre.pptx`](../SUIVO-pitch-illustre.pptx), 10 diapositives 16:9, modifiable, notes orales sur chaque diapositive.
- **PDF** : [`../SUIVO-pitch-illustre.pdf`](../SUIVO-pitch-illustre.pdf), polices intégrées.
- **Illustrations sources** : dossier [`svg/`](./svg) (vectoriel, réutilisable dans d'autres supports).
- **Régénération** : `npm install pptxgenjs@3.12.0 sharp@0.33.5 react@18.3.1 react-dom@18.3.1 react-icons@5.4.0 && node generer.js`

## Rapport

### Choix éditorial
Aucune étude de marché n'ayant été menée, le deck **n'affiche aucun chiffre ni estimation non mesurés** (taille de marché, coût du problème, prix, chiffre d'affaires, objectif chiffré). Il démontre la **valeur ajoutée pour chaque acteur**, de façon qualitative et vérifiable, et propose de mesurer les gains réels pendant le pilote.

### Diapositives produites
| # | Diapositive | Illustration |
|---|---|---|
| 1 | Page de garde | Colis suivi (repère + trajet), capture d'accueil dans un cadre de téléphone |
| 2 | Contexte — le problème | 4 vignettes : guichet, woro-woro, attente, « il manque une pièce » ; 3 constats en icônes |
| 3 | Contexte — qui souffre | 3 portraits illustrés (personas fictifs) : Awa, Konan, Mme Bamba |
| 4 | Solution | 2 captures réelles annotées (repères 1-2-3), 4 bénéfices en icônes |
| 5 | Comment ça marche | Parcours en 4 étapes, couloirs Usager / Administration, encadré sans smartphone, avant/après |
| 6 | Cas pratique — le parcours | Schéma en couloirs : Awa, guichet de la Fonction publique, liquidation des droits, Trésor public, SUIVO ; 16 événements numérotés du dépôt au retrait (pièce manquante, retard, relance compris) |
| 7 | Cas pratique — ce que voit chacun | Téléphone avec les SMS reçus par Awa, écrans de l'agent et du chef de service, traçabilité pour le ministère |
| 8 | Valeur ajoutée pour chaque acteur | 6 cartes : citoyen, usager sans smartphone, agent, chef de service, État, partenaires |
| 9 | Le modèle économique | Flux de valeur et de paiement, 4 principes (sans prix) |
| 10 | Clôture | La demande de pilote et l'engagement de mesurer les gains sur le terrain |

Motif récurrent : une ligne de 10 points d'étape en haut à droite, comme un suivi de colis, qui avance de diapositive en diapositive.

### Sources du contenu
Problème et personas : 01-etudes.md · Fonctionnalités et parcours : MVP, 05-user-workflows.md, 06-processus.md · Modèle : 02-business-model-canvas.md (sans les prix).

### Contrôles
- Fichier validé (structure OOXML) ; rendu de chaque diapositive vérifié en image ; corrigés : pastilles qui masquaient une bulle, chiffre qui débordait, nom de persona sur deux lignes, repères qui cachaient la capture, titres trop longs, titre de clôture trop long.
- Texte alternatif sur chaque image, graphique natif modifiable, police Calibri.

### À personnaliser
- Photos et noms de l'équipe (à ajouter si vous présentez l'équipe), logo définitif.

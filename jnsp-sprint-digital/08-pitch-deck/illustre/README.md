# Pitch deck illustré — sources et rapport

Produit en exécutant le prompt [`00c-PROMPT-PITCH-ILLUSTRE.md`](../../00c-PROMPT-PITCH-ILLUSTRE.md).

- **Deck** : [`../SUIVO-pitch-illustre.pptx`](../SUIVO-pitch-illustre.pptx), 8 diapositives 16:9, modifiable, notes orales sur chaque diapositive.
- **PDF** : [`../SUIVO-pitch-illustre.pdf`](../SUIVO-pitch-illustre.pdf), polices intégrées.
- **Illustrations sources** : dossier [`svg/`](./svg) (vectoriel, réutilisable dans d'autres supports).
- **Régénération** : `npm install pptxgenjs@3.12.0 sharp@0.33.5 react@18.3.1 react-dom@18.3.1 react-icons@5.4.0 && node generer.js`

## Rapport

### Diapositives produites
| # | Diapositive | Illustration |
|---|---|---|
| 1 | Page de garde | Colis suivi (repère + trajet), capture d'accueil dans un cadre de téléphone |
| 2 | Contexte — le problème | 4 vignettes : guichet, woro-woro, attente, « il manque une pièce » ; 3 chiffres clés |
| 3 | Contexte — qui souffre | 3 portraits illustrés : Awa, Konan, Mme Bamba |
| 4 | Solution | 2 captures réelles annotées (repères 1-2-3), 4 bénéfices en icônes |
| 5 | Comment ça marche | Parcours en 4 étapes, couloirs Usager / Administration, encadré sans smartphone, avant/après |
| 6 | Le marché | Cercles TAM/SAM/SOM, carte stylisée de la Côte d'Ivoire, extension UEMOA |
| 7 | Le modèle économique | Schéma des flux de valeur et de paiement, graphique natif du CA année 3 par source |
| 8 | Clôture | La demande et l'objectif de 10 000 déplacements évités par mois |

Motif récurrent : une ligne de 8 points d'étape en haut à droite, comme un suivi de colis, qui avance de diapositive en diapositive.

### Chiffres utilisés et sources
| Chiffre | Source |
|---|---|
| 4–5 déplacements, ≈ 7 000 FCFA par démarche | 01-etudes.md (hypothèses [H], signalées par un astérisque) |
| ≈ 30 M / ≈ 12 M / ≈ 1,2 M démarches | 01-etudes.md (hypothèses [H]) |
| Licence 3 à 60 M FCFA/an, premium 500 à 2 000 FCFA, API 100 FCFA | 02-business-model-canvas.md |
| CA année 3 par source, CA total, marge brute | Modèle financier, scénario central (valeurs calculées, via `dossier-pdf/finances.json`) |
| Citations des personas | 01-etudes.md, section Personas (« job-to-be-done ») |
| 85 M FCFA, 10 000 déplacements évités/mois | Pitch existant et Product Vision Board |

### Contrôles
- Fichier validé (structure OOXML) ; rendu de chaque diapositive vérifié en image ; corrigés : pastilles qui masquaient une bulle, chiffre qui débordait, nom de persona sur deux lignes, repères qui cachaient la capture, titres trop longs, étiquettes de carte superposées.
- Texte alternatif sur chaque image, graphique natif modifiable, police Calibri.

### À personnaliser
- Photos et noms de l'équipe (à ajouter si vous présentez l'équipe), logo définitif.
- La carte est stylisée et approximative (mention « non à l'échelle » sur la diapositive) ; la remplacer par un fond de carte officiel si besoin.

# 07 — Modèle financier SUIVO (36 mois)

Critère du jury servi : viabilité économique.

- **Fichier** : [`modele-financier-suivo.xlsx`](./modele-financier-suivo.xlsx). Toutes les cellules calculées sont des formules ; les hypothèses sont en bleu dans l'onglet *Hypothèses*. Le scénario se choisit en `Hypothèses!C4` (1 = pessimiste, 2 = central, 3 = optimiste).
- **Régénération** : `python3 generer_modele.py`
- Onglets : *Synthèse* (P&L annuel, KPI, graphiques), *Hypothèses*, *Effectifs* (plan de recrutement), *Mensuel* (clients, CA, coûts, EBITDA, trésorerie avec délai de paiement de l'État).
- Montants en **FCFA hors taxes**. L'impôt sur les sociétés et la TVA ne sont pas modélisés (résultat négatif sur la période ; TVA neutre).

## Hypothèses principales

| Hypothèse | Valeur centrale |
|---|---|
| Pilote gratuit | mois 1 à 6 (1 commune, 1 000 demandes/mois) |
| Nouvelles communes / mois | 0,5 (A1) → 0,75 (A2) → 1 (A3) |
| Organismes nationaux | 1er au mois 13, 2e au mois 25 |
| Licence commune / organisme | 6 M / 40 M FCFA par an |
| Mise en place commune / organisme | 2 M / 15 M FCFA |
| Demandes suivies par commune / organisme | 2 000 / 8 000 par mois |
| Premium usagers | 3 % des demandes × 1 000 FCFA (30 % reversés aux partenaires) |
| API B2B | dès le mois 19, 0,1 appel/demande × 100 FCFA |
| Délai de paiement de l'État | 3 mois (6 en pessimiste) |
| Financement | apport 8 M (M1), prix/incubateur 10 M (M3), pré-amorçage 75 M (M4), subvention bailleur 50 M (M10), amorçage 250 M (M15) |

## Résultats — scénario central

| FCFA | Année 1 | Année 2 | Année 3 |
|---|---|---|---|
| Communes clientes (fin d'année) | 3 | 12 | 24 |
| Organismes nationaux | 0 | 1 | 2 |
| Demandes suivies | 33 000 | 297 000 | 648 000 |
| **Chiffre d'affaires** | **12,1 M** | **130,9 M** | **255,9 M** |
| Marge brute | 3,6 M (30 %) | 95,8 M (73 %) | 197,1 M (77 %) |
| EBITDA | −41,9 M | −57,1 M | −20,6 M |
| Trésorerie fin d'année | 94,4 M | 262,6 M | 212,9 M |
| Effectif (ETP) | 8 | 14 | 17 |

- **Point mort mensuel** : atteint vers le **mois 36–38** (EBITDA mensuel ≈ 0 au mois 36).
- **Besoin de financement total** : 393 M FCFA (≈ 600 k€), dont 250 M en amorçage au mois 15.
- **Coût complet par demande suivie (A3)** : ≈ 430 FCFA, à comparer aux ≈ 7 000 FCFA que coûte aujourd'hui l'incertitude à l'usager.

## Comparaison des scénarios

| | Pessimiste | Central | Optimiste |
|---|---|---|---|
| CA année 3 | 111,5 M | 255,9 M | 339,9 M |
| EBITDA année 3 | −137,7 M | −20,6 M | +50,9 M |
| Trésorerie fin A3 | 35,7 M | 212,9 M | 382,0 M |
| Point mort | > 36 mois | ≈ 36–38 mois | mois 20 |

**Lecture** : même en scénario pessimiste (40 % de clients en moins, prix −15 %, paiement de l'État à 6 mois), la trésorerie reste positive sur 36 mois. Le levier principal est la **vitesse de signature des communes** ; le second est l'arrivée des **organismes nationaux**, qui pèsent autant que 7 communes chacun.

## Unit economics (scénario central, année 3)
- CA moyen par administration cliente : ≈ 8,8 M FCFA/an.
- Coût de déploiement d'une commune : 1 M FCFA → récupéré en ≈ 2 mois de licence (hors délai de paiement).
- Marge brute récurrente > 75 % : modèle SaaS classique, coûts variables dominés par les SMS.

## Risques financiers et parades
| Risque | Parade |
|---|---|
| Retard de paiement public | Subventions bailleurs, revenus B2B2C/API encaissés immédiatement via Mobile Money, affacturage |
| Cycle de vente public long | Pilote gratuit → convention cadre ministérielle couvrant plusieurs communes |
| Coût SMS | Bascule progressive vers WhatsApp et push (≈ 3× moins cher) ; refacturation au-delà d'un quota |

## Risques & hypothèses critiques
1. **Rythme de signature** : c'est le premier levier du modèle. Une commune tous les 2 mois en année 1 suppose un sponsor actif.
2. **Charges sociales et fiscalité** : le taux de 25 % de charges est une approximation, et l'impôt sur les sociétés et l'impôt minimum forfaitaire ne sont pas modélisés. *Action* : faire valider le modèle par un expert-comptable inscrit à l'Ordre.
3. **Financements** : la subvention de 50 M FCFA au mois 10 et la levée de 250 M au mois 15 ne sont pas acquises. *Test de résistance* : dans le scénario pessimiste, la trésorerie reste positive, mais avec moins de 3 M FCFA au plus bas.

## Prochaine action en 48 h
Mettre le scénario actif sur « pessimiste » (`Hypothèses!C4 = 1`), identifier le mois de trésorerie la plus basse et préparer le plan B correspondant (report d'embauches).

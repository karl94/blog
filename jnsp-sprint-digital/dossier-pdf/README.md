# Dossier de candidature en PDF — sources et rapport de production

Document produit : [`../SUIVO-dossier-JNSP-2026.pdf`](../SUIVO-dossier-JNSP-2026.pdf), généré en exécutant le prompt [`00b-PROMPT-DOSSIER-PDF.md`](../00b-PROMPT-DOSSIER-PDF.md).

## Régénérer après modification d'un livrable

```bash
# Prérequis : Python 3 + paquet markdown ; Node.js + playwright + mermaid ; poppler-utils (pdftotext)
pip install markdown==3.7
npm install playwright mermaid@11.4.1
node render.js          # → ../SUIVO-dossier-JNSP-2026.pdf
```

| Fichier | Rôle |
|---|---|
| `build.py` | Lit les livrables Markdown et `finances.json`, construit `dossier.html` (sommaire, parties, encadrés, canevas, fiches, graphiques SVG) |
| `styles.css` | Charte et mise en page d'impression A4 (pages nommées : couverture, gardes, canevas en paysage) |
| `render.js` | Rend les diagrammes Mermaid, produit le PDF en 2 passes (repérage des pages puis sommaire numéroté) |
| `finances.json` | Valeurs calculées du modèle Excel pour les 3 scénarios (extraites après recalcul, aucun chiffre retapé) |

Si le modèle financier change : recalculer le classeur dans chaque scénario puis régénérer `finances.json` (voir l'historique du dépôt pour le script d'extraction).

## Rapport de production

### Pages par partie (69 pages, 5,1 Mo)

| Partie | Pages |
|---|---|
| Couverture, sommaire, livrables et critères | 1–4 |
| Résumé exécutif (1 page) | 5 |
| A — Le problème et le marché | 6–12 |
| B — Le modèle (canevas en A4 paysage) | 13–17 |
| C — Le produit (backlog, workflows, processus, maquettes) | 18–37 |
| D — La démonstration technique | 38–45 |
| E — Les finances | 46–50 |
| F — L'organisation | 51–58 |
| G — Mise sur le marché et feuille de route | 59–60 |
| Risques consolidés (32 risques) | 61–62 |
| Annexes A1 à A5 | 63–69 |

Le document fait 69 pages, au-delà des 40 à 55 visées par le prompt : la partie C (20 pages) contient les 6 diagrammes de parcours, le processus complet et 10 captures en cadre. Pour une version jury plus courte, utiliser la variante « synthèse » du prompt.

### Contrôles effectués
- Rendu page par page converti en images et relu ; corrigés : diagrammes trop petits (orientation adaptée), étiquettes du graphique qui se chevauchaient, captures qui masquaient le texte, chiffre clé coupé sur deux lignes, canevas trop petit.
- 152 signets PDF, 51 liens cliquables dans le sommaire et le tableau des critères, document balisé (accessibilité), langue `fr`, polices intégrées.
- Tous les diagrammes Mermaid rendus en vectoriel (le script échoue sinon).

### Incohérences détectées entre les sources
1. **Nombre de communes à 36 mois** : les livrables 01, 03 et le pitch disent « 25 communes » ; le scénario central du modèle financier en compte **24**. Le résumé exécutif mentionne les deux. À harmoniser (changer l'hypothèse du modèle ou le texte).
2. **Besoin de financement du pilote** : le pitch demande **85 M FCFA** (prix + pré-amorçage), alors que le modèle prévoit 93 M avant le mois 10 en comptant l'apport des fondateurs (8 M). Cohérent si l'apport est exclu de la « demande » ; à préciser à l'oral.
3. **Coût complet par demande** : « ≈ 430 FCFA » dans le texte, 427 FCFA dans le modèle (arrondi, sans conséquence).

### Éléments encore marqués [H]
Volumes du marché (TAM/SAM/SOM), nombre de déplacements et coût du statu quo, part des passages « pour information » au guichet, gains AS-IS → TO-BE, taux de charges sociales, prix des licences et taux de conversion premium. Liste en annexe A4 du PDF.

### Choix assumés par rapport au prompt
- **Probabilité et impact des risques non chiffrés** : le prompt interdit d'inventer des chiffres ; les risques sont listés avec leur parade et leur responsable, la cotation est laissée à l'équipe après la découverte.
- **En-tête par partie** : le moteur d'impression utilisé ne gère pas les en-têtes variables ; le nom de la partie figure sur sa page de garde et dans les signets, le pied de page porte le titre et la pagination.
- **AS-IS et TO-BE** : présentés l'un sous l'autre plutôt que côte à côte, pour rester lisibles en A4 portrait.

### À compléter par l'équipe
- Noms, photos et parcours des fondateurs (partie F et pitch).
- Lettre d'intention d'une commune pilote (à joindre en annexe dès obtention).
- Résultats des entretiens et questionnaires, pour remplacer les [H] par des chiffres mesurés.

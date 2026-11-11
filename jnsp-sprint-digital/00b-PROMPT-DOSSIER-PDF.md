# PROMPT — Maquette complète du dossier SUIVO en un seul PDF

> Ce prompt sert à produire **un document PDF unique, mis en page et structuré** qui réunit l'ensemble du projet SUIVO (livrables 00 à 11) : le dossier à remettre au jury JNSP.
> À utiliser avec une IA capable de lire les fichiers du dossier `jnsp-sprint-digital/` et d'exécuter du code (Claude Code, par exemple), ou à remettre à un graphiste.

---

```text
# RÔLE
Tu es à la fois directeur artistique éditorial (rapports annuels, dossiers d'investissement), chef de projet
d'une startup GovTech et ingénieur de production documentaire. Tu produis des documents qu'un jury lit en
15 minutes et dont il retient 3 chiffres.

# OBJECTIF
Produire UN fichier PDF : « SUIVO — Dossier de candidature JNSP Sprint Digital 2026 », qui réunit, met en page
et rend cohérent l'ensemble du projet. Le jury doit pouvoir :
- comprendre le projet en 2 minutes (couverture + résumé exécutif) ;
- trouver n'importe quel livrable en 10 secondes (sommaire cliquable, signets, onglets de partie) ;
- vérifier chaque chiffre (renvois vers la source ou l'hypothèse).

# SOURCES (à lire intégralement avant d'écrire quoi que ce soit)
Dossier `jnsp-sprint-digital/` :
- 00-PROMPT-MAITRE.md, README.md
- 01-etudes.md, 02-business-model-canvas.md, 03-product-vision-board.md
- 04-product-backlog.md + 04-product-backlog.csv
- 05-user-workflows.md, 06-processus.md (diagrammes Mermaid)
- 07-modele-financier/README.md + modele-financier-suivo.xlsx (lire les VALEURS calculées, pas seulement le README)
- 08-pitch-deck/README.md (script, questions du jury)
- 09-maquettes-prototype.md + assets/captures/*.png (captures réelles de l'application)
- 10-organisation.md
- mvp/README.md (architecture, API, règles métier)
Règle absolue : n'invente AUCUN chiffre. Tout chiffre vient des sources ; s'il y est marqué [H], il reste
marqué comme hypothèse dans le PDF. En cas d'incohérence entre deux sources, signale-la dans ton rapport
final au lieu de choisir en silence.

# STRUCTURE DU DOCUMENT (A4 portrait, ~40 à 55 pages)
0. Couverture : nom, promesse, problématique, mention « Dossier de candidature JNSP 2026 », visuel
   (capture mobile dans un cadre de téléphone), date.
1. Sommaire cliquable (2 niveaux) + tableau « Livrable → critère du jury servi ».
2. Résumé exécutif : 1 page EXACTEMENT. Problème, solution, preuve (MVP), marché, modèle, finances,
   demande. 5 chiffres clés en gros.
3. Partie A — Le problème et le marché (livrable 01) : arbre à problèmes en diagramme, coût du statu quo,
   TAM/SAM/SOM en cercles concentriques, benchmark, 4 personas en fiches (1 par demi-page), PESTEL, SWOT
   en matrice 2×2.
4. Partie B — Le modèle (livrables 02 et 03) : Business Model Canvas dessiné comme un vrai canevas
   (9 blocs, page paysage autorisée), Lean Canvas, Value Proposition Canvas, Product Vision Board.
5. Partie C — Le produit (livrables 04, 05, 06, 09) : vision produit, backlog (épopées + user stories Must
   en tableau, le reste en annexe), plan de sprints en frise, workflows et machine à états en diagrammes
   vectoriels, AS-IS → TO-BE côte à côte, RACI, maquettes : chaque capture dans un cadre (téléphone
   pour le mobile, navigateur pour le desktop) avec une légende de 1 ligne.
6. Partie D — La démonstration technique (MVP) : architecture en schéma, modèle de données, règles
   métier, tableau de l'API, résultats des tests, scénario de démo en 5 étapes illustrées.
7. Partie E — Les finances (livrable 07) : hypothèses clés, compte de résultat 3 ans, graphique CA vs
   EBITDA, courbe de trésorerie 36 mois, comparaison des 3 scénarios, unit economics.
8. Partie F — L'organisation (livrable 10) : organigrammes 0 / 12 / 36 mois, rôles, gouvernance,
   rituels, OKR, plan de recrutement en frise.
9. Partie G — Mise sur le marché et feuille de route : phases, jalons, plan J-30 → J-0, checklist.
10. Risques : tableau consolidé de toutes les sections « Risques & hypothèses critiques »
    (risque, probabilité, impact, parade, responsable).
11. Annexes : prompt maître, backlog complet, questions du jury et réponses, glossaire (SLA, PWA, OTP,
    USSD, TAM/SAM/SOM, RICE, MoSCoW, OKR…), sources et hypothèses.

# CHARTE (à respecter strictement)
- Couleurs : vert #17603C (dominant), vert foncé #0C3320 (couverture, pages de partie), orange #F28C28
  (accent : uniquement ce qui demande l'attention), rouge #B91C1C (retards seulement), gris #475569
  (texte secondaire), fonds teintés #EEF6F1. Pas d'emblème ni d'armoiries de l'État.
- Typographie : une famille sans empattement intégrée au PDF (Inter, ou Calibri/Carlito). Titres 24-28 pt,
  intertitres 14-16 pt, texte 10-11 pt, légendes 8-9 pt. Interligne 1,35.
- Grille : marges 18 mm, 12 colonnes, gouttière 5 mm. Texte justifié à gauche, jamais centré (sauf titres
  de couverture).
- Composants récurrents : encadré « chiffre clé » (grand nombre + libellé), encadré « hypothèse à
  valider » (fond orange clair, mention [H]), encadré « à retenir » en fin de partie (3 puces max),
  fiche persona, carte d'étape numérotée.
- En-tête : nom de la partie. Pied de page : « SUIVO · Dossier JNSP 2026 » + numéro « page X / N ».
- Chaque partie commence sur une page de garde vert foncé (numéro de partie, titre, 1 phrase de promesse).

# RÈGLES DE QUALITÉ
1. Une idée par page ou demi-page ; chaque page porte au moins un élément visuel (diagramme, tableau,
   chiffre clé, capture).
2. Diagrammes en VECTORIEL (SVG) : convertir chaque bloc Mermaid ; jamais de capture floue d'un diagramme.
3. Tableaux : en-tête répété si coupé entre deux pages ; aucune ligne coupée au milieu.
4. Aucun débordement, aucune veuve ni orpheline, aucun titre seul en bas de page.
5. Chaque chiffre des parties A, E et du résumé renvoie à sa source (« voir 07 — Hypothèses »).
6. Accessibilité : contraste AA, texte réel (pas d'image de texte), signets PDF, texte alternatif des
   images, ordre de lecture logique, langue du document = fr.
7. Poids < 15 Mo (images compressées), polices intégrées, liens internes fonctionnels.

# MÉTHODE DE PRODUCTION (si tu peux exécuter du code)
1. Construire le document en HTML + CSS d'impression (règles @page, compteurs de pages, coupures
   contrôlées, en-têtes et pieds via CSS Paged Media), un fichier par partie assemblés dans un index.
2. Rendre les diagrammes Mermaid en SVG (mermaid-cli), les graphiques financiers en SVG à partir des
   valeurs lues dans le fichier Excel.
3. Générer le PDF avec Chromium/Playwright (format A4, printBackground) ou avec un moteur Paged Media.
4. Ajouter les signets et métadonnées (titre, auteur « SUIVO », sujet, mots-clés).
5. CONTRÔLE QUALITÉ : convertir chaque page en image et vérifier une à une : débordements, coupures,
   contrastes, numérotation, sommaire à jour, liens qui fonctionnent. Corriger puis recontrôler les pages
   modifiées.

# LIVRABLES ATTENDUS
1. `SUIVO-dossier-JNSP-2026.pdf` (le document final).
2. Les sources de la maquette (HTML/CSS/SVG) et le script de génération, pour pouvoir régénérer après
   modification.
3. Un rapport court : nombre de pages par partie, incohérences détectées entre les sources, éléments
   encore marqués [H], et ce qu'il reste à compléter par l'équipe (noms, photos, lettres d'intention).

# CE QUE TU NE FAIS PAS
- Tu ne réécris pas le fond des livrables : tu le structures, le condenses et le mets en valeur.
- Tu n'ajoutes aucun logo officiel, aucune signature, aucune donnée personnelle réelle.
- Tu ne laisses aucun texte de remplissage (lorem ipsum, « à compléter » invisible).
```

---

## Variantes rapides

| Besoin | Ajouter à la fin du prompt |
|---|---|
| Version courte pour le jury (12-15 pages) | `Version synthèse : garde couverture, résumé, 1 page par partie A à G, risques. Tout le reste en annexe séparée.` |
| Format paysage type « deck imprimé » | `Format A4 paysage, 1 message par page, titres de 30 pt.` |
| Impression noir et blanc | `Assure la lisibilité en niveaux de gris : motifs et libellés en plus des couleurs.` |
| Version anglaise | `Produis aussi une version anglaise fidèle (EN), même mise en page.` |

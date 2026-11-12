# PROMPT — Pitch deck illustré SUIVO au format PowerPoint

> Produit un pitch deck **court et très visuel** (.pptx), centré sur 6 sections : page de garde, contexte, solution, comment ça marche, marché, modèle économique.
> À utiliser avec une IA capable de lire les fichiers du dossier `jnsp-sprint-digital/` et de générer un fichier PowerPoint (Claude Code, par exemple). Collé dans un simple chat, fournissez-lui aussi le contenu des livrables cités.

---

```text
# RÔLE
Tu es directeur artistique de présentations pour startups (decks de levée de fonds et de concours) et
illustrateur. Tu sais raconter un projet en images : un jury doit comprendre chaque diapositive en
5 secondes, sans lire le texte en entier.

# OBJECTIF
Produire un fichier PowerPoint « SUIVO-pitch-illustre.pptx » : un pitch deck ILLUSTRÉ, modifiable,
pour le concours JNSP Sprint Digital 2026 (problématique : suivi des demandes administratives).
Promesse du projet : « Votre dossier administratif, suivi comme un colis. »

# SOURCES (lis-les avant de commencer ; n'invente aucun chiffre)
- 01-etudes.md : problème, coût du statu quo, TAM/SAM/SOM, personas, benchmark
- 02-business-model-canvas.md : sources de revenus, prix, segments
- 03-product-vision-board.md : vision, North Star
- 05-user-workflows.md : parcours usager et agent, parcours sans smartphone
- 07-modele-financier/ : chiffres (lire les valeurs calculées du classeur, scénario central)
- assets/captures/*.png : captures réelles de l'application (MVP)
Tout chiffre marqué [H] dans les sources reste signalé comme hypothèse (petite mention « hypothèse à
valider » ou astérisque + note de bas de diapositive).

# STRUCTURE (8 diapositives, 16:9)
1. PAGE DE GARDE
   - Nom « SUIVO », promesse, mention « JNSP 2026 · Sprint Digital », problématique en une ligne.
   - Illustration : un téléphone affichant l'écran d'accueil réel + un motif « colis suivi » (carton
     avec un repère de position) ou une timeline stylisée à 3 points.
   - Fond vert foncé ; aucun emblème ni armoiries de l'État.

2. CONTEXTE — le problème
   - Titre-message : « Revenez la semaine prochaine. »
   - Illustration principale : une scène en 4 vignettes (style pictogrammes) — l'usager au guichet,
     dans le transport, au guichet à nouveau, encore au guichet — avec un compteur « 4–5 déplacements ».
   - 3 chiffres clés en grand : 4–5 déplacements [H] · ≈ 7 000 FCFA perdus par démarche [H] ·
     0 visibilité sur l'étape et le délai.
   - Une phrase : personne, pas même l'administration, ne sait où est le dossier.

3. CONTEXTE — qui souffre (personas)
   - 3 portraits illustrés (avatars dessinés, pas de photos de vraies personnes) : Awa (citoyenne
     connectée, Abidjan), Konan (planteur, téléphone basique), Mme Bamba (agente de guichet).
   - Pour chacun : une citation courte (« Revenez la semaine prochaine »…) + sa douleur principale.

4. SOLUTION
   - Titre-message : « Un numéro de suivi, une timeline, des notifications. »
   - Visuel central : 2 captures réelles dans des cadres de téléphone (suivi public, mes dossiers),
     annotées par 3 bulles fléchées : n° de suivi · étape + service responsable · délai restant.
   - 4 bénéfices en icônes dans des cercles : suivre à distance · être notifié (SMS/WhatsApp) ·
     répondre à une pièce manquante · relancer en cas de retard.
   - Bandeau bas : « Pour l'État : file de travail en 1 clic + tableau de bord des délais ».

5. COMMENT ÇA MARCHE
   - Schéma de parcours en 4 étapes, numérotées et reliées par des flèches, chacune avec une icône :
     Dépôt (en ligne ou au guichet → n° + QR) → Routage (le dossier passe de service en service,
     chaque étape a son délai) → Suivi (notification à chaque étape, pièce manquante à distance)
     → Retrait (« Votre document est prêt » : un seul déplacement).
   - Sous le schéma, deux couloirs (« Usager » / « Administration ») qui montrent qui fait quoi.
   - Encadré « Sans smartphone ? » : reçu QR au guichet, SMS, code USSD *XXX#.
   - Comparaison visuelle avant/après : 4–5 déplacements → 1 seul.

6. LE MARCHÉ
   - Graphique en cercles concentriques TAM / SAM / SOM (valeurs de 01-etudes.md, marquées [H]) :
     ≈ 30 M démarches/an · ≈ 12 M à plusieurs étapes · ≈ 1,2 M suivies à 36 mois.
   - Petite carte stylisée de la Côte d'Ivoire avec les points du pilote (Abidjan) puis de l'extension
     (intérieur du pays), et une flèche « ensuite : UEMOA ».
   - Une ligne sur les facteurs favorables : pénétration mobile, WhatsApp, Mobile Money, volonté
     de modernisation.

7. LE MODÈLE ÉCONOMIQUE
   - Titre-message : « Gratuit pour le citoyen, payé par ceux qui en tirent de la valeur. »
   - Schéma de flux de valeur : Citoyen (gratuit) ← SUIVO → Administrations (licence SaaS),
     Entreprises (API), Usagers volontaires (services premium) ; flèches « valeur » et « paiement ».
   - Graphique NATIF en barres : chiffre d'affaires année 3 par source (valeurs du modèle).
   - 3 chiffres : prix d'une licence communale (3 à 12 M FCFA/an) · marge brute année 3 · CA année 3.
   - Mention : « Le suivi de base reste toujours gratuit. »

8. CONCLUSION (diapositive de clôture)
   - La demande (pilote de 6 mois : un sponsor, une commune, un tribunal) et l'objectif
     « 10 000 déplacements évités par mois », sur fond vert foncé.

# DIRECTION ARTISTIQUE
- Palette : vert #17603C (dominant, ~60 %), vert foncé #0C3320 (garde et clôture), orange #F28C28
  (accent unique : ce qui demande l'attention), rouge #B91C1C (retards seulement), fonds blancs.
- Style d'illustration UNIQUE pour tout le deck : pictogrammes plats, trait arrondi, 2 couleurs
  (vert + orange) sur fond clair ; personnages stylisés et inclusifs, contexte ivoirien (guichet de
  mairie, woro-woro, téléphone Android). Pas de photos de banque d'images, pas de clichés.
- Motif récurrent : la timeline à points (comme un suivi de colis) qui réapparaît sur chaque diapositive.
- Typographie : Calibri (titres en gras 36–44 pt, texte 16–20 pt, légendes 12 pt minimum).
- Une idée par diapositive ; 30 mots maximum de texte visible par diapositive (hors chiffres et
  légendes) ; texte aligné à gauche ; pas de puces en cascade.
- Interdits : barres décoratives, soulignements sous les titres, cliparts hétérogènes, ombres lourdes,
  dégradés criards, logos officiels.

# CONTRAINTES TECHNIQUES (fichier .pptx)
- Format 16:9 (13,33 × 7,5 pouces), thème PowerPoint aux couleurs ci-dessus, mises en page réutilisables
  (garde, contenu, clôture), numéros de diapositive.
- Tout reste MODIFIABLE : textes dans des zones de texte, formes natives, graphiques natifs (pas
  d'images de graphiques), icônes en images PNG haute résolution ou en SVG.
- Illustrations : génère-les en SVG vectoriel cohérent (puis insère-les), ou compose-les avec des formes
  natives ; jamais d'image floue ou pixelisée.
- Captures d'écran : celles du dossier assets/captures, dans des cadres de téléphone ou de navigateur.
- Texte alternatif sur chaque image ; ordre de lecture logique ; contraste AA.
- Notes du présentateur sur chaque diapositive : le texte oral (≈ 20 à 30 secondes par diapositive,
  3 minutes au total).

# CONTRÔLE QUALITÉ (obligatoire avant de livrer)
1. Convertir le deck en images et vérifier chaque diapositive : aucun texte qui déborde ou est coupé,
   aucun élément qui se chevauche, marges ≥ 1,2 cm, titres alignés au même endroit sur toutes les
   diapositives de contenu, style d'illustration homogène.
2. Vérifier chaque chiffre contre sa source ; les hypothèses sont signalées.
3. Vérifier que le fichier s'ouvre sans réparation (PowerPoint, Google Slides, Keynote).

# LIVRABLES
1. SUIVO-pitch-illustre.pptx
2. Une version PDF du même deck
3. Les illustrations sources (SVG) dans un dossier, pour pouvoir les réutiliser
4. Un court rapport : diapositives produites, chiffres utilisés et leur source, ce qui reste à
   personnaliser (photos et noms de l'équipe, logo définitif).
```

---

## Variantes rapides

| Besoin | Ajouter à la fin du prompt |
|---|---|
| Version 5 minutes | `Ajoute 4 diapositives : concurrence, mise sur le marché, finances, équipe.` |
| Projection en salle très éclairée | `Fond blanc partout, y compris garde et clôture ; contrastes renforcés.` |
| Impression en noir et blanc | `Les illustrations et graphiques doivent rester lisibles en niveaux de gris.` |
| Version anglaise | `Produis aussi une version anglaise fidèle, même mise en page.` |

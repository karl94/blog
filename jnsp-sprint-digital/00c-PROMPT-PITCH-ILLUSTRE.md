# PROMPT — Pitch deck illustré SUIVO au format PowerPoint

> Produit un pitch deck **court et très visuel** (.pptx) : page de garde, contexte, solution, comment ça marche, valeur ajoutée pour chaque acteur, modèle économique — **sans aucun chiffre ni estimation non mesurés**.
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
AUCUN CHIFFRE NI ESTIMATION NON MESURÉS : pas de taille de marché, de coût chiffré du problème, de prix,
de chiffre d'affaires ni d'objectif chiffré. L'étude de marché n'a pas été faite : le deck démontre la
VALEUR AJOUTÉE pour chaque acteur, de façon qualitative et vérifiable (démo, captures, parcours).

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
   - 3 constats en icônes (sans chiffres) : des allers-retours répétés · du temps et de l'argent
     perdus · aucune visibilité sur l'étape, le service et le délai.
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
   - Comparaison visuelle avant/après : plusieurs allers-retours → un seul déplacement.

6. LA VALEUR AJOUTÉE POUR CHAQUE ACTEUR
   - Titre-message : « Ce que SUIVO change pour chaque acteur ».
   - 6 cartes avec icône : le citoyen · l'usager sans smartphone · l'agent de guichet · le chef de
     service · le ministère / l'État · les partenaires (plateformes existantes, banques, employeurs).
   - Pour chacun, 2 ou 3 gains concrets et vérifiables (ex. : « mise à jour en 1 clic »,
     « alerté avant la plainte », « mesure les délais réels de ses services »). Aucun chiffre.

7. LE MODÈLE ÉCONOMIQUE
   - Titre-message : « Gratuit pour le citoyen, payé par les bénéficiaires. »
   - Schéma de flux de valeur : Citoyen (gratuit) ← SUIVO → Administrations (abonnement),
     Usagers volontaires (services optionnels), Entreprises (vérification de statut) ; flèches
     « valeur » et « paiement ». Aucun prix.
   - « Nos principes » : suivi de base toujours gratuit ; l'administration paie un outil qui fait
     gagner du temps à ses agents ; revenus complémentaires optionnels ; tarifs construits avec les
     pilotes à partir des gains mesurés.

8. CONCLUSION (diapositive de clôture)
   - La demande (un sponsor, une commune et un tribunal pilotes, un accompagnement) et l'engagement
     « mesurer avec vous, sur le terrain, les déplacements évités et les délais gagnés », sur fond
     vert foncé.

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
2. Vérifier qu'aucun chiffre ou estimation non mesuré n'apparaît (diapositives et notes).
3. Vérifier que le fichier s'ouvre sans réparation (PowerPoint, Google Slides, Keynote).

# LIVRABLES
1. SUIVO-pitch-illustre.pptx
2. Une version PDF du même deck
3. Les illustrations sources (SVG) dans un dossier, pour pouvoir les réutiliser
4. Un court rapport : diapositives produites, sources du contenu, ce qui reste à personnaliser
   (photos et noms de l'équipe, logo définitif).
```

---

## Variantes rapides

| Besoin | Ajouter à la fin du prompt |
|---|---|
| Version 5 minutes | `Ajoute 4 diapositives : concurrence, mise sur le marché, finances, équipe.` |
| Projection en salle très éclairée | `Fond blanc partout, y compris garde et clôture ; contrastes renforcés.` |
| Impression en noir et blanc | `Les illustrations et graphiques doivent rester lisibles en niveaux de gris.` |
| Version anglaise | `Produis aussi une version anglaise fidèle, même mise en page.` |

// Génère le pitch deck SUIVO au format PowerPoint (.pptx)
// Usage : npm install pptxgenjs@3.12.0 && node generer-pptx.js
// Option : APPLY_THEME=/chemin/vers/apply_theme.js pour inscrire la palette dans le thème du fichier.
const path = require('path');
const pptxgen = require('pptxgenjs');

const OUT = path.join(__dirname, 'pitch-deck-suivo.pptx');
const CAP = path.join(__dirname, '..', 'assets', 'captures');

const THEME = {
  name: 'SUIVO',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '0F172A', lt1: 'FFFFFF', dk2: '17603C', lt2: 'EEF6F1',
    accent1: '17603C', accent2: 'F28C28', accent3: 'B91C1C', accent4: '0C3320',
    accent5: '64748B', accent6: 'D4EADC', hlink: '17603C', folHlink: '0C3320',
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13,333" × 7,5"
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'SUIVO — Pitch JNSP Sprint Digital 2026';
pres.subject = 'Suivi des demandes administratives';
pres.author = 'SUIVO';
const C = pres.SchemeColor;

const W = 13.333;
const M = 0.6;
const CW = W - 2 * M; // largeur utile

// ---------------------------------------------------------------- Mises en page
pres.defineSlideMaster({
  title: 'SUIVO_SOMBRE',
  background: { color: HEX.accent4 },
  objects: [
    { placeholder: { options: { name: 'kicker', type: 'body', x: 0.8, y: 1.3, w: 8, h: 0.45, fontSize: 14, bold: true, color: C.accent2, charSpacing: 2, margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: 0.8, y: 1.85, w: 8, h: 1.9, fontSize: 88, bold: true, color: C.background1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
    { text: { text: 'SUIVO · JNSP Sprint Digital 2026', options: { x: 0.8, y: 6.9, w: 6, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
  ],
});

pres.defineSlideMaster({
  title: 'SUIVO_CONCLUSION',
  background: { color: HEX.accent4 },
  objects: [
    { placeholder: { options: { name: 'kicker', type: 'body', x: 0.8, y: 0.8, w: 11.7, h: 0.4, fontSize: 14, bold: true, color: C.accent2, charSpacing: 2, margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: 0.8, y: 1.3, w: 11.7, h: 1.2, fontSize: 40, bold: true, color: C.background1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
    { text: { text: 'SUIVO · JNSP Sprint Digital 2026', options: { x: 0.8, y: 6.9, w: 6, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
  ],
});

pres.defineSlideMaster({
  title: 'SUIVO_CONTENU',
  background: { color: HEX.lt1 },
  margin: [0.5, M, 0.6, M],
  objects: [
    { placeholder: { options: { name: 'kicker', type: 'body', x: M, y: 0.4, w: CW, h: 0.35, fontSize: 13, bold: true, color: C.accent2, charSpacing: 2, margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.78, w: CW, h: 0.8, fontSize: 32, bold: true, color: C.text1, valign: 'top', align: 'left', margin: 0 }, text: '' } },
    { text: { text: 'SUIVO · JNSP Sprint Digital 2026', options: { x: M, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: C.accent5, margin: 0 } } },
  ],
  slideNumber: { x: 12.2, y: 7.0, w: 0.55, h: 0.3, fontSize: 10, color: C.accent5, align: 'right' },
});

// ---------------------------------------------------------------- Aides
function slideContenu(section, kicker, titre) {
  const s = pres.addSlide({ masterName: 'SUIVO_CONTENU', sectionTitle: section });
  s.addText(kicker.toUpperCase(), { placeholder: 'kicker' });
  s.addText(titre, { placeholder: 'title' });
  return s;
}
const ombre = () => ({ type: 'outer', color: '000000', opacity: 0.15, blur: 8, offset: 2, angle: 90 });
function carte(s, nom, x, y, w, h, fill = C.background2) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: nom, x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: fill } });
}
function pastille(s, nom, x, y, d, texte, fill = C.accent2, size = 16) {
  s.addShape(pres.shapes.OVAL, { objectName: nom, x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  s.addText(texte, { objectName: `${nom} texte`, x, y, w: d, h: d, align: 'center', valign: 'middle', fontSize: size, bold: true, color: C.background1, margin: 0, isTextBox: true });
}
function image(s, nom, fichier, x, y, w, h) {
  s.addImage({ objectName: nom, path: fichier, x, y, w, h, altText: nom, shadow: ombre() });
}

// ================================================================ 1. Couverture
pres.addSection({ title: 'Ouverture' });
{
  const s = pres.addSlide({ masterName: 'SUIVO_SOMBRE', sectionTitle: 'Ouverture' });
  s.addText('JNSP 2026 · SPRINT DIGITAL', { placeholder: 'kicker' });
  s.addText('SUIVO', { placeholder: 'title' });
  s.addText('Votre dossier administratif, suivi comme un colis', {
    objectName: 'Promesse', x: 0.8, y: 3.75, w: 7.6, h: 1.0, fontSize: 28, bold: true, color: C.background1, margin: 0, isTextBox: true,
  });
  s.addText('Problématique : suivi des demandes administratives\nPlateforme web et mobile (PWA) · SMS · WhatsApp · USSD', {
    objectName: 'Sous-titre', x: 0.8, y: 4.95, w: 7.6, h: 0.9, fontSize: 16, color: C.accent6, margin: 0, isTextBox: true, paraSpaceAfter: 4,
  });
  image(s, 'Capture accueil mobile', path.join(CAP, '01-accueil-mobile.png'), 9.55, 0.7, 2.86, 6.2);
  s.addNotes("Bonjour. Nous sommes SUIVO. Notre promesse tient en une phrase : suivre son dossier administratif comme on suit un colis.");
}

// ================================================================ 2. Problème
pres.addSection({ title: 'Problème et solution' });
{
  const s = slideContenu('Problème et solution', 'Le problème', '« Revenez la semaine prochaine »');
  const stats = [
    ['4–5', 'déplacements pour un seul document, dont la plupart pour demander « où en est mon dossier ? »', C.accent3],
    ['≈ 7 000', 'FCFA perdus par démarche : transport, heures de travail, intermédiaires', C.accent2],
    ['0', "visibilité sur l'étape, le service responsable et le délai réel, pour l'usager comme pour l'État", C.accent1],
  ];
  const w = (CW - 2 * 0.3) / 3;
  stats.forEach(([n, t, col], i) => {
    const x = M + i * (w + 0.3);
    carte(s, `Carte chiffre ${i + 1}`, x, 1.9, w, 2.7);
    s.addText(n, { objectName: `Chiffre ${i + 1}`, x: x + 0.3, y: 2.1, w: w - 0.6, h: 1.0, fontSize: 54, bold: true, color: col, margin: 0, isTextBox: true });
    s.addText(t, { objectName: `Légende ${i + 1}`, x: x + 0.3, y: 3.2, w: w - 0.6, h: 1.25, fontSize: 16, color: C.text1, valign: 'top', margin: 0, isTextBox: true });
  });
  s.addText([
    { text: 'Le dossier papier circule entre plusieurs services sans identifiant commun. Personne, pas même l\'administration, ne sait ' },
    { text: 'où il est, qui le traite ni quand il sera prêt', options: { bold: true } },
    { text: '. Résultat : guichets saturés, démarcheurs, perte de confiance.' },
  ], { objectName: 'Constat', x: M, y: 4.9, w: CW, h: 1.1, fontSize: 18, color: C.text1, margin: 0, isTextBox: true });
  s.addText('Chiffres à confirmer par 30 entretiens et 200 questionnaires (livrable 01)', {
    objectName: 'Source', x: M, y: 6.3, w: CW, h: 0.3, fontSize: 11, italic: true, color: C.accent5, margin: 0, isTextBox: true,
  });
  s.addNotes("Levez la main si vous êtes déjà retourné à un guichet seulement pour demander où en était votre dossier. (pause) Nous aussi. En Côte d'Ivoire, obtenir un certificat de nationalité peut demander quatre ou cinq déplacements, et la plupart ne servent qu'à s'entendre dire « ce n'est pas encore prêt ». Cela coûte environ 7 000 francs CFA à l'usager à chaque démarche. Et l'administration elle-même ne sait pas où le dossier est bloqué.");
}

// ================================================================ 3. Solution
{
  const s = slideContenu('Problème et solution', 'La solution', 'Un numéro de suivi, une timeline, des notifications');
  const points = [
    ['Numéro de suivi unique', ' + QR sur le reçu, que le dépôt soit fait en ligne ou au guichet'],
    ['Timeline', ' : étape en cours, service responsable, délai restant'],
    ['Notifications SMS / WhatsApp', ' à chaque changement d\'étape'],
    ['Agir à distance', ' : envoyer une pièce manquante, relancer un dossier en retard'],
    ["Pour l'État", " : file de travail agent en 1 clic et tableau de bord des délais"],
  ];
  const runs = [];
  points.forEach(([b, t], i) => {
    runs.push({ text: b, options: { bold: true, color: C.accent1, bullet: true } });
    runs.push({ text: t, options: { breakLine: i < points.length - 1 } });
  });
  s.addText(runs, { objectName: 'Fonctionnalités', x: M, y: 1.95, w: 6.5, h: 4.6, fontSize: 18, color: C.text1, valign: 'top', paraSpaceAfter: 14, margin: 0, isTextBox: true });
  image(s, 'Capture suivi public', path.join(CAP, '02b-suivi-public-recadre.png'), 7.55, 1.75, 2.4, 5.2);
  image(s, 'Capture mes dossiers', path.join(CAP, '03-mes-dossiers-mobile.png'), 10.25, 1.75, 2.4, 5.2);
  s.addNotes("SUIVO donne à chaque demande un numéro de suivi, comme pour un colis. Que le dossier soit déposé en ligne ou au guichet, l'usager voit l'étape en cours, le service qui le traite et le délai restant. Il est prévenu par SMS ou WhatsApp à chaque étape. S'il manque une pièce, il la transmet sans se déplacer.");
}

// ================================================================ 4. Parcours
{
  const s = slideContenu('Problème et solution', 'Le parcours', 'De 4–5 déplacements à 1 seul');
  const etapes = [
    ['Dépôt', 'En ligne ou au guichet : numéro SUI-2026-… reçu par SMS'],
    ['Routage', 'Le dossier passe de service en service, chaque étape avec son délai (SLA)'],
    ['Suivi', 'Notification à chaque étape ; pièce manquante envoyée à distance ; relance si retard'],
    ['Retrait', '« Votre document est prêt » : un seul déplacement'],
  ];
  const w = (CW - 3 * 0.35) / 4;
  etapes.forEach(([t, d], i) => {
    const x = M + i * (w + 0.35);
    carte(s, `Étape ${i + 1}`, x, 1.95, w, 2.95);
    pastille(s, `Numéro étape ${i + 1}`, x + 0.3, 2.2, 0.6, String(i + 1));
    s.addText(t, { objectName: `Titre étape ${i + 1}`, x: x + 0.3, y: 2.95, w: w - 0.6, h: 0.5, fontSize: 22, bold: true, color: C.text1, margin: 0, isTextBox: true });
    s.addText(d, { objectName: `Texte étape ${i + 1}`, x: x + 0.3, y: 3.5, w: w - 0.6, h: 1.3, fontSize: 15, color: C.text1, valign: 'top', margin: 0, isTextBox: true });
    if (i < etapes.length - 1) {
      s.addShape(pres.shapes.CHEVRON, { objectName: `Flèche ${i + 1}`, x: x + w + 0.07, y: 3.25, w: 0.21, h: 0.35, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    }
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: 'Fond inclusion', x: M, y: 5.25, w: CW, h: 1.25, rectRadius: 0.12, fill: { color: C.accent6 }, line: { color: C.accent6 } });
  s.addText([
    { text: "Personne n'est laissé de côté : ", options: { bold: true, color: C.accent4 } },
    { text: 'dépôt assisté au guichet avec reçu QR, SMS sur téléphone basique, USSD et messages vocaux en dioula et baoulé (feuille de route).' },
  ], { objectName: 'Texte inclusion', x: M + 0.35, y: 5.25, w: CW - 0.7, h: 1.25, fontSize: 17, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
  s.addNotes("Le parcours est simple : je dépose, le dossier est routé de service en service avec un délai pour chaque étape, je suis notifié, et je ne viens plus qu'une fois, pour retirer mon document. Pour ceux qui n'ont pas de smartphone : le guichet enregistre le dépôt et remet un reçu avec QR code, et les notifications partent par SMS.");
}

// ================================================================ 5. Démo
pres.addSection({ title: 'Démo' });
{
  const s = slideContenu('Démo', 'Démo — MVP fonctionnel', "L'agent valide en 1 clic, le décideur voit les goulots");
  const w = (CW - 0.4) / 2;
  const h = w / (2560 / 1720);
  image(s, 'Capture file de travail agent', path.join(CAP, '07-file-agent.png'), M, 1.85, w, h);
  image(s, 'Capture tableau de bord de pilotage', path.join(CAP, '10b-pilotage-recadre.png'), M + w + 0.4, 1.85, w, h);
  s.addText('File de travail : dossiers triés par urgence, relances signalées', { objectName: 'Légende agent', x: M, y: 1.95 + h, w, h: 0.35, fontSize: 13, italic: true, color: C.accent5, margin: 0, isTextBox: true });
  s.addText('Pilotage : déplacements évités, retards par service, délai réel vs prévu', { objectName: 'Légende pilotage', x: M + w + 0.4, y: 1.95 + h, w, h: 0.35, fontSize: 13, italic: true, color: C.accent5, margin: 0, isTextBox: true });
  s.addText('React + Tailwind (PWA) · Node.js + Express · PostgreSQL · connexion par code SMS · journal d\'audit immuable · tests de bout en bout', {
    objectName: 'Stack', x: M, y: 6.45, w: CW, h: 0.35, fontSize: 14, bold: true, color: C.accent1, margin: 0, isTextBox: true,
  });
  s.addNotes("Ce n'est pas une maquette, c'est un MVP qui fonctionne. [DÉMO EN DIRECT] Voici le dossier d'Awa : en retard de 5 jours au service de la nationalité. Elle clique sur « Relancer ». Côté agent, le dossier passe en tête de file, en rouge. L'agent valide l'étape en un clic, et Awa reçoit un SMS. Côté décideur, ce tableau de bord montre pour la première fois le délai réel de chaque étape, comparé au délai prévu. (Secours si pas de réseau : rester sur cette diapositive et commenter les captures.)");
}

// ================================================================ 6. Marché
pres.addSection({ title: 'Marché et modèle' });
{
  const s = slideContenu('Marché et modèle', 'Marché', 'Des millions de demandes, aucune couche de suivi commune');
  const base = 6.55; const cx = 3.2;
  [[4.6, C.background2, 'TAM'], [3.2, C.accent6, 'SAM'], [1.8, C.accent1, 'SOM']].forEach(([d, col, n]) => {
    s.addShape(pres.shapes.OVAL, { objectName: `Cercle ${n}`, x: cx - d / 2, y: base - d, w: d, h: d, fill: { color: col }, line: { color: HEX.lt1, width: 1.5 } });
  });
  s.addText('TAM', { objectName: 'Étiquette TAM', x: cx - 1, y: base - 4.45, w: 2, h: 0.5, align: 'center', fontSize: 18, bold: true, color: C.accent1, margin: 0, isTextBox: true });
  s.addText('SAM', { objectName: 'Étiquette SAM', x: cx - 1, y: base - 3.05, w: 2, h: 0.5, align: 'center', fontSize: 18, bold: true, color: C.accent4, margin: 0, isTextBox: true });
  s.addText('SOM', { objectName: 'Étiquette SOM', x: cx - 0.9, y: base - 1.15, w: 1.8, h: 0.5, align: 'center', fontSize: 18, bold: true, color: C.background1, margin: 0, isTextBox: true });
  const lignes = [
    ['≈ 30 M', 'TAM', "démarches administratives par an en Côte d'Ivoire"],
    ['≈ 12 M', 'SAM', 'démarches à plusieurs étapes dans les 201 communes et les grands organismes'],
    ['≈ 1,2 M', 'SOM à 36 mois', '25 communes et 2 organismes nationaux'],
  ];
  lignes.forEach(([n, t, d], i) => {
    const y = 1.95 + i * 1.3;
    s.addText(n, { objectName: `Valeur ${t}`, x: 6.3, y, w: 2.3, h: 0.9, fontSize: 40, bold: true, color: i === 2 ? C.accent2 : C.accent1, valign: 'middle', margin: 0, isTextBox: true });
    s.addText([{ text: t, options: { bold: true, breakLine: true } }, { text: d }], { objectName: `Description ${t}`, x: 8.7, y, w: 4.03, h: 0.95, fontSize: 15, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
  });
  s.addText([
    { text: 'Ensuite : ', options: { bold: true } },
    { text: "les 8 pays de l'UEMOA, qui partagent une organisation administrative proche et le Mobile Money." },
  ], { objectName: 'Extension', x: 6.3, y: 5.9, w: 6.43, h: 0.65, fontSize: 15, color: C.text1, margin: 0, isTextBox: true });
  s.addNotes("Le marché : environ 30 millions de démarches par an, dont 12 millions à plusieurs étapes. Nous visons 1,2 million de demandes suivies à 36 mois, puis l'UEMOA. Ces volumes sont des hypothèses détaillées dans le livrable Études.");
}

// ================================================================ 7. Modèle économique
{
  const s = slideContenu('Marché et modèle', 'Modèle économique', 'Gratuit pour le citoyen, payé par ceux qui en tirent de la valeur');
  s.addChart(pres.charts.BAR, [{
    name: "CA année 3 (M FCFA)",
    labels: ['API B2B', 'Premium usagers', 'Mise en place', 'Licences organismes', 'Licences communes'],
    values: [6.5, 19.4, 39.0, 80.0, 111.0],
  }], {
    objectName: 'Graphique sources de revenus', x: M, y: 1.85, w: 6.4, h: 4.75, barDir: 'bar',
    showTitle: true, title: "Chiffre d'affaires année 3 par source (M FCFA)", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: '+mn-lt',
    chartColors: [HEX.accent1], showValue: true, dataLabelPosition: 'outEnd', dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: '+mn-lt', dataLabelFormatCode: '0',
    catAxisLabelColor: HEX.dk1, catAxisLabelFontSize: 12, catAxisLabelFontFace: '+mn-lt',
    valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false, barGapWidthPct: 60,
  });
  const offres = [
    ['Licence SaaS commune', '3 à 12 M FCFA / an'],
    ['Licence organisme national', '25 à 60 M FCFA / an'],
    ['Mise en place / intégration', '2 à 15 M FCFA'],
    ['Premium usager (RDV, livraison)', '500 à 2 000 FCFA, optionnel'],
    ['API B2B (banques, notaires, RH)', '100 FCFA / appel'],
  ];
  offres.forEach(([t, p], i) => {
    const y = 1.9 + i * 0.72;
    s.addText(t, { objectName: `Offre ${i + 1}`, x: 7.4, y, w: 2.95, h: 0.6, fontSize: 15, bold: true, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
    s.addText(p, { objectName: `Prix ${i + 1}`, x: 10.35, y, w: 2.38, h: 0.6, fontSize: 15, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: 'Fond gratuité', x: 7.4, y: 5.6, w: 5.33, h: 1.0, rectRadius: 0.12, fill: { color: C.accent6 }, line: { color: C.accent6 } });
  s.addText([{ text: 'Le suivi de base reste toujours gratuit. ', options: { bold: true } }, { text: 'Marge brute récurrente supérieure à 75 %.' }], {
    objectName: 'Texte gratuité', x: 7.65, y: 5.6, w: 4.9, h: 1.0, fontSize: 15, color: C.accent4, valign: 'middle', margin: 0, isTextBox: true,
  });
  s.addNotes("Le suivi reste gratuit pour le citoyen. Ce sont les administrations qui paient une licence SaaS, à partir de 3 millions par an pour une commune, c'est-à-dire moins que le salaire annuel d'un agent pour désengorger tout un guichet. S'y ajoutent les frais de mise en place, des services premium optionnels et une API pour les entreprises.");
}

// ================================================================ 8. Positionnement
{
  const s = slideContenu('Marché et modèle', 'Positionnement', 'Nous ne remplaçons pas les portails, nous les relions');
  const O = '✓'; const N = '✗';
  const ent = (t) => ({ text: t, options: { bold: true, color: C.text1, fill: { color: C.background2 } } });
  const ok = (t) => ({ text: t, options: { bold: true, color: C.accent1 } });
  const ko = (t) => ({ text: t, options: { color: C.accent5 } });
  const lignes = [
    [ent(''), ent('Statu quo (guichet)'), ent('Portails de dépôt sectoriels'), ent('Guichets uniques (type Irembo)'), { text: 'SUIVO', options: { bold: true, color: C.background1, fill: { color: C.accent1 } } }],
    ['Suivi inter-services', ko(N), ko('partiel'), ok(O), ok(O)],
    ['Dépôts papier aussi suivis', ko(N), ko(N), ko('partiel'), ok(`${O} reçu QR`)],
    ['Délais (SLA) réels mesurés', ko(N), ko(N), ko('partiel'), ok(O)],
    ['SMS, USSD, sans smartphone', ko('—'), ko(N), ok(O), ok(O)],
    ['Délai de déploiement', ko('—'), ko('long'), ko('années'), ok(`${O} pilote en 3 mois`)],
  ];
  s.addTable(lignes, {
    objectName: 'Tableau comparatif', x: M, y: 1.9, w: CW, colW: [3.13, 2.0, 2.25, 2.5, 2.25],
    fontSize: 15, color: C.text1, rowH: 0.62, valign: 'middle', border: { type: 'solid', pt: 0.75, color: HEX.accent6 },
  });
  s.addText([{ text: 'Avantage durable : ', options: { bold: true, color: C.accent1 } }, { text: 'une bibliothèque de procédures modélisées et des données de délais réels que personne d\'autre ne possède.' }], {
    objectName: 'Avantage', x: M, y: 5.95, w: CW, h: 0.6, fontSize: 17, color: C.text1, margin: 0, isTextBox: true,
  });
  s.addNotes("Nous ne remplaçons aucun portail : nous les relions. Les portails existants servent au dépôt d'une démarche ; SUIVO est une couche de suivi transversale, qui couvre aussi les dépôts papier et se branche sur ces portails par API.");
}

// ================================================================ 9. Mise sur le marché
pres.addSection({ title: 'Exécution' });
{
  const s = slideContenu('Exécution', 'Mise sur le marché', '1 commune, puis 25 communes, puis l\'État');
  const phases = [
    ['Mois 0–6', 'Pilote', "1 commune d'Abidjan + 1 tribunal ; 3 procédures ; gratuit ; mesure avant / après"],
    ['Mois 7–18', 'Preuve', 'Convention avec le ministère ; 12 communes ; 1er organisme national ; prix JNSP comme vitrine'],
    ['Mois 19–36', 'Échelle', "25 communes ; API B2B ; USSD ; intérieur du pays avec des agents relais ; préparation UEMOA"],
  ];
  const w = (CW - 2 * 0.35) / 3;
  s.addShape(pres.shapes.LINE, { objectName: 'Ligne de temps', x: M + 0.3, y: 2.35, w: CW - 0.6, h: 0, line: { color: C.accent6, width: 3 } });
  phases.forEach(([quand, nom, d], i) => {
    const x = M + i * (w + 0.35);
    pastille(s, `Jalon ${i + 1}`, x + 0.3, 2.05, 0.6, String(i + 1), i === 0 ? C.accent2 : C.accent1);
    s.addText(quand, { objectName: `Période ${i + 1}`, x: x + 0.95, y: 2.1, w: 1.45, h: 0.5, fontSize: 16, bold: true, color: C.accent5, valign: 'middle', align: 'center', fill: { color: C.background1 }, margin: 0, isTextBox: true });
    carte(s, `Carte phase ${i + 1}`, x, 2.95, w, 2.6);
    s.addText(nom, { objectName: `Nom phase ${i + 1}`, x: x + 0.3, y: 3.15, w: w - 0.6, h: 0.5, fontSize: 22, bold: true, color: C.text1, margin: 0, isTextBox: true });
    s.addText(d, { objectName: `Texte phase ${i + 1}`, x: x + 0.3, y: 3.75, w: w - 0.6, h: 1.65, fontSize: 15, color: C.text1, valign: 'top', margin: 0, isTextBox: true });
  });
  s.addText([{ text: 'Canaux : ', options: { bold: true } }, { text: 'sponsor ministériel · associations de communes · affiches et QR dans les halls d\'attente · reçu de dépôt · radios de proximité · bailleurs GovTech' }], {
    objectName: 'Canaux', x: M, y: 5.85, w: CW, h: 0.7, fontSize: 15, color: C.text1, margin: 0, isTextBox: true,
  });
  s.addNotes("Nous démarrons petit : une commune et un tribunal pendant 6 mois, avec une mesure avant et après. Puis une convention avec le ministère pour passer à 12 communes et à un premier organisme national, et enfin 25 communes et l'API pour les entreprises.");
}

// ================================================================ 10. Finances
{
  const s = slideContenu('Exécution', 'Projections financières — scénario central (FCFA HT)', 'Équilibre vers le mois 36, avec 393 M FCFA de financement');
  s.addChart(pres.charts.BAR, [
    { name: "Chiffre d'affaires", labels: ['Année 1', 'Année 2', 'Année 3'], values: [12.1, 130.9, 255.9] },
    { name: 'EBITDA', labels: ['Année 1', 'Année 2', 'Année 3'], values: [-41.9, -57.1, -20.6] },
  ], {
    objectName: 'Graphique CA et EBITDA', x: M, y: 1.85, w: 7.3, h: 4.8, barDir: 'col', barGrouping: 'clustered', barGapWidthPct: 70,
    showTitle: true, title: "Chiffre d'affaires et EBITDA (M FCFA)", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: '+mn-lt',
    chartColors: [HEX.accent1, HEX.accent2], showValue: true, dataLabelPosition: 'outEnd', dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: '+mn-lt', dataLabelFormatCode: '0',
    catAxisLabelColor: HEX.dk1, catAxisLabelFontSize: 12, catAxisLabelFontFace: '+mn-lt', catAxisLabelPos: 'low',
    valAxisHidden: true, valGridLine: { color: 'E2E8F0', size: 0.5 }, catGridLine: { style: 'none' },
    showLegend: true, legendPos: 'b', legendFontSize: 12, legendFontFace: '+mn-lt', legendColor: HEX.dk1,
  });
  const kpis = [
    ['256 M', "FCFA de chiffre d'affaires en année 3", C.accent1],
    ['77 %', 'de marge brute en année 3', C.accent1],
    ['26', 'administrations clientes à 36 mois', C.accent2],
    ['≈ 430', 'FCFA de coût complet par demande suivie', C.accent2],
  ];
  kpis.forEach(([n, t, col], i) => {
    const y = 1.85 + i * 1.12;
    s.addText(n, { objectName: `KPI ${i + 1}`, x: 8.3, y, w: 1.95, h: 0.95, fontSize: 34, bold: true, color: col, valign: 'middle', margin: 0, isTextBox: true });
    s.addText(t, { objectName: `Libellé KPI ${i + 1}`, x: 10.3, y, w: 2.43, h: 0.95, fontSize: 14, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
  });
  s.addText("Scénario pessimiste (État payant à 6 mois, −40 % de clients) : la trésorerie reste positive sur 36 mois.", {
    objectName: 'Résilience', x: 8.3, y: 6.3, w: 4.43, h: 0.6, fontSize: 12, italic: true, color: C.accent5, margin: 0, isTextBox: true,
  });
  s.addNotes("À 36 mois, nous visons 25 communes et 2 organismes nationaux, 256 millions de chiffre d'affaires, 77 % de marge brute et l'équilibre vers le mois 36. Le besoin total est de 393 millions de FCFA. Même dans le scénario pessimiste, avec un État qui paie à 6 mois et 40 % de clients en moins, la trésorerie reste positive.");
}

// ================================================================ 11. Équipe
{
  const s = slideContenu('Exécution', 'Équipe et organisation', 'Une équipe produit, tech et terrain');
  const roles = [
    ['CEO', 'Partenariats et État', 'Ministères et communes, levée de fonds, finance et juridique'],
    ['CTO', 'Plateforme', 'Architecture, sécurité, intégrations, SMS et USSD'],
    ['CPO', 'Produit et terrain', 'Recherche utilisateur, backlog, adoption par les agents'],
  ];
  const w = (CW - 2 * 0.35) / 3;
  roles.forEach(([r, t, d], i) => {
    const x = M + i * (w + 0.35);
    carte(s, `Carte ${r}`, x, 1.9, w, 2.65);
    pastille(s, `Rôle ${r}`, x + 0.3, 2.15, 0.95, r, C.accent1, 16);
    s.addText(t, { objectName: `Titre ${r}`, x: x + 1.45, y: 2.15, w: w - 1.7, h: 0.95, fontSize: 20, bold: true, color: C.text1, valign: 'middle', margin: 0, isTextBox: true });
    s.addText(d, { objectName: `Mission ${r}`, x: x + 0.3, y: 3.35, w: w - 0.6, h: 1.05, fontSize: 15, color: C.text1, valign: 'top', margin: 0, isTextBox: true });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: 'Fond organisation', x: M, y: 4.85, w: CW, h: 1.7, rectRadius: 0.12, fill: { color: C.accent6 }, line: { color: C.accent6 } });
  s.addText([
    { text: 'Squads autonomes par mission', options: { bold: true, color: C.accent4 } },
    { text: ' (Usager · Administration · Plateforme) · OKR trimestriels · culture de l\'écrit · décisions fondées sur les données', options: { breakLine: true } },
    { text: 'Comité consultatif : ', options: { bold: true, color: C.accent4 } },
    { text: 'un ancien haut fonctionnaire, un expert GovTech, un juriste spécialiste des données (ARTCI)' },
  ], { objectName: 'Texte organisation', x: M + 0.35, y: 4.85, w: CW - 0.7, h: 1.7, fontSize: 16, color: C.text1, valign: 'middle', paraSpaceAfter: 8, margin: 0, isTextBox: true });
  s.addNotes("Notre équipe réunit produit, technique et terrain, parce que le vrai défi est l'adoption par les agents, et nous l'avons pensée dès le premier jour. [À PERSONNALISER : ajouter le nom et la photo de chaque fondateur, avec une ligne de crédibilité.]");
}

// ================================================================ 12. Demande
pres.addSection({ title: 'Conclusion' });
{
  const s = pres.addSlide({ masterName: 'SUIVO_CONCLUSION', sectionTitle: 'Conclusion' });
  s.addText('NOTRE DEMANDE', { placeholder: 'kicker' });
  s.addText('Un pilote : 6 mois, une commune, un tribunal', { placeholder: 'title' });
  const demandes = [
    ['Un sponsor', 'au Ministère de la Fonction Publique et au Ministère de la Transition Numérique'],
    ['Une commune et un tribunal pilotes', "pour 3 procédures : acte de naissance, certificat de nationalité, casier judiciaire"],
    ['85 M FCFA de pré-amorçage', '(prix, incubateur, business angels) pour livrer le pilote'],
  ];
  demandes.forEach(([b, t], i) => {
    const y = 3.0 + i * 0.95;
    pastille(s, `Demande ${i + 1}`, 0.8, y + 0.1, 0.55, String(i + 1), C.accent2, 16);
    s.addText([{ text: `${b} `, options: { bold: true, color: C.background1 } }, { text: t, options: { color: C.accent6 } }], {
      objectName: `Texte demande ${i + 1}`, x: 1.6, y, w: 6.6, h: 0.8, fontSize: 17, valign: 'middle', margin: 0, isTextBox: true,
    });
  });
  s.addText('10 000', { objectName: 'Objectif chiffre', x: 8.9, y: 3.0, w: 3.7, h: 1.2, fontSize: 66, bold: true, color: C.accent2, margin: 0, isTextBox: true });
  s.addText('déplacements évités par mois dès la fin du pilote', { objectName: 'Objectif libellé', x: 8.9, y: 4.25, w: 3.7, h: 0.9, fontSize: 18, color: C.background1, valign: 'top', margin: 0, isTextBox: true });
  s.addText("Pour qu'aucun Ivoirien n'ait plus à demander « où en est mon dossier ? »", {
    objectName: 'Vision', x: 0.8, y: 6.0, w: 11.7, h: 0.6, fontSize: 20, italic: true, color: C.background1, margin: 0, isTextBox: true,
  });
  s.addNotes("Nous vous demandons un pilote : un sponsor, une commune, un tribunal, trois procédures. Notre objectif est de 10 000 déplacements évités par mois à la fin du pilote. Pour qu'aucun Ivoirien n'ait plus à demander « où en est mon dossier ? ». Merci.");
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  if (process.env.APPLY_THEME) await require(process.env.APPLY_THEME).applyTheme(OUT, THEME);
  console.log('OK', OUT);
})();

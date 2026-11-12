// Pitch deck illustré SUIVO (.pptx) — exécution du prompt 00c-PROMPT-PITCH-ILLUSTRE.md
// Usage : npm install pptxgenjs@3.12.0 sharp@0.33.5 react@18.3.1 react-dom@18.3.1 react-icons@5.4.0
//         node generer.js            (APPLY_THEME=/chemin/apply_theme.js pour inscrire la palette dans le thème)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fa = require('react-icons/fa6');
const pptxgen = require('pptxgenjs');

const ICI = __dirname;
const SVG_DIR = path.join(ICI, 'svg');
const PNG_DIR = path.join(ICI, 'png');
const CAP = path.join(ICI, '..', '..', 'assets', 'captures');
const OUT = path.join(ICI, '..', 'SUIVO-pitch-illustre.pptx');
[SVG_DIR, PNG_DIR].forEach((d) => fs.mkdirSync(d, { recursive: true }));

const V = '#17603C', VF = '#0C3320', VC = '#EEF6F1', VM = '#D4EADC', O = '#F28C28', OC = '#FFE3C7', ENC = '#0F172A';
const PEAU = ['#8D5524', '#6B3F1D', '#A0673A'];

// ------------------------------------------------------------------ Illustrations SVG
function personne({ x, y, s = 1, peau = PEAU[0], haut = V, tete = null, humeur = 'neutre' }) {
  const coiffe = {
    foulard: `<path d="M-23,12 Q-22,-14 0,-12 Q24,-14 23,12 Q0,2 -23,12Z" fill="${O}"/><circle cx="20" cy="-6" r="7" fill="${O}"/>`,
    chapeau: `<path d="M-15,-1 Q-13,-19 0,-19 Q13,-19 15,-1Z" fill="#7C5A2E"/><rect x="-27" y="-3" width="54" height="6" rx="3" fill="#7C5A2E"/>`,
    cheveux: `<path d="M-21,14 Q-25,-8 0,-6 Q25,-8 21,14 Q17,1 0,1 Q-17,1 -21,14Z" fill="#1F1F1F"/>`,
    court: `<path d="M-20,8 Q-19,-6 0,-6 Q19,-6 20,8 Q10,0 0,0 Q-10,0 -20,8Z" fill="#1F1F1F"/>`,
  }[tete] || '';
  const bouche = { content: 'M-7,26 Q0,32 7,26', triste: 'M-7,30 Q0,24 7,30', neutre: 'M-6,28 L6,28' }[humeur];
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M-32,95 Q-32,44 0,44 Q32,44 32,95Z" fill="${haut}"/>
    <rect x="-7" y="34" width="14" height="12" fill="${peau}"/>
    <circle cx="0" cy="18" r="21" fill="${peau}"/>${coiffe}
    <circle cx="-7" cy="16" r="2.6" fill="${ENC}"/><circle cx="7" cy="16" r="2.6" fill="${ENC}"/>
    <path d="${bouche}" stroke="${ENC}" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>`;
}
const cadre = (contenu, w = 320, h = 240, fond = VC) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="22" fill="${fond}"/>${contenu}</svg>`;
const bulle = (x, y, w, h, texte, taille = 15, queueX = null) =>
  `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#fff" stroke="${V}" stroke-width="2.5"/>`
  + (queueX != null ? `<path d="M${queueX},${y + h - 1} l12,16 l6,-17Z" fill="#fff" stroke="${V}" stroke-width="2.5" stroke-linejoin="round"/><rect x="${queueX + 1}" y="${y + h - 4}" width="16" height="5" fill="#fff"/>` : '')
  + `<text x="${x + w / 2}" y="${y + h / 2 + taille / 3}" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${taille}" fill="${ENC}">${texte}</text></g>`;

const SVGS = {
  // Vignettes du contexte
  'scene-1-guichet': cadre(`
    <rect x="150" y="40" width="150" height="112" rx="10" fill="#fff" stroke="${V}" stroke-width="6"/>
    ${personne({ x: 225, y: 66, s: 0.85, peau: PEAU[1], haut: V, tete: 'cheveux' })}
    <rect x="135" y="148" width="180" height="76" rx="8" fill="${V}"/>
    <rect x="160" y="168" width="54" height="8" rx="4" fill="${VM}"/>
    ${personne({ x: 78, y: 112, s: 1.15, peau: PEAU[0], haut: O, tete: 'foulard', humeur: 'neutre' })}
    ${bulle(14, 14, 128, 46, 'Revenez…', 17, 110)}`),
  'scene-2-transport': cadre(`
    <rect x="0" y="182" width="320" height="58" fill="#CBD5E1"/>
    <rect x="20" y="206" width="40" height="7" rx="3" fill="#fff"/><rect x="140" y="206" width="40" height="7" rx="3" fill="#fff"/><rect x="260" y="206" width="40" height="7" rx="3" fill="#fff"/>
    <rect x="44" y="84" width="230" height="102" rx="22" fill="${O}"/>
    <rect x="62" y="100" width="44" height="36" rx="7" fill="#fff"/><rect x="116" y="100" width="44" height="36" rx="7" fill="#fff"/><rect x="170" y="100" width="44" height="36" rx="7" fill="#fff"/><rect x="224" y="100" width="34" height="36" rx="7" fill="#fff"/>
    <rect x="44" y="150" width="230" height="10" fill="${V}"/>
    <circle cx="96" cy="188" r="20" fill="${ENC}"/><circle cx="96" cy="188" r="8" fill="#CBD5E1"/>
    <circle cx="226" cy="188" r="20" fill="${ENC}"/><circle cx="226" cy="188" r="8" fill="#CBD5E1"/>
    <circle cx="268" cy="44" r="30" fill="#fff" stroke="${V}" stroke-width="5"/>
    <text x="268" y="52" text-anchor="middle" font-family="Inter" font-weight="800" font-size="22" fill="${V}">F</text>
`),
  'scene-3-attente': cadre(`
    <rect x="30" y="178" width="260" height="14" rx="7" fill="${V}"/><rect x="50" y="190" width="10" height="34" fill="${V}"/><rect x="260" y="190" width="10" height="34" fill="${V}"/>
    ${personne({ x: 110, y: 96, s: 1.05, peau: PEAU[2], haut: '#64748B', tete: 'chapeau', humeur: 'triste' })}
    ${personne({ x: 205, y: 96, s: 1.05, peau: PEAU[0], haut: O, tete: 'foulard', humeur: 'triste' })}
    <circle cx="160" cy="50" r="34" fill="#fff" stroke="${V}" stroke-width="6"/>
    <path d="M160,50 L160,28 M160,50 L176,58" stroke="${ENC}" stroke-width="5" stroke-linecap="round"/>
    ${bulle(232, 14, 70, 46, '?', 30)}`),
  'scene-4-retour': cadre(`
    <rect x="160" y="40" width="130" height="120" rx="14" fill="#fff" stroke="${V}" stroke-width="6"/>
    <rect x="160" y="40" width="130" height="34" rx="12" fill="${V}"/><rect x="160" y="62" width="130" height="12" fill="${V}"/>
    <rect x="186" y="28" width="10" height="26" rx="5" fill="${ENC}"/><rect x="254" y="28" width="10" height="26" rx="5" fill="${ENC}"/>
    <text x="225" y="138" text-anchor="middle" font-family="Inter" font-weight="800" font-size="50" fill="${O}">!</text>
    ${personne({ x: 80, y: 112, s: 1.15, peau: PEAU[0], haut: O, tete: 'foulard', humeur: 'triste' })}`),
  // Avatars des personas
  'avatar-awa': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="100" fill="${OC}"/><clipPath id="c"><circle cx="100" cy="100" r="100"/></clipPath><g clip-path="url(#c)">${personne({ x: 100, y: 62, s: 1.9, peau: PEAU[0], haut: V, tete: 'foulard', humeur: 'content' })}<rect x="128" y="148" width="26" height="44" rx="5" fill="${ENC}"/><rect x="132" y="153" width="18" height="30" rx="2" fill="#7DD3A8"/></g></svg>`,
  'avatar-konan': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="100" fill="${VM}"/><clipPath id="c"><circle cx="100" cy="100" r="100"/></clipPath><g clip-path="url(#c)">${personne({ x: 100, y: 62, s: 1.9, peau: PEAU[1], haut: '#64748B', tete: 'chapeau', humeur: 'neutre' })}<rect x="130" y="152" width="22" height="36" rx="4" fill="${ENC}"/><rect x="134" y="157" width="14" height="12" rx="1" fill="#CBD5E1"/></g></svg>`,
  'avatar-bamba': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="100" fill="${VC}"/><clipPath id="c"><circle cx="100" cy="100" r="100"/></clipPath><g clip-path="url(#c)">${personne({ x: 100, y: 62, s: 1.9, peau: PEAU[2], haut: V, tete: 'cheveux', humeur: 'neutre' })}<circle cx="86" cy="93" r="10" fill="none" stroke="${ENC}" stroke-width="3"/><circle cx="114" cy="93" r="10" fill="none" stroke="${ENC}" stroke-width="3"/><path d="M96,93 L104,93" stroke="${ENC}" stroke-width="3"/><rect x="118" y="160" width="26" height="18" rx="3" fill="#fff"/><rect x="122" y="165" width="18" height="3" fill="${V}"/></g></svg>`,
  // Colis suivi (page de garde)
  'colis-suivi': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 260" width="300" height="260">
    <path d="M40,230 C90,230 90,170 150,170 S220,120 250,90" fill="none" stroke="${VM}" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>
    <circle cx="40" cy="230" r="14" fill="${V}" stroke="#fff" stroke-width="4"/><circle cx="150" cy="170" r="14" fill="${V}" stroke="#fff" stroke-width="4"/>
    <path d="M70,96 L150,60 L230,96 L150,132Z" fill="#D9A15B"/><path d="M70,96 L150,132 L150,226 L70,190Z" fill="#B97F3C"/><path d="M230,96 L150,132 L150,226 L230,190Z" fill="#C98E48"/>
    <path d="M110,78 L190,114 L190,140 L176,134 L176,120 L96,84Z" fill="#EBD3A6"/>
    <rect x="160" y="150" width="56" height="34" rx="4" fill="#fff" transform="skewY(-24) translate(0,86)"/>
    <path d="M250,20 C228,20 214,36 214,56 C214,82 250,112 250,112 C250,112 286,82 286,56 C286,36 272,20 250,20Z" fill="${O}"/><circle cx="250" cy="56" r="13" fill="#fff"/></svg>`,
};


// ------------------------------------------------------------------ Rendu des images
async function rasteriser(nom, largeur) {
  const svg = SVGS[nom];
  fs.writeFileSync(path.join(SVG_DIR, `${nom}.svg`), svg);
  const sortie = path.join(PNG_DIR, `${nom}.png`);
  await sharp(Buffer.from(svg), { density: 300 }).resize({ width: largeur }).png().toFile(sortie);
  return sortie;
}

async function icone(Composant, couleur = '#FFFFFF', taille = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Composant, { color: couleur, size: taille }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

// Capture dans un cadre de téléphone (coins arrondis, bord sombre)
async function telephone(fichier, sortieNom, masquerPied = false) {
  const W = 780, H = 1688, b = 26, r = 70;
  let img = await sharp(path.join(CAP, fichier)).extract({ left: 0, top: 0, width: W, height: H }).png().toBuffer();
  // Masque le pied de page de l'application (mention technique sans intérêt pour une maquette)
  const blanc = Buffer.from(`<svg width="${W}" height="160"><rect width="${W}" height="160" fill="#F8FAFC"/></svg>`);
  if (masquerPied) img = await sharp(img).composite([{ input: blanc, left: 0, top: H - 160 }]).png().toBuffer();
  const masque = Buffer.from(`<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" rx="${r}" fill="#fff"/></svg>`);
  const arrondie = await sharp(img).composite([{ input: masque, blend: 'dest-in' }]).png().toBuffer();
  const fond = Buffer.from(`<svg width="${W + 2 * b}" height="${H + 2 * b}"><rect width="${W + 2 * b}" height="${H + 2 * b}" rx="${r + b}" fill="#111827"/></svg>`);
  const sortie = path.join(PNG_DIR, `${sortieNom}.png`);
  await sharp(fond).composite([{ input: arrondie, left: b, top: b }]).png().toFile(sortie);
  return { chemin: sortie, ratio: (W + 2 * b) / (H + 2 * b), b: b / (W + 2 * b), bh: b / (H + 2 * b) };
}

// ------------------------------------------------------------------ Deck
(async () => {
  const img = {};
  for (const [n, w] of [['scene-1-guichet', 960], ['scene-2-transport', 960], ['scene-3-attente', 960], ['scene-4-retour', 960],
    ['avatar-awa', 400], ['avatar-konan', 400], ['avatar-bamba', 400], ['colis-suivi', 900]]) img[n] = await rasteriser(n, w);
  const telAccueil = await telephone('01-accueil-mobile.png', 'tel-accueil');
  const telSuivi = await telephone('02-suivi-public-mobile.png', 'tel-suivi');
  const telDossiers = await telephone('03-mes-dossiers-mobile.png', 'tel-dossiers', true);
  // Captures « ordinateur » recadrées au format 16:10 pour la diapositive « ce que voit chaque acteur »
  const recadrer = async (f, nom) => {
    const sortie = path.join(PNG_DIR, `${nom}.png`);
    await sharp(path.join(CAP, f)).extract({ left: 0, top: 0, width: 2560, height: 1600 }).resize({ width: 1280 }).png().toFile(sortie);
    return sortie;
  };
  const ecranAgent = await recadrer('07-file-agent.png', 'ecran-agent');
  const ecranPilotage = await recadrer('10-pilotage.png', 'ecran-pilotage');
  const ic = {};
  for (const [k, C] of Object.entries({ suivre: fa.FaMobileScreenButton, notif: fa.FaBell, piece: fa.FaFileArrowUp, relance: fa.FaBullhorn,
    depot: fa.FaInbox, routage: fa.FaRoute, suivi: fa.FaLocationDot, retrait: fa.FaBoxOpen, etat: fa.FaBuildingColumns,
    qr: fa.FaQrcode, repete: fa.FaRepeat, argent: fa.FaMoneyBillWave, invisible: fa.FaEyeSlash, agent: fa.FaHeadset, chef: fa.FaChartLine, partenaire: fa.FaHandshake, principe: fa.FaCircleCheck, famille: fa.FaPeopleRoof, lien: fa.FaDiagramProject, chrono: fa.FaStopwatch, mesure: fa.FaChartColumn, cadenas: fa.FaLock, canaux: fa.FaTowerBroadcast, code: fa.FaCode, oeil: fa.FaEye, clic: fa.FaHandPointer, wifi: fa.FaWifi, acces: fa.FaUniversalAccess, voix: fa.FaVolumeHigh, proche: fa.FaPeopleGroup, copie: fa.FaClone, globe: fa.FaGlobe, reglage: fa.FaSliders, liste: fa.FaListCheck, texte: fa.FaFont, engrenage: fa.FaGears, sms: fa.FaCommentSms, citoyen: fa.FaUser, entreprise: fa.FaBriefcase, premium: fa.FaStar })) ic[k] = await icone(C);

  const icPrincipe = await icone(fa.FaCircleCheck, V);
  const THEME = {
    name: 'SUIVO illustré', headFontFace: 'Calibri', bodyFontFace: 'Calibri',
    colors: { dk1: '0F172A', lt1: 'FFFFFF', dk2: '17603C', lt2: 'EEF6F1', accent1: '17603C', accent2: 'F28C28', accent3: 'B91C1C', accent4: '0C3320', accent5: '64748B', accent6: 'D4EADC', hlink: '17603C', folHlink: '0C3320' },
  };
  const H = THEME.colors;
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.theme = { headFontFace: 'Calibri', bodyFontFace: 'Calibri' };
  pres.title = 'SUIVO — Pitch illustré JNSP 2026';
  pres.author = 'SUIVO';
  const C = pres.SchemeColor;
  const M = 0.6, CW = 13.333 - 2 * M;

  pres.defineSlideMaster({
    title: 'SUIVO_GARDE', background: { color: H.accent4 },
    objects: [{ text: { text: 'SUIVO · JNSP Sprint Digital 2026', options: { x: 0.8, y: 6.95, w: 6, h: 0.3, fontSize: 11, color: C.accent6, margin: 0 } } }],
  });
  pres.defineSlideMaster({
    title: 'SUIVO_CONTENU', background: { color: H.lt1 },
    objects: [
      { placeholder: { options: { name: 'kicker', type: 'body', x: M, y: 0.38, w: 8, h: 0.35, fontSize: 13, bold: true, color: C.accent2, charSpacing: 2, margin: 0 }, text: '' } },
      { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.72, w: 9.6, h: 0.75, fontSize: 32, bold: true, color: C.text1, align: 'left', valign: 'top', margin: 0 }, text: '' } },
      { text: { text: 'SUIVO · JNSP Sprint Digital 2026', options: { x: M, y: 7.02, w: 6, h: 0.3, fontSize: 11, color: C.accent5, margin: 0 } } },
    ],
    slideNumber: { x: 12.2, y: 7.02, w: 0.55, h: 0.3, fontSize: 11, color: C.accent5, align: 'right' },
  });

  const TOTAL = 15;
  // Motif récurrent : le « suivi de colis » du deck (points d'étape en haut à droite)
  function motif(s, n, sombre = false) {
    const x0 = 10.55, x1 = 12.65, y = 0.62;
    s.addShape(pres.shapes.LINE, { objectName: 'Motif ligne', x: x0, y, w: x1 - x0, h: 0, line: { color: sombre ? C.accent1 : C.accent6, width: 2.5 } });
    for (let i = 1; i <= TOTAL; i += 1) {
      const x = x0 + ((i - 1) * (x1 - x0)) / (TOTAL - 1);
      const d = i === n ? 0.24 : 0.14;
      const col = i === n ? C.accent2 : i < n ? (sombre ? C.accent6 : C.accent1) : (sombre ? C.accent4 : C.accent6);
      s.addShape(pres.shapes.OVAL, { objectName: `Motif étape ${i}`, x: x - d / 2, y: y - d / 2, w: d, h: d, fill: { color: col }, line: { color: sombre ? C.accent6 : C.background1, width: 1.5 } });
    }
  }
  function contenu(n, kicker, titre) {
    const s = pres.addSlide({ masterName: 'SUIVO_CONTENU' });
    s.addText(kicker.toUpperCase(), { placeholder: 'kicker' });
    s.addText(titre, { placeholder: 'title' });
    motif(s, n);
    return s;
  }
  const txt = (s, nom, t, o) => s.addText(t, { objectName: nom, margin: 0, isTextBox: true, color: C.text1, fontSize: 16, valign: 'top', ...o });
  const rond = (s, nom, x, y, d, icon, fill = C.accent1) => {
    s.addShape(pres.shapes.OVAL, { objectName: nom, x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
    s.addImage({ objectName: `${nom} icône`, data: icon, x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5, altText: nom });
  };
  const carte = (s, nom, x, y, w, h, fill = C.background2) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: nom, x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: fill } });
  // Trait de (x1, y1) à (x2, y2) avec flèches
  const ligne = (s, nom, x1, y1, x2, y2, line) => s.addShape(pres.shapes.LINE, {
    objectName: nom, x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: (y2 - y1) * (x2 - x1) < 0, line,
  });
  const ombre = () => ({ type: 'outer', color: '000000', opacity: 0.22, blur: 10, offset: 3, angle: 90 });

  // ============================================================ 1. Page de garde
  {
    const s = pres.addSlide({ masterName: 'SUIVO_GARDE' });
    motif(s, 1, true);
    txt(s, 'Surtitre', 'JNSP 2026 · SPRINT DIGITAL', { x: 0.8, y: 1.45, w: 7, h: 0.4, fontSize: 14, bold: true, color: C.accent2, charSpacing: 2 });
    txt(s, 'Nom', 'SUIVO', { x: 0.8, y: 1.9, w: 7, h: 1.4, fontSize: 88, bold: true, color: C.background1 });
    txt(s, 'Promesse', 'Votre dossier administratif, suivi comme un colis', { x: 0.8, y: 3.35, w: 6.4, h: 1.1, fontSize: 28, bold: true, color: C.background1 });
    txt(s, 'Problématique', 'Problématique : suivi des demandes administratives\nPlateforme web et mobile · SMS · WhatsApp · USSD', { x: 0.8, y: 4.75, w: 6.4, h: 0.8, fontSize: 16, color: C.accent6, paraSpaceAfter: 4 });
    s.addImage({ objectName: 'Illustration colis suivi', path: img['colis-suivi'], x: 6.75, y: 3.65, w: 2.9, h: 2.51, altText: 'Colis avec un repère de position et un trajet en pointillés : le dossier suivi comme un colis' });
    s.addImage({ objectName: 'Capture écran d\'accueil', path: telAccueil.chemin, x: 9.75, y: 0.95, w: 5.7 * telAccueil.ratio, h: 5.7, altText: "Maquette — Écran d'accueil de l'application SUIVO", shadow: ombre() });
    s.addNotes("[≈ 20 s] Bonjour. Nous sommes SUIVO, et notre promesse tient en une phrase : suivre son dossier administratif comme on suit un colis.");
  }

  // ============================================================ 2. Sommaire (les 7 points attendus par le jury)
  {
    const s = contenu(2, 'Sommaire', 'Sept points en dix minutes');
    const pts = [
      ['Le problème à résoudre', '3–4'], ['La solution proposée et son fonctionnement', '5–8'], ["L'impact sur le citoyen et le service public", '9'],
      ['Le caractère innovant', '10'], ['La faisabilité technique et opérationnelle', '11'], ["L'expérience utilisateur et l'inclusion", '12'],
      ['Le potentiel de déploiement et de pérennisation', '13–14'],
    ];
    pts.forEach(([t, d], i) => {
      const y = 1.7 + i * 0.7;
      s.addShape(pres.shapes.OVAL, { objectName: `Point ${i + 1}`, x: M, y, w: 0.5, h: 0.5, fill: { color: i % 2 ? C.accent1 : C.accent2 }, line: { color: C.background1 } });
      txt(s, `Numéro point ${i + 1}`, String(i + 1), { x: M, y, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: C.background1, align: 'center', valign: 'middle' });
      txt(s, `Texte point ${i + 1}`, t, { x: M + 0.75, y, w: 6.9, h: 0.5, fontSize: 20, bold: true, valign: 'middle' });
      txt(s, `Diapositives point ${i + 1}`, `diapositives ${d}`, { x: M + 7.7, y, w: 1.4, h: 0.5, fontSize: 12, color: C.accent5, valign: 'middle' });
    });
    s.addImage({ objectName: 'Illustration colis suivi (sommaire)', path: img['colis-suivi'], x: 9.85, y: 2.3, w: 3.0, h: 2.6, altText: 'Colis suivi : le fil conducteur de la présentation' });
    s.addNotes("[≈ 15 s] Nous allons répondre, dans l'ordre, aux sept points attendus : le problème, la solution et son fonctionnement, son impact, son caractère innovant, sa faisabilité, l'expérience utilisateur et l'inclusion, et enfin son déploiement et sa pérennité.");
  }

  // ============================================================ 2. Contexte — le problème
  {
    const s = contenu(3, '1 · Le problème à résoudre', '« Revenez la semaine prochaine »');
    const scenes = [['scene-1-guichet', 'Dépôt au guichet'], ['scene-2-transport', 'Retour en woro-woro'], ['scene-3-attente', '« Pas encore prêt »'], ['scene-4-retour', '« Il manque une pièce »']];
    const w = 2.85, g = (CW - 4 * w) / 3;
    scenes.forEach(([n, l], i) => {
      const x = M + i * (w + g);
      s.addImage({ objectName: `Vignette ${i + 1}`, path: img[n], x, y: 1.75, w, h: w * 0.75, altText: l });
      const yl = 1.88 + w * 0.75;
      s.addShape(pres.shapes.OVAL, { objectName: `Numéro vignette ${i + 1}`, x, y: yl, w: 0.38, h: 0.38, fill: { color: C.accent2 }, line: { color: C.accent2 } });
      txt(s, `Numéro ${i + 1} texte`, String(i + 1), { x, y: yl, w: 0.38, h: 0.38, fontSize: 13, bold: true, color: C.background1, align: 'center', valign: 'middle' });
      txt(s, `Légende vignette ${i + 1}`, l, { x: x + 0.5, y: yl, w: w - 0.5, h: 0.38, fontSize: 15, bold: true, valign: 'middle' });
    });
    const constats = [[ic.repete, 'Des allers-retours répétés', 'souvent juste pour demander où en est le dossier', C.accent3], [ic.argent, 'Du temps et de l\'argent perdus', 'transport, journées de travail, intermédiaires', C.accent2], [ic.invisible, 'Aucune visibilité', "ni sur l'étape, ni sur le service, ni sur le délai", C.accent1]];
    constats.forEach(([icn, t, d, col], i) => {
      const x = M + i * 4.1;
      rond(s, `Constat ${i + 1}`, x, 4.82, 0.75, icn, col);
      txt(s, `Texte constat ${i + 1}`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { fontSize: 13, color: C.accent5 } }], { x: x + 0.95, y: 4.75, w: 3.0, h: 0.9, fontSize: 16, valign: 'middle' });
    });
    txt(s, 'Constat', "Personne, pas même l'administration, ne sait où est le dossier, qui le traite ni quand il sera prêt.", { x: M, y: 6.05, w: CW, h: 0.5, fontSize: 18, bold: true, color: C.accent1 });
    s.addNotes("[≈ 45 s] Obtenir un document demande souvent plusieurs déplacements : on dépose, on revient en woro-woro, on s'entend dire que ce n'est pas prêt, puis qu'il manque une pièce. Chaque aller-retour coûte du temps et de l'argent. Et l'administration elle-même ne sait pas toujours où est le dossier.");
  }

  // ============================================================ 3. Contexte — personas
  {
    const s = contenu(4, '1 · Le problème à résoudre', 'Trois personnes, une même attente');
    const p = [
      ['avatar-awa', 'Awa, 29 ans', 'Aînée, représente ses jeunes frères orphelins · smartphone', '« Obtenir le capital décès de notre père pour mes petits frères, sans faire le tour des bureaux. »', 'Aucune date, des démarcheurs, des allers-retours.'],
      ['avatar-konan', 'Konan, 52 ans', 'Planteur à Daloa · téléphone basique, lit peu le français', '« Savoir où en est le titre foncier de ma plantation sans aller trois fois en ville. »', 'Le coût du transport ; il dépend de ses enfants pour lire.'],
      ['avatar-bamba', 'Mme Bamba, 41 ans', 'Agente de guichet en mairie · reçoit les usagers toute la journée', '« Répondre vite aux usagers et avoir moins de monde devant mon guichet. »', 'Questions répétitives, outils lents.'],
    ];
    const w = (CW - 2 * 0.35) / 3;
    p.forEach(([a, nom, profil, citation, douleur], i) => {
      const x = M + i * (w + 0.35);
      carte(s, `Carte ${nom}`, x, 1.75, w, 4.95);
      s.addImage({ objectName: `Avatar ${nom}`, path: img[a], x: x + 0.25, y: 2.0, w: 1.25, h: 1.25, altText: `Portrait illustré : ${nom}` });
      txt(s, `Nom ${nom}`, nom, { x: x + 1.65, y: 2.05, w: w - 1.8, h: 0.4, fontSize: 16, bold: true });
      txt(s, `Profil ${nom}`, profil, { x: x + 1.65, y: 2.48, w: w - 1.8, h: 0.85, fontSize: 13, color: C.accent5 });
      txt(s, `Citation ${nom}`, citation, { x: x + 0.3, y: 3.6, w: w - 0.6, h: 1.65, fontSize: 17, italic: true, color: C.accent1 });
      txt(s, `Douleur ${nom}`, [{ text: 'Sa douleur : ', options: { bold: true, color: C.accent2 } }, { text: douleur }], { x: x + 0.3, y: 5.15, w: w - 0.6, h: 1.1, fontSize: 14 });
    });
    s.addNotes("[≈ 40 s] Le problème touche trois personnes. Awa a perdu son père, fonctionnaire : elle fait la demande de capital décès pour ses jeunes frères et perd des journées dans les bureaux. Konan, planteur à Daloa, attend le titre foncier de sa plantation ; il n'a qu'un téléphone basique et paie cher chaque trajet. Et Mme Bamba, au guichet, passe ses journées à répondre « pas encore » au lieu de traiter les dossiers.");
  }

  // ============================================================ 4. Solution
  {
    const s = contenu(5, '2 · La solution proposée (maquettes)', 'Une plateforme de suivi des demandes');
    const h = 5.05, w1 = h * telSuivi.ratio;
    s.addImage({ objectName: 'Capture suivi public', path: telSuivi.chemin, x: M + 0.1, y: 1.65, w: w1, h, altText: 'Maquette — Suivi public d\'un dossier de capital décès : étape 2 sur 3, liquidation des droits, en retard', shadow: ombre() });
    s.addImage({ objectName: 'Capture mes dossiers', path: telDossiers.chemin, x: M + w1 + 0.45, y: 1.65, w: w1, h, altText: 'Maquette — Liste des dossiers de l\'usager avec leur progression', shadow: ombre() });
    // Repères numérotés sur la capture (positions relatives à l'image)
    const reperes = [[0.27, 'N° de suivi unique'], [0.355, 'Étape et service responsable'], [0.45, 'Délai restant ou retard']];
    const ix = M + 0.1, iy = 1.65;
    reperes.forEach(([fy], k) => {
      const y = iy + h * (telSuivi.bh + fy * (1 - 2 * telSuivi.bh)) - 0.16;
      s.addShape(pres.shapes.OVAL, { objectName: `Repère ${k + 1}`, x: ix + w1 - 0.17, y, w: 0.34, h: 0.34, fill: { color: C.accent2 }, line: { color: C.background1, width: 1.5 } });
      txt(s, `Repère ${k + 1} texte`, String(k + 1), { x: ix + w1 - 0.17, y, w: 0.34, h: 0.34, fontSize: 12, bold: true, color: C.background1, align: 'center', valign: 'middle' });
    });
    const xd = M + 2 * w1 + 0.85;
    txt(s, 'Légende repères', reperes.map(([, l], k) => ({ text: `${k + 1}  ${l}`, options: { breakLine: k < 2 } })), { x: xd, y: 1.7, w: 12.73 - xd, h: 1.1, fontSize: 15, bold: true, color: C.accent2, paraSpaceAfter: 4 });
    const benef = [[ic.suivre, 'Suivre à distance', 'sans compte, avec le numéro'], [ic.notif, 'Être notifié', 'par SMS ou WhatsApp à chaque étape'], [ic.piece, 'Répondre à distance', "quand une pièce manque"], [ic.relance, 'Relancer', 'si le délai prévu est dépassé']];
    benef.forEach(([icn, t, d], k) => {
      const y = 3.0 + k * 0.82;
      rond(s, `Bénéfice ${t}`, xd, y, 0.62, icn);
      txt(s, `Texte ${t}`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { color: C.accent5, fontSize: 14 } }], { x: xd + 0.8, y: y - 0.02, w: 12.73 - xd - 0.8, h: 0.7, fontSize: 16, valign: 'middle' });
    });
    carte(s, 'Bandeau État', xd, 6.35, 12.73 - xd, 0.55, C.accent6);
    s.addImage({ objectName: 'Icône État', data: await icone(fa.FaBuildingColumns, H.accent4), x: xd + 0.18, y: 6.47, w: 0.3, h: 0.3, altText: 'Administration' });
    txt(s, 'Texte État', [{ text: "Pour l'État : ", options: { bold: true } }, { text: 'file de travail en 1 clic + tableau de bord des délais' }], { x: xd + 0.6, y: 6.35, w: 12.73 - xd - 0.7, h: 0.55, fontSize: 14, color: C.accent4, valign: 'middle' });
    s.addNotes("[≈ 40 s] SUIVO donne à chaque demande un numéro de suivi, comme un colis. L'usager voit l'étape en cours, le service qui détient son dossier et le délai restant. Il est prévenu à chaque étape, peut répondre à une pièce manquante et relancer si le délai est dépassé. Côté État, l'agent valide en un clic et le chef de service voit enfin les délais réels.");
  }

  // ============================================================ 5. Comment ça marche
  {
    const s = contenu(6, '2 · Son fonctionnement', 'Un seul déplacement, à la fin de la démarche');
    const etapes = [[ic.depot, 'Dépôt', 'En ligne ou au guichet → n° + QR'], [ic.routage, 'Routage', 'De service en service, chaque étape a son délai'], [ic.suivi, 'Suivi', 'Notification à chaque étape'], [ic.retrait, 'Clôture', 'Dossier finalisé : retrait ou paiement']];
    const w = 2.55, g = (CW - 1.3 - 4 * w) / 3, x0 = M + 1.3;
    const usager = ['Dépose sa demande', 'Reçoit un SMS par étape', 'Répond ou relance à distance', 'Se déplace une seule fois'];
    const admin = ['Enregistre ou scanne le QR', "Valide l'étape en 1 clic", 'Voit les retards et alertes', 'Remet le document ou verse le paiement'];
    etapes.forEach(([icn, t, d], i) => {
      const x = x0 + i * (w + g);
      carte(s, `Étape ${t}`, x, 1.7, w, 1.85);
      rond(s, `Icône ${t}`, x + 0.25, 1.92, 0.62, icn, i === 3 ? C.accent2 : C.accent1);
      txt(s, `Titre ${t}`, `${i + 1}. ${t}`, { x: x + 1.0, y: 1.98, w: w - 1.1, h: 0.5, fontSize: 19, bold: true, valign: 'middle' });
      txt(s, `Texte ${t}`, d, { x: x + 0.25, y: 2.7, w: w - 0.45, h: 0.75, fontSize: 14 });
      if (i < 3) s.addShape(pres.shapes.CHEVRON, { objectName: `Flèche ${i + 1}`, x: x + w + (g - 0.2) / 2, y: 2.45, w: 0.2, h: 0.36, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    });
    [['Usager', 3.82, C.background2], ['Administration', 4.52, C.accent6]].forEach(([l, y, f]) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Couloir ${l}`, x: M, y, w: CW, h: 0.6, rectRadius: 0.08, fill: { color: f, transparency: 40 }, line: { color: f } });
      txt(s, `Libellé couloir ${l}`, l, { x: M + 0.12, y, w: 1.2, h: 0.6, fontSize: 13, bold: true, color: C.accent4, valign: 'middle' });
    });
    // textes posés sur les couloirs
    etapes.forEach((_, i) => {
      const x = x0 + i * (w + g);
      txt(s, `Usager ${i + 1} (couloir)`, usager[i], { x, y: 3.82, w, h: 0.6, fontSize: 14, valign: 'middle' });
      txt(s, `Administration ${i + 1} (couloir)`, admin[i], { x, y: 4.52, w, h: 0.6, fontSize: 14, valign: 'middle' });
    });
    carte(s, 'Encadré sans smartphone', M, 5.45, 7.3, 1.3, C.background2);
    rond(s, 'Icône sans smartphone', M + 0.25, 5.77, 0.66, ic.sms, C.accent2);
    txt(s, 'Texte sans smartphone', [{ text: 'Sans smartphone ? ', options: { bold: true, color: C.accent4 } }, { text: 'reçu avec QR au guichet, notifications par SMS, statut par code USSD *XXX#.' }], { x: M + 1.15, y: 5.45, w: 6.0, h: 1.3, fontSize: 15, valign: 'middle' });
    txt(s, 'Avant', [{ text: 'Avant', options: { fontSize: 13, color: C.accent5, breakLine: true } }, { text: 'Plusieurs allers-retours' }], { x: 8.2, y: 5.45, w: 2.0, h: 1.3, fontSize: 18, bold: true, color: C.accent5, valign: 'middle' });
    s.addShape(pres.shapes.RIGHT_ARROW, { objectName: 'Flèche avant après', x: 10.2, y: 5.92, w: 0.6, h: 0.36, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    txt(s, 'Après', [{ text: 'Avec SUIVO', options: { fontSize: 13, color: C.accent2, breakLine: true } }, { text: 'Un seul déplacement' }], { x: 10.95, y: 5.45, w: 1.8, h: 1.3, fontSize: 18, bold: true, color: C.accent1, valign: 'middle' });
    s.addNotes("[≈ 40 s] Concrètement : on dépose en ligne ou au guichet et on reçoit un numéro. Le dossier passe de service en service, chacun avec son délai. L'usager est notifié à chaque étape, et l'agent n'a qu'un clic à faire. À la fin, un seul déplacement : pour retirer le document, ou aucun si c'est un paiement. Sans smartphone, le reçu QR, les SMS et l'USSD prennent le relais.");
  }

  // ============================================================ 6. Cas pratique — le parcours acteur par acteur
  {
    const s = contenu(7, '2 · Cas pratique', 'Le capital décès d\'Awa, du dépôt au retrait');
    const couloirs = [
      [ic.citoyen, C.accent2, 'Awa', 'représentante des orphelins'],
      [ic.depot, C.accent1, 'Guichet', 'Fonction publique'],
      [ic.chef, C.accent1, 'Liquidation', 'des droits'],
      [ic.argent, C.accent1, 'Trésor public', 'paiement'],
      [ic.sms, C.accent2, 'SUIVO', 'SMS et délais'],
    ];
    const phases = ['Dépôt', 'Contrôle', 'Complément', 'Liquidation', 'Retard', 'Paiement', 'Retrait'];
    const xL = M, wL = 1.85, x0 = M + wL + 0.1, cw = (13.333 - M - x0) / phases.length, y0 = 2.05, lh = 0.86;
    // En-tête des phases (flèche du temps)
    s.addShape(pres.shapes.RIGHT_ARROW, { objectName: 'Flèche du temps', x: x0, y: 1.6, w: 13.333 - M - x0, h: 0.36, fill: { color: C.background2 }, line: { color: C.background2 } });
    phases.forEach((ph, j) => txt(s, `Phase ${ph}`, ph, { x: x0 + j * cw, y: 1.6, w: cw, h: 0.36, fontSize: 12, bold: true, color: C.accent4, align: 'center', valign: 'middle' }));
    couloirs.forEach(([icn, col, nom, sous], i) => {
      const y = y0 + i * lh;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Couloir ${nom}`, x: xL, y, w: 13.333 - 2 * M, h: lh - 0.08, rectRadius: 0.06, fill: { color: i % 2 ? C.background1 : C.background2 }, line: { color: C.background2, width: 1 } });
      rond(s, `Icône ${nom}`, xL + 0.08, y + (lh - 0.08 - 0.46) / 2, 0.46, icn, col);
      txt(s, `Acteur ${nom}`, [{ text: nom, options: { bold: true, breakLine: true } }, { text: sous, options: { fontSize: 10, color: C.accent5 } }], { x: xL + 0.62, y, w: wL - 0.62, h: lh - 0.08, fontSize: 13, valign: 'middle' });
    });
    // Événements : [phase, couloir, texte] dans l'ordre chronologique
    const ev = [
      [0, 0, 'Dépose son dossier au guichet'], [0, 1, 'Enregistre, remet un reçu QR'], [0, 4, 'SMS : dossier enregistré'],
      [1, 1, 'Constate une pièce manquante'], [1, 4, 'SMS : action requise'],
      [2, 0, 'Envoie la pièce à distance'], [2, 1, 'Valide l\'étape 1 en 1 clic'],
      [3, 2, 'Calcule les droits des orphelins'], [3, 4, 'SMS : étape 2/3'],
      [4, 4, 'Délai dépassé : alerte au service'], [4, 0, 'Relance en 1 clic'], [4, 2, 'Valide l\'étape 2'],
      [5, 3, 'Met en paiement'], [5, 4, 'SMS : dossier finalisé'],
      [6, 0, 'Se présente au Trésor'], [6, 3, 'Remet le paiement, clôt le dossier'],
    ];
    ev.forEach(([j, i, t], k) => {
      const x = x0 + j * cw + 0.06, y = y0 + i * lh + 0.06, w = cw - 0.12, h = lh - 0.2;
      const suivo = i === 4;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Événement ${k + 1}`, x, y, w, h, rectRadius: 0.06, fill: { color: suivo ? 'FFF4EA' : C.background1 }, line: { color: suivo ? C.accent2 : C.accent1, width: 1.25 } });
      s.addShape(pres.shapes.OVAL, { objectName: `Numéro événement ${k + 1}`, x: x - 0.03, y: y - 0.03, w: 0.27, h: 0.27, fill: { color: suivo ? C.accent2 : C.accent1 }, line: { color: C.background1, width: 1 } });
      txt(s, `Numéro ${k + 1} texte`, String(k + 1), { x: x - 0.03, y: y - 0.03, w: 0.27, h: 0.27, fontSize: 9, bold: true, color: C.background1, align: 'center', valign: 'middle' });
      txt(s, `Texte événement ${k + 1}`, t, { x: x + 0.27, y, w: w - 0.32, h, fontSize: 10.5, valign: 'middle' });
    });
    txt(s, 'Bilan cas pratique', [{ text: 'Résultat : ', options: { bold: true, color: C.accent1 } }, { text: 'Awa ne se déplace que pour déposer et pour retirer ; chaque acteur sait à tout moment qui détient le dossier.' }], { x: M, y: 6.42, w: 13.333 - 2 * M, h: 0.4, fontSize: 14 });
    s.addNotes("[≈ 1 min] Prenons un cas concret : Awa a perdu son père, fonctionnaire, et demande le capital décès pour ses jeunes frères. Elle dépose son dossier au guichet de la Fonction publique, qui l'enregistre et lui remet un reçu avec un QR code ; elle reçoit un SMS. L'agent constate qu'il manque un extrait de naissance : Awa est prévenue et l'envoie à distance. Le dossier passe à la liquidation des droits. Le délai est dépassé : SUIVO alerte le service et Awa relance en un clic ; l'étape est validée. Le Trésor met en paiement, Awa reçoit le SMS « dossier finalisé » et se déplace une seule fois pour le retrait.");
  }

  // ============================================================ 7. Cas pratique — ce que reçoit Awa, ce que voit chaque acteur
  {
    const s = contenu(8, '2 · Cas pratique (maquettes)', 'Ce que reçoit Awa, ce que voit chaque acteur');
    // Téléphone avec les SMS reçus
    const px = M + 0.2, py = 1.6, pw = 3.55, ph = 5.2;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: 'Téléphone', x: px, y: py, w: pw, h: ph, rectRadius: 0.35, fill: { color: H.dk1 }, line: { color: H.dk1 }, shadow: ombre() });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: 'Écran du téléphone', x: px + 0.12, y: py + 0.12, w: pw - 0.24, h: ph - 0.24, rectRadius: 0.26, fill: { color: 'F1F5F9' }, line: { color: 'F1F5F9' } });
    s.addShape(pres.shapes.RECTANGLE, { objectName: 'Barre messages', x: px + 0.12, y: py + 0.3, w: pw - 0.24, h: 0.42, fill: { color: C.accent1 }, line: { color: C.accent1 } });
    txt(s, 'Titre messages', 'Messages · SUIVO', { x: px + 0.3, y: py + 0.3, w: pw - 0.5, h: 0.42, fontSize: 12, bold: true, color: C.background1, valign: 'middle' });
    const sms = [
      'Dossier SUI-2026-000001 enregistré. Suivez-le avec ce numéro.',
      'Action requise : merci de fournir les extraits d\'acte de naissance des orphelins.',
      'Étape 2/3 « Liquidation des droits » — Ministère de la Fonction Publique.',
      'Étape 3/3 « Mise en paiement » — Trésor public.',
      'Votre dossier est finalisé. Rendez-vous : service des paiements, Trésor public.',
    ];
    let yb = py + 0.85;
    sms.forEach((t, k) => {
      const h = 0.74, fin = k === sms.length - 1;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `SMS ${k + 1}`, x: px + 0.25, y: yb, w: pw - 0.6, h, rectRadius: 0.1, fill: { color: fin ? C.accent6 : C.background1 }, line: { color: k === 1 ? C.accent2 : 'E2E8F0', width: k === 1 ? 1.5 : 0.75 } });
      txt(s, `Texte SMS ${k + 1}`, t, { x: px + 0.35, y: yb, w: pw - 0.8, h, fontSize: 10, valign: 'middle' });
      yb += h + 0.1;
    });
    // Ce que voit chaque acteur
    const xr = px + pw + 0.55, wr = 13.333 - M - xr;
    const ecrans = [
      [ecranAgent, 'L\'agent de liquidation', 'Le dossier relancé remonte en tête de sa file, en rouge ; il le valide en 1 clic.'],
      [ecranPilotage, 'Le chef de service', 'Il voit les retards par service et le délai réel de chaque étape.'],
    ];
    const ew = (wr - 0.3) / 2, eh = ew / 1.6;
    ecrans.forEach(([f, t, d], k) => {
      const x = xr + k * (ew + 0.3);
      s.addShape(pres.shapes.RECTANGLE, { objectName: `Barre navigateur ${k + 1}`, x, y: 1.75, w: ew, h: 0.16, fill: { color: 'E2E8F0' }, line: { color: 'CBD5E1', width: 0.75 } });
      s.addImage({ objectName: `Écran ${t}`, path: f, x, y: 1.91, w: ew, h: eh, altText: `Maquette — ${t} : ${d}` });
      s.addShape(pres.shapes.RECTANGLE, { objectName: `Cadre écran ${k + 1}`, x, y: 1.75, w: ew, h: eh + 0.16, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: 'CBD5E1', width: 0.75 } });
      txt(s, `Titre ${t}`, t, { x, y: 2.05 + eh, w: ew, h: 0.35, fontSize: 14, bold: true, color: C.accent1 });
      txt(s, `Texte ${t}`, d, { x, y: 2.42 + eh, w: ew, h: 0.6, fontSize: 13 });
    });
    carte(s, 'Encadré traçabilité', xr, 5.45, wr, 1.3, C.background2);
    rond(s, 'Icône traçabilité', xr + 0.25, 5.78, 0.62, ic.etat, C.accent4);
    txt(s, 'Texte traçabilité', [{ text: 'Le ministère ', options: { bold: true, color: C.accent4 } }, { text: 'dispose de l\'historique complet du dossier : qui a fait quoi, quand, et si le délai a été respecté. Chaque action est enregistrée dans un journal qui ne peut pas être modifié.' }], { x: xr + 1.05, y: 5.45, w: wr - 1.25, h: 1.3, fontSize: 13, valign: 'middle' });
    s.addNotes("[≈ 40 s] Sur ces maquettes, voici ce que recevrait Awa : un SMS à chaque étape, sans jamais avoir à demander. De l'autre côté, l'agent de liquidation voit le dossier relancé remonter en tête de sa file ; il le valide en un clic. Le chef de service voit les retards de chaque service. Et le ministère dispose de l'historique complet et infalsifiable du dossier.");
  }

  // ============================================================ 9. Impact sur le citoyen et le service public
  {
    const s = contenu(9, '3 · Impact', "L'impact sur le citoyen et le service public");
    const lignes = [
      ['Pour le citoyen', C.accent2, [
        [ic.citoyen, 'Le citoyen', ['Sait où est son dossier, qui le traite et quand il sera prêt', 'Agit à distance : pièce manquante, relance', 'Ne se déplace plus « pour rien »']],
        [ic.sms, "L'usager sans smartphone", ['Dépôt assisté au guichet, reçu avec QR', 'Informé par SMS', 'Garde le même niveau d\'information']],
        [ic.famille, 'Les familles et les aidants', ['Un tuteur suit le dossier des orphelins', 'Un proche peut aider avec le seul numéro', 'Moins de dépendance aux intermédiaires']],
      ]],
      ['Pour le service public', C.accent1, [
        [ic.agent, "L'agent", ['Moins de questions « où en est mon dossier ? »', 'Mise à jour en 1 clic ou par scan du QR', 'Des guichets moins encombrés']],
        [ic.chef, 'Le chef de service', ['Voit les retards et les blocages', 'Est alerté avant la plainte', 'Valorise les progrès de son équipe']],
        [ic.etat, "L'État", ['Mesure les délais réels de ses services', 'Gagne en transparence et en redevabilité', 'Restaure la confiance dans le service public']],
      ]],
    ];
    const lw = 1.35, gw = 0.22, w = (CW - lw - 0.2 - 2 * gw) / 3, h = 2.3;
    lignes.forEach(([libelle, col, cartes], r) => {
      const y = 1.65 + r * (h + 0.25);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Bandeau ${libelle}`, x: M, y, w: lw, h, rectRadius: 0.1, fill: { color: col }, line: { color: col } });
      txt(s, `Libellé ${libelle}`, libelle, { x: M + 0.1, y, w: lw - 0.2, h, fontSize: 16, bold: true, color: C.background1, align: 'center', valign: 'middle' });
      cartes.forEach(([icn, nom, points], k) => {
        const x = M + lw + 0.2 + k * (w + gw);
        carte(s, `Carte ${nom}`, x, y, w, h);
        rond(s, `Icône ${nom}`, x + 0.22, y + 0.2, 0.55, icn, col);
        txt(s, `Acteur ${nom}`, nom, { x: x + 0.9, y: y + 0.2, w: w - 1.0, h: 0.55, fontSize: 16, bold: true, valign: 'middle' });
        txt(s, `Gains ${nom}`, points.map((t, j) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < points.length - 1 } })), { x: x + 0.22, y: y + 0.88, w: w - 0.4, h: h - 0.98, fontSize: 13, paraSpaceAfter: 5 });
      });
    });
    s.addNotes("[≈ 50 s] L'impact est double. Pour le citoyen : il sait où en est son dossier, il agit à distance, et il ne se déplace plus pour rien, même sans smartphone ; un tuteur ou un proche peut suivre le dossier à sa place. Pour le service public : l'agent reçoit moins de questions et met à jour en un clic, le chef de service voit les retards avant les plaintes, et l'État mesure enfin les délais réels de ses services, ce qui renforce la transparence et la confiance.");
  }

  // ============================================================ 10. Caractère innovant
  {
    const s = contenu(10, '4 · Caractère innovant', 'Le suivi de colis, appliqué au service public');
    s.addImage({ objectName: 'Illustration colis suivi (innovation)', path: img['colis-suivi'], x: M + 0.2, y: 1.75, w: 3.4, h: 2.95, altText: 'Colis suivi : le modèle du suivi de colis appliqué au dossier administratif' });
    txt(s, 'Idée clé innovation', 'Ce que chacun connaît pour un colis, appliqué pour la première fois au dossier administratif.', { x: M, y: 4.95, w: 3.8, h: 1.3, fontSize: 17, bold: true, color: C.accent1 });
    const items = [
      [ic.qr, 'Un numéro de suivi pour toute démarche', 'même déposée sur papier, grâce au reçu QR'],
      [ic.lien, 'Une couche qui relie les administrations', 'elle se branche sur leurs outils au lieu de les remplacer'],
      [ic.chrono, 'Un délai visible pour chaque étape', "suspendu quand c'est à l'usager d'agir"],
      [ic.mesure, 'La mesure des délais réels', "l'État pilote avec des données, plus avec des impressions"],
      [ic.cadenas, 'Un historique infalsifiable', 'chaque action est tracée : moins de place aux intermédiaires'],
      [ic.canaux, 'Tous les canaux, un seul suivi', 'application, SMS, WhatsApp, USSD et guichet'],
    ];
    items.forEach(([icn, t, d], k) => {
      const y = 1.65 + k * 0.8;
      rond(s, `Innovation ${k + 1}`, 4.75, y + 0.05, 0.55, icn, k % 2 ? C.accent2 : C.accent1);
      txt(s, `Texte innovation ${k + 1}`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { fontSize: 13, color: C.accent5 } }], { x: 5.5, y, w: 7.23, h: 0.68, fontSize: 16, valign: 'middle' });
    });
    s.addNotes("[≈ 45 s] Ce qui est innovant, c'est d'appliquer au dossier administratif ce que tout le monde connaît pour un colis. Concrètement : un numéro de suivi pour toute démarche, même déposée sur papier ; une couche qui relie les administrations sans remplacer leurs outils ; un délai visible pour chaque étape, suspendu quand c'est à l'usager d'agir ; la mesure des délais réels ; un historique infalsifiable ; et tous les canaux, de l'application au SMS, pour un seul suivi.");
  }

  // ============================================================ 11. Faisabilité technique et opérationnelle
  {
    const s = contenu(11, '5 · Faisabilité', 'Une faisabilité technique établie');
    const colonnes = [
      [ic.code, 'Faisabilité technique', [
        'Fonctions clés conçues et maquettées : dépôt, suivi, file des agents, tableau de bord',
        'Des technologies standard, ouvertes et éprouvées : React, Node.js, PostgreSQL',
        'Des briques qui existent déjà : envoi de SMS, codes USSD, hébergement local',
        'Sécurité intégrée à la conception : code SMS, droits par service, journal d\'audit',
      ]],
      [ic.engrenage, 'Faisabilité opérationnelle', [
        "Démarre sans attendre l'interconnexion : les agents utilisent SUIVO directement",
        'Intégration progressive aux systèmes existants : saisie, connecteur, puis API',
        'Prise en main simple : une action = un clic ; formation courte sur site',
        'Respect de la protection des données (ARTCI) ; hébergement local possible',
      ]],
    ];
    const w = (CW - 0.3) / 2;
    colonnes.forEach(([icn, titre, points], k) => {
      const x = M + k * (w + 0.3);
      carte(s, `Carte ${titre}`, x, 1.65, w, 2.95);
      rond(s, `Icône ${titre}`, x + 0.25, 1.85, 0.6, icn, k ? C.accent2 : C.accent1);
      txt(s, `Titre ${titre}`, titre, { x: x + 1.0, y: 1.85, w: w - 1.2, h: 0.6, fontSize: 19, bold: true, valign: 'middle' });
      points.forEach((t, j) => {
        const y = 2.5 + j * 0.52;
        s.addImage({ objectName: `Coche ${titre} ${j + 1}`, data: icPrincipe, x: x + 0.3, y: y + 0.07, w: 0.26, h: 0.26, altText: 'Point validé' });
        txt(s, `Point ${titre} ${j + 1}`, t, { x: x + 0.7, y, w: w - 0.95, h: 0.5, fontSize: 13, valign: 'top' });
      });
    });
    // Où en sommes-nous ? (la solution n'est pas encore prête pour un déploiement réel)
    txt(s, 'Titre état', 'Où en sommes-nous ?', { x: M, y: 4.78, w: 1.6, h: 0.72, fontSize: 15, bold: true, color: C.accent2, valign: 'middle' });
    const etat = [
      ['Fait', 'Analyse, parcours, conception et maquettes', C.accent1, C.background2],
      ['À réaliser', 'Développement de la solution : SMS, USSD, sécurité, hébergement', C.accent2, 'FFF4EA'],
      ['Ensuite', 'Pilote avec les administrations volontaires', C.accent5, C.background1],
    ];
    const ew = (CW - 1.7 - 2 * 0.35) / 3;
    etat.forEach(([t, d, col, fond], k) => {
      const x = M + 1.7 + k * (ew + 0.35);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `État ${t}`, x, y: 4.78, w: ew, h: 0.72, rectRadius: 0.1, fill: { color: fond }, line: { color: col, width: 1.5 } });
      txt(s, `Texte état ${t}`, [{ text: `${t} : `, options: { bold: true, color: col } }, { text: d }], { x: x + 0.15, y: 4.78, w: ew - 0.3, h: 0.72, fontSize: 12.5, valign: 'middle' });
      if (k < 2) s.addShape(pres.shapes.RIGHT_ARROW, { objectName: `Flèche état ${k + 1}`, x: x + ew + 0.05, y: 5.02, w: 0.25, h: 0.24, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    });
    // Architecture
    txt(s, 'Titre architecture', 'Architecture', { x: M, y: 5.75, w: 1.6, h: 0.8, fontSize: 15, bold: true, color: C.accent4, valign: 'middle' });
    const blocs = [['Application web et mobile', 'React + Tailwind (PWA)'], ['Serveur', 'Node.js + Express'], ['Base de données', 'PostgreSQL'], ['Notifications', 'SMS · WhatsApp · USSD']];
    const bw = 2.35, bx0 = M + 1.7, bg = (CW - 1.7 - 4 * bw) / 3;
    blocs.forEach(([t, d], k) => {
      const x = bx0 + k * (bw + bg);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: `Bloc ${t}`, x, y: 5.75, w: bw, h: 0.8, rectRadius: 0.1, fill: { color: k === 3 ? 'FFF4EA' : C.background1 }, line: { color: k === 3 ? C.accent2 : C.accent1, width: 1.5 } });
      txt(s, `Texte bloc ${t}`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { fontSize: 11, color: C.accent5 } }], { x: x + 0.1, y: 5.75, w: bw - 0.2, h: 0.8, fontSize: 13, align: 'center', valign: 'middle' });
      if (k < 3) s.addShape(pres.shapes.RIGHT_ARROW, { objectName: `Flèche architecture ${k + 1}`, x: x + bw + (bg - 0.3) / 2, y: 6.03, w: 0.3, h: 0.24, fill: { color: C.accent1 }, line: { color: C.accent1 } });
    });
    s.addNotes("[≈ 50 s] Soyons clairs : la solution n'est pas encore développée, et nous n'avons pas de prototype à faire tester aujourd'hui. En revanche, sa faisabilité technique est établie : les fonctions sont conçues et maquettées, elles reposent sur des technologies standard et éprouvées, et sur des briques qui existent déjà, comme l'envoi de SMS ou les codes USSD. Il reste à la développer, avec la sécurité et l'hébergement, avant le pilote. Sur le plan opérationnel, la solution démarrera sans attendre que les systèmes soient interconnectés : les agents l'utilisent directement, puis on se branche progressivement aux outils existants. Une action, c'est un clic ; la formation est courte ; et la protection des données est prise en compte dès le départ.");
  }

  // ============================================================ 12. Expérience utilisateur et inclusion
  {
    const s = contenu(12, '6 · Expérience utilisateur et inclusion', 'Simple pour chacun, accessible à tous');
    const hT = 4.85, wT = hT * telSuivi.ratio;
    txt(s, 'Légende maquette', 'Maquette de l\'application', { x: M, y: 6.55, w: wT, h: 0.3, fontSize: 10, italic: true, color: C.accent5, align: 'center' });
    s.addImage({ objectName: 'Capture suivi (expérience)', path: telSuivi.chemin, x: M, y: 1.65, w: wT, h: hT, altText: "Maquette — Écran de suivi d'un dossier : la réponse en un coup d'œil", shadow: ombre() });
    const xu = M + wT + 0.35, wu = 3.55;
    txt(s, 'Titre expérience', 'Une expérience simple', { x: xu, y: 1.65, w: wu, h: 0.45, fontSize: 19, bold: true, color: C.accent1 });
    [[ic.oeil, "La réponse en un coup d'œil", 'où est le dossier, qui le traite, quand il sera prêt'], [ic.texte, 'Un langage simple', 'des messages courts, sans jargon administratif'], [ic.clic, "Pour l'agent : une action, un clic", 'valider, demander une pièce, rejeter avec un motif']].forEach(([icn, t, d], k) => {
      const y = 2.3 + k * 1.3;
      rond(s, `Expérience ${k + 1}`, xu, y, 0.55, icn);
      txt(s, `Texte expérience ${k + 1}`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { fontSize: 13, color: C.accent5 } }], { x: xu + 0.7, y: y - 0.05, w: wu - 0.7, h: 1.1, fontSize: 15 });
    });
    const xi = xu + wu + 0.3, wi = 13.333 - M - xi;
    carte(s, 'Carte inclusion', xi, 1.65, wi, 5.05);
    txt(s, 'Titre inclusion', 'Une solution inclusive', { x: xi + 0.25, y: 1.75, w: wi - 0.4, h: 0.45, fontSize: 19, bold: true, color: C.accent2 });
    [[ic.sms, 'Sans smartphone', 'reçu QR au guichet, SMS ; code USSD prévu pour le pilote'], [ic.wifi, 'Avec une connexion faible', 'application légère, consultable hors connexion'], [ic.voix, 'Si l\'on lit peu le français', 'pictogrammes ; messages vocaux en langues locales prévus'], [ic.acces, 'En situation de handicap', 'contrastes élevés, grands boutons, lecteur d\'écran'], [ic.proche, 'Avec l\'aide d\'un proche', 'le dossier se suit avec le seul numéro, sans compte']].forEach(([icn, t, d], k) => {
      const y = 2.3 + k * 0.86;
      rond(s, `Inclusion ${k + 1}`, xi + 0.25, y, 0.52, icn, C.accent2);
      txt(s, `Texte inclusion ${k + 1}`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { fontSize: 12.5, color: C.accent5 } }], { x: xi + 0.92, y: y - 0.06, w: wi - 1.1, h: 0.8, fontSize: 15 });
    });
    s.addNotes("[≈ 45 s] L'expérience est pensée pour être simple : la réponse en un coup d'œil, un langage sans jargon, et pour l'agent, une action égale un clic. Elle est surtout inclusive : sans smartphone, on est servi au guichet et informé par SMS, avec un code USSD prévu pour le pilote ; avec une connexion faible, l'application reste légère ; pour ceux qui lisent peu le français, des pictogrammes et des messages vocaux en langues locales sont prévus ; et un proche peut suivre le dossier avec le seul numéro.");
  }

  // ============================================================ 13. Potentiel de déploiement
  {
    const s = contenu(13, '7 · Potentiel de déploiement', 'Commencer petit, déployer partout');
    const phases = [
      ['Pilote', 'Quelques démarches fréquentes (capital décès, foncier, état civil) avec des administrations volontaires ; mesure des gains sur le terrain.'],
      ['Extension', "Autres communes et ministères ; branchement des plateformes de dépôt existantes ; agents relais à l'intérieur du pays."],
      ['Généralisation', 'Toutes les démarches à plusieurs étapes ; ouverture aux pays de la sous-région.'],
    ];
    const w = (CW - 2 * 0.45) / 3;
    phases.forEach(([t, d], k) => {
      const x = M + k * (w + 0.45);
      carte(s, `Phase ${t}`, x, 1.65, w, 2.25);
      s.addShape(pres.shapes.OVAL, { objectName: `Numéro phase ${k + 1}`, x: x + 0.25, y: 1.85, w: 0.5, h: 0.5, fill: { color: k ? C.accent1 : C.accent2 }, line: { color: k ? C.accent1 : C.accent2 } });
      txt(s, `Numéro phase texte ${k + 1}`, String(k + 1), { x: x + 0.25, y: 1.85, w: 0.5, h: 0.5, fontSize: 15, bold: true, color: C.background1, align: 'center', valign: 'middle' });
      txt(s, `Titre phase ${t}`, t, { x: x + 0.9, y: 1.85, w: w - 1.0, h: 0.5, fontSize: 19, bold: true, valign: 'middle' });
      txt(s, `Texte phase ${t}`, d, { x: x + 0.25, y: 2.5, w: w - 0.45, h: 1.3, fontSize: 13.5 });
      if (k < 2) s.addShape(pres.shapes.CHEVRON, { objectName: `Flèche phase ${k + 1}`, x: x + w + 0.12, y: 2.6, w: 0.22, h: 0.38, fill: { color: C.accent2 }, line: { color: C.accent2 } });
    });
    txt(s, 'Titre reproductible', 'Pourquoi c\'est reproductible', { x: M, y: 4.2, w: CW, h: 0.45, fontSize: 18, bold: true, color: C.accent1 });
    [[ic.copie, 'Une démarche modélisée une fois sert partout', 'dans toutes les communes et tous les services qui la traitent'], [ic.globe, 'Pas de matériel spécifique', 'un navigateur ou un simple téléphone suffit'], [ic.reglage, 'Paramétrable sans développement', 'étapes, services et délais propres à chaque administration']].forEach(([icn, t, d], k) => {
      const x = M + k * (w + 0.45);
      rond(s, `Reproductible ${k + 1}`, x, 4.85, 0.6, icn);
      txt(s, `Texte reproductible ${k + 1}`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { fontSize: 13, color: C.accent5 } }], { x: x + 0.8, y: 4.75, w: w - 0.8, h: 1.4, fontSize: 15 });
    });
    s.addNotes("[≈ 40 s] Nous proposons de commencer petit : un pilote sur quelques démarches fréquentes, comme le capital décès, le foncier et l'état civil, avec des administrations volontaires, pour mesurer les gains sur le terrain. Puis une extension à d'autres communes et ministères, et enfin la généralisation. C'est reproductible : une démarche modélisée une fois sert partout, il n'y a pas de matériel spécifique, et tout se paramètre sans développement.");
  }

  // ============================================================ 7. Modèle économique
  {
    const s = contenu(14, '7 · Pérennisation', 'Un modèle durable : gratuit pour le citoyen');
    const boite = (nom, x, y, w, h, icn, t, d, fill = C.background2, col = C.text1) => {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { objectName: nom, x, y, w, h, rectRadius: 0.1, fill: { color: fill }, line: { color: fill } });
      rond(s, `${nom} icône`, x + 0.15, y + (h - 0.5) / 2, 0.5, icn, fill === C.accent1 ? C.accent4 : C.accent1);
      txt(s, `${nom} texte`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { fontSize: 12 } }], { x: x + 0.75, y, w: w - 0.85, h, fontSize: 15, color: col, valign: 'middle' });
    };
    boite('Citoyen', M, 3.3, 2.3, 1.0, ic.citoyen, 'Citoyen', 'suivi gratuit');
    boite('SUIVO', 3.55, 3.2, 1.9, 1.2, ic.suivi, 'SUIVO', 'plateforme', C.accent1, C.background1);
    const payeurs = [['Administrations', ic.etat, 'abonnement annuel à la plateforme'], ['Usagers volontaires', ic.premium, 'services optionnels : RDV, livraison'], ['Entreprises', ic.entreprise, 'vérification de statut par API']];
    payeurs.forEach(([t, icn, d], i) => {
      const y = 1.75 + i * 1.55;
      boite(t, 6.1, y, 2.75, 1.05, icn, t, d);
      ligne(s, `Valeur vers ${t}`, 5.45, 3.62, 6.1, y + 0.35, { color: C.accent1, width: 2, endArrowType: 'triangle' });
      ligne(s, `Paiement de ${t}`, 5.45, 3.98, 6.1, y + 0.72, { color: C.accent2, width: 2, dashType: 'dash', beginArrowType: 'triangle' });
    });
    s.addShape(pres.shapes.LINE, { objectName: 'Service vers citoyen', x: 2.9, y: 3.8, w: 0.65, h: 0, line: { color: C.accent1, width: 2, beginArrowType: 'triangle' } });
    txt(s, 'Légende flux', [{ text: '━ valeur   ', options: { color: C.accent1, bold: true } }, { text: '┅ paiement', options: { color: C.accent2, bold: true } }], { x: M, y: 6.2, w: 2.6, h: 0.35, fontSize: 13 });
    txt(s, 'Ancrage institutionnel', [{ text: 'Ancrage : ', options: { bold: true, color: C.accent4 } }, { text: 'sponsor ministériel, agents « champions » formés, données et code maîtrisés localement.' }], { x: 3.3, y: 6.1, w: 5.6, h: 0.6, fontSize: 12.5 });
    const principes = [
      ['Le suivi de base reste toujours gratuit', 'pour tous les usagers, sans condition.'],
      ["L'administration paie pour un outil", 'qui fait gagner du temps à ses agents et améliore son service.'],
      ['Les revenus complémentaires restent optionnels', 'et ne conditionnent jamais le suivi.'],
      ['Les tarifs seront construits avec les pilotes', 'à partir des gains réellement mesurés.'],
    ];
    txt(s, 'Titre principes', 'Nos principes', { x: 9.25, y: 1.7, w: 3.48, h: 0.45, fontSize: 18, bold: true, color: C.accent1 });
    principes.forEach(([t, d], i) => {
      const y = 2.3 + i * 1.08;
      s.addImage({ objectName: `Coche principe ${i + 1}`, data: icPrincipe, x: 9.25, y: y + 0.05, w: 0.3, h: 0.3, altText: 'Principe' });
      txt(s, `Principe ${i + 1}`, [{ text: t, options: { bold: true, breakLine: true } }, { text: d, options: { fontSize: 12, color: C.accent5 } }], { x: 9.7, y, w: 3.03, h: 1.0, fontSize: 14 });
    });
    s.addNotes("[≈ 40 s] Le citoyen ne paie jamais pour suivre son dossier. Ce sont les administrations qui s'abonnent à la plateforme, parce qu'elle fait gagner du temps à leurs agents. Des services optionnels et une interface pour les entreprises pourront compléter. Nous ne fixerons pas de prix à l'aveugle : les tarifs seront construits avec les administrations pilotes, à partir des gains mesurés.");
  }

  // ============================================================ 8. Clôture
  {
    const s = pres.addSlide({ masterName: 'SUIVO_GARDE' });
    motif(s, 15, true);
    txt(s, 'Surtitre demande', 'NOTRE DEMANDE', { x: 0.8, y: 1.0, w: 7, h: 0.4, fontSize: 14, bold: true, color: C.accent2, charSpacing: 2 });
    txt(s, 'Titre demande', 'Un pilote avec des administrations volontaires', { x: 0.8, y: 1.45, w: 11.7, h: 0.9, fontSize: 36, bold: true, color: C.background1 });
    const d = [['Un sponsor', 'au ministère de tutelle'], ['Des administrations pilotes', 'Fonction publique, foncier, état civil'], ['Un accompagnement', 'pour développer la solution et lancer le pilote']];
    d.forEach(([b, t], i) => {
      const y = 2.85 + i * 0.95;
      s.addShape(pres.shapes.OVAL, { objectName: `Demande ${i + 1}`, x: 0.8, y: y + 0.12, w: 0.55, h: 0.55, fill: { color: C.accent2 }, line: { color: C.accent2 } });
      txt(s, `Numéro demande ${i + 1}`, String(i + 1), { x: 0.8, y: y + 0.12, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: C.background1, align: 'center', valign: 'middle' });
      txt(s, `Texte demande ${i + 1}`, [{ text: `${b} `, options: { bold: true, color: C.background1 } }, { text: t, options: { color: C.accent6 } }], { x: 1.6, y, w: 6.6, h: 0.8, fontSize: 19, valign: 'middle' });
    });
    txt(s, 'Engagement titre', 'Notre engagement', { x: 8.7, y: 2.85, w: 3.9, h: 0.45, fontSize: 16, bold: true, color: C.accent2 });
    txt(s, 'Engagement texte', 'Mesurer avec vous, sur le terrain, les déplacements évités et les délais gagnés.', { x: 8.7, y: 3.35, w: 3.9, h: 1.6, fontSize: 22, bold: true, color: C.background1 });
    txt(s, 'Vision', "Pour qu'aucun Ivoirien n'ait plus à demander « où en est mon dossier ? »", { x: 0.8, y: 6.0, w: 11.7, h: 0.6, fontSize: 20, italic: true, color: C.background1 });
    s.addNotes("[≈ 30 s] Nous vous demandons un pilote : un sponsor, des administrations volontaires — Fonction publique, foncier, état civil — et un accompagnement pour le lancer. Nous ne venons pas avec des chiffres promis : nous venons avec une solution conçue de bout en bout, dont la faisabilité technique est établie, et l'engagement de mesurer avec vous, sur le terrain, les déplacements évités et les délais gagnés. Pour qu'aucun Ivoirien n'ait plus à demander « où en est mon dossier ? ». Merci.");
  }

  await pres.writeFile({ fileName: OUT });
  if (process.env.APPLY_THEME) await require(process.env.APPLY_THEME).applyTheme(OUT, THEME);
  console.log('OK', OUT);
})().catch((e) => { console.error(e); process.exit(1); });

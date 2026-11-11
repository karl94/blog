// Rend le dossier SUIVO en PDF (Chromium via Playwright), en deux passes :
// 1) rendu avec marqueurs invisibles -> repérage de la page de chaque section ;
// 2) rendu final avec les numéros de page dans le sommaire.
// Usage : NODE_PATH=<dossier contenant playwright et mermaid> node render.js
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ICI = __dirname;
const SORTIE = path.join(ICI, '..', 'SUIVO-dossier-JNSP-2026.pdf');
const MERMAID = require.resolve('mermaid/dist/mermaid.min.js');

const pied = `<div style="font-family:Inter,Arial;font-size:7.5pt;color:#64748B;width:100%;padding:0 18mm;display:flex;justify-content:space-between">
  <span>SUIVO · Dossier de candidature JNSP 2026</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;

async function pdf(browser, fichier) {
  const page = await browser.newPage();
  await page.goto('file://' + path.join(ICI, 'dossier.html'), { waitUntil: 'load' });
  await page.addScriptTag({ path: MERMAID });
  await page.evaluate(async () => {
    window.mermaid.initialize({
      startOnLoad: false, theme: 'base', securityLevel: 'loose',
      themeVariables: {
        fontFamily: 'Inter', fontSize: '14px', primaryColor: '#EEF6F1', primaryBorderColor: '#17603C',
        primaryTextColor: '#0F172A', lineColor: '#64748B', secondaryColor: '#FFF4EA', tertiaryColor: '#F8FAFC',
        clusterBkg: '#F8FAFC', clusterBorder: '#CBD5E1', noteBkgColor: '#FFF4EA', noteBorderColor: '#F28C28',
      },
      flowchart: { htmlLabels: true, useMaxWidth: true }, sequence: { useMaxWidth: true },
    });
    await window.mermaid.run({ querySelector: 'pre.mermaid' });
    await document.fonts.ready;
  });
  const erreurs = await page.$$eval('pre.mermaid', (els) => els.filter((e) => !e.querySelector('svg')).length);
  if (erreurs) throw new Error(`${erreurs} diagramme(s) Mermaid non rendu(s)`);
  await page.pdf({
    path: fichier, format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: pied,
    outline: true, tagged: true,
  });
  await page.close();
}

(async () => {
  const tmp = path.join(ICI, '.passe1.pdf');
  execFileSync('python3', [path.join(ICI, 'build.py')], { stdio: 'inherit' });
  const browser = await chromium.launch();
  await pdf(browser, tmp);
  // Repérage des pages : chaque section porte un marqueur invisible @@id@@
  const texte = execFileSync('pdftotext', ['-layout', tmp, '-'], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const pages = {};
  texte.split('\f').forEach((p, i) => {
    for (const m of p.matchAll(/@@([\w-]+)@@/g)) if (!pages[m[1]]) pages[m[1]] = i + 1;
  });
  const ids = JSON.parse(fs.readFileSync(path.join(ICI, 'toc.json'), 'utf8'));
  const manquants = ids.filter((i) => !pages[i]);
  if (manquants.length) console.warn('Sections non repérées :', manquants.join(', '));
  fs.writeFileSync(path.join(ICI, 'pages.json'), JSON.stringify(pages));
  execFileSync('python3', [path.join(ICI, 'build.py'), '--pages', path.join(ICI, 'pages.json'), '--sans-marqueurs'], { stdio: 'inherit' });
  await pdf(browser, SORTIE);
  await browser.close();
  fs.unlinkSync(tmp);
  console.log('PDF :', SORTIE);
})().catch((e) => { console.error(e); process.exit(1); });

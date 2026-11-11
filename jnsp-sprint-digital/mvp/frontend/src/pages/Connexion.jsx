import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth.jsx';

const COMPTES_DEMO = [
  ['0700000001', 'Usager — Awa Koné'],
  ['0700000010', 'Agent — État civil (mairie)'],
  ['0700000011', 'Agent — Cabinet du maire'],
  ['0700000020', 'Agent — Greffe (tribunal)'],
  ['0700000021', 'Agent — Service nationalité'],
  ['0700000022', 'Agent — Président du tribunal'],
  ['0700000099', 'Admin — Pilotage'],
];

export default function Connexion() {
  const [telephone, setTelephone] = useState('');
  const [nom, setNom] = useState('');
  const [code, setCode] = useState('');
  const [etape, setEtape] = useState(1);
  const [info, setInfo] = useState('');
  const [erreur, setErreur] = useState('');
  const { connexion } = useAuth();
  const nav = useNavigate();

  async function envoyer(e) {
    e?.preventDefault(); setErreur('');
    try {
      const r = await api('/auth/otp', { method: 'POST', body: { telephone } });
      setEtape(2);
      setInfo(r.code_demo ? `Mode démo — votre code : ${r.code_demo}` : 'Code envoyé par SMS.');
      if (r.code_demo) setCode(r.code_demo);
    } catch (err) { setErreur(err.message); }
  }
  async function verifier(e) {
    e.preventDefault(); setErreur('');
    try {
      const r = await api('/auth/verifier', { method: 'POST', body: { telephone, code, nom } });
      connexion(r.token, r.utilisateur);
      nav(r.utilisateur.role === 'usager' ? '/mes-dossiers' : '/agent');
    } catch (err) { setErreur(err.message); }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Connexion</h1>
      <p className="text-slate-600">Pas de mot de passe : un code à 6 chiffres vous est envoyé par SMS.</p>
      {etape === 1 ? (
        <form onSubmit={envoyer} className="carte space-y-3">
          <div>
            <label className="etiquette" htmlFor="tel">Numéro de téléphone</label>
            <input id="tel" className="champ" inputMode="tel" placeholder="07 00 00 00 01" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
          </div>
          <div>
            <label className="etiquette" htmlFor="nom">Nom et prénoms (première connexion)</label>
            <input id="nom" className="champ" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>
          <button className="btn-primaire w-full">Recevoir mon code</button>
        </form>
      ) : (
        <form onSubmit={verifier} className="carte space-y-3">
          {info && <p className="rounded-xl bg-orange-50 p-3 text-sm text-orange-700">{info}</p>}
          <label className="etiquette" htmlFor="code">Code reçu</label>
          <input id="code" className="champ text-center font-mono text-2xl tracking-[0.5em]" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} required />
          <button className="btn-primaire w-full">Se connecter</button>
          <button type="button" className="w-full text-sm text-slate-600 underline" onClick={() => setEtape(1)}>Changer de numéro</button>
        </form>
      )}
      {erreur && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{erreur}</p>}
      <details className="carte text-sm">
        <summary className="cursor-pointer font-semibold">Comptes de démonstration</summary>
        <ul className="mt-2 space-y-1">
          {COMPTES_DEMO.map(([t, l]) => (
            <li key={t}>
              <button type="button" className="text-vert-700 underline" onClick={() => { setTelephone(t); setEtape(1); }}>{t}</button> — {l}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

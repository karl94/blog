import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import Timeline, { Resume } from '../components/Timeline.jsx';

export default function Suivi() {
  const { numero } = useParams();
  const [saisie, setSaisie] = useState(numero || '');
  const [d, setD] = useState(null);
  const [erreur, setErreur] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    if (!numero) return;
    setErreur(''); setD(null);
    api(`/suivi/${encodeURIComponent(numero)}`).then(setD).catch((e) => setErreur(e.message));
  }, [numero]);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Suivre un dossier</h1>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); nav(`/suivi/${saisie.trim().toUpperCase()}`); }}>
        <label htmlFor="n" className="sr-only">Numéro de dossier</label>
        <input id="n" className="champ" placeholder="SUI-2026-000001" value={saisie} onChange={(e) => setSaisie(e.target.value)} />
        <button className="btn-primaire">Suivre</button>
      </form>
      {erreur && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{erreur}</p>}
      {d && (
        <>
          <Resume d={d} />
          <Timeline d={d} />
          <p className="text-xs text-slate-500">Suivi public : le nom du demandeur est masqué ({d.usager}). Connectez-vous pour répondre ou relancer.</p>
        </>
      )}
    </div>
  );
}

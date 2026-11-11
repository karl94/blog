import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth.jsx';

export default function NouvelleDemande() {
  const { token } = useAuth();
  const [procedures, setProcedures] = useState([]);
  const [choix, setChoix] = useState(null);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const nav = useNavigate();
  useEffect(() => { api('/procedures').then(setProcedures); }, []);
  const p = procedures.find((x) => x.id === choix);

  async function deposer() {
    setEnvoi(true); setErreur('');
    try {
      const r = await api('/demandes', { method: 'POST', token, body: { procedure_id: choix } });
      nav(`/dossier/${r.numero}?nouveau=1`);
    } catch (e) { setErreur(e.message); setEnvoi(false); }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Nouvelle demande</h1>
      <fieldset className="space-y-2">
        <legend className="etiquette">Quelle démarche ?</legend>
        {procedures.map((x) => (
          <label key={x.id} className={`carte flex cursor-pointer items-start gap-3 ${choix === x.id ? 'border-vert-600 ring-4 ring-vert-100' : ''}`}>
            <input type="radio" name="proc" className="mt-1 h-5 w-5 accent-vert-700" checked={choix === x.id} onChange={() => setChoix(x.id)} />
            <span>
              <span className="block font-semibold">{x.nom}</span>
              <span className="text-sm text-slate-600">{x.etapes.length} étapes · {x.delai_total_jours} jours ouvrés prévus</span>
            </span>
          </label>
        ))}
      </fieldset>
      {p && (
        <div className="carte space-y-3">
          <p className="text-sm text-slate-700">{p.description}</p>
          <div>
            <h2 className="font-semibold">Pièces à préparer</h2>
            <ul className="mt-1 list-inside list-disc text-sm text-slate-700">{p.pieces.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div>
            <h2 className="font-semibold">Parcours de votre dossier</h2>
            <ol className="mt-1 list-inside list-decimal text-sm text-slate-700">
              {p.etapes.map((e) => <li key={e.ordre}>{e.nom} — {e.service} ({e.sla_jours} j)</li>)}
            </ol>
          </div>
          <button className="btn-primaire w-full" onClick={deposer} disabled={envoi}>{envoi ? 'Envoi…' : 'Déposer ma demande'}</button>
        </div>
      )}
      {erreur && <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">{erreur}</p>}
    </div>
  );
}

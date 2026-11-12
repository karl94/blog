import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, dateFr, delaiRestant } from '../api';
import { useAuth } from '../auth.jsx';
import { BadgeNiveau, BadgeStatut } from '../components/Timeline.jsx';

export default function AgentFile() {
  const { token, user } = useAuth();
  const [file, setFile] = useState(null);
  const [filtre, setFiltre] = useState('tous');
  const [scan, setScan] = useState('');
  const nav = useNavigate();
  useEffect(() => { api('/agent/file', { token }).then(setFile); }, [token]);

  const compte = (f) => file?.filter(f).length ?? 0;
  const filtres = {
    tous: () => true,
    rouge: (d) => d.niveau === 'rouge',
    attente: (d) => d.statut === 'ATTENTE_USAGER',
    pret: (d) => d.statut === 'PRET',
  };
  const liste = file?.filter(filtres[filtre]) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{user?.nom} · {user?.service || 'Tous les services'}</p>
          <h1 className="text-2xl font-bold">File de travail</h1>
        </div>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (scan.trim()) nav(`/dossier/${scan.trim().toUpperCase()}`); }}>
          <label htmlFor="scan" className="sr-only">Numéro ou QR du dossier</label>
          <input id="scan" className="champ py-2" placeholder="Scanner / saisir un n°" value={scan} onChange={(e) => setScan(e.target.value)} />
          <button className="btn-secondaire py-2">Ouvrir</button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist">
        {[
          ['tous', 'À traiter', compte(filtres.tous), 'text-slate-900'],
          ['rouge', 'En retard', compte(filtres.rouge), 'text-red-700'],
          ['attente', 'Attente usager', compte(filtres.attente), 'text-orange-700'],
          ['pret', 'Finalisés à remettre', compte(filtres.pret), 'text-vert-700'],
        ].map(([k, l, n, c]) => (
          <button key={k} role="tab" aria-selected={filtre === k} onClick={() => setFiltre(k)}
            className={`carte text-left ${filtre === k ? 'border-vert-600 ring-4 ring-vert-100' : ''}`}>
            <span className={`block text-2xl font-bold ${c}`}>{n}</span>
            <span className="text-sm text-slate-600">{l}</span>
          </button>
        ))}
      </div>

      {!file && <p>Chargement…</p>}
      {file && liste.length === 0 && <p className="carte text-slate-600">Rien à traiter ici. 👏</p>}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <ul className="divide-y divide-slate-100">
          {liste.map((d) => (
            <li key={d.numero}>
              <button className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-left hover:bg-slate-50" onClick={() => nav(`/dossier/${d.numero}`)}>
                <span className="w-36 font-mono text-sm">{d.numero}</span>
                <span className="min-w-[10rem] flex-1">
                  <span className="block font-medium">{d.procedure}</span>
                  <span className="text-sm text-slate-500">{d.usager} · {d.canal === 'guichet' ? 'guichet' : 'en ligne'} · déposé le {dateFr(d.cree_le)}</span>
                </span>
                <span className="text-sm text-slate-600">Étape {d.etape_ordre}/{d.nb_etapes} — {d.etape}</span>
                <span className="flex items-center gap-2">
                  {d.niveau ? <BadgeNiveau niveau={d.niveau} /> : <BadgeStatut statut={d.statut} />}
                  {d.niveau && <span className="text-xs text-slate-500">{delaiRestant(d.etape_echeance)}</span>}
                  {d.derniere_relance && d.niveau === 'rouge' && <span className="text-xs font-semibold text-red-700">relancé</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

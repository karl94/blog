import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth.jsx';

function Kpi({ valeur, libelle, note, ton = 'text-slate-900' }) {
  return (
    <div className="carte">
      <p className={`text-3xl font-extrabold ${ton}`}>{valeur}</p>
      <p className="font-medium text-slate-700">{libelle}</p>
      {note && <p className="text-xs text-slate-500">{note}</p>}
    </div>
  );
}

export default function Pilotage() {
  const { token } = useAuth();
  const [s, setS] = useState(null);
  useEffect(() => { api('/stats', { token }).then(setS); }, [token]);
  if (!s) return <p>Chargement…</p>;
  const actifs = (s.par_statut.SOUMIS || 0) + (s.par_statut.EN_COURS || 0);

  function exporter() {
    const lignes = [['Service', 'Organisme', 'En cours', 'En retard', 'Attente usager'],
      ...s.services.map((x) => [x.nom, x.organisme, x.en_cours, x.en_retard, x.attente_usager])];
    const csv = lignes.map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv' }));
    a.download = 'suivo-pilotage.csv'; a.click();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-2xl font-bold">Tableau de bord de pilotage</h1>
        <button className="btn-secondaire py-2 text-sm" onClick={exporter}>Exporter CSV</button>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi valeur={s.deplacements_evites} libelle="Déplacements évités" note="North Star (estimation : 1 notification = 1 passage « pour info » évité)" ton="text-vert-700" />
        <Kpi valeur={s.total} libelle="Dossiers suivis" note={`${actifs} en traitement`} />
        <Kpi valeur={s.en_retard} libelle="Dossiers en retard" note="SLA de l'étape dépassé" ton="text-red-700" />
        <Kpi valeur={s.taux_respect_sla == null ? '—' : `${s.taux_respect_sla} %`} libelle="Étapes dans les délais" ton="text-orange-700" />
      </div>

      <section className="carte overflow-x-auto">
        <h2 className="mb-3 font-semibold">Goulots d'étranglement par service</h2>
        <table className="w-full min-w-[32rem] text-sm">
          <thead className="text-left text-slate-500">
            <tr><th className="py-2">Service</th><th>En cours</th><th>En retard</th><th className="w-1/3">Part en retard</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {s.services.map((x) => {
              const pct = x.en_cours ? Math.round((100 * x.en_retard) / x.en_cours) : 0;
              return (
                <tr key={x.id}>
                  <td className="py-2"><span className="font-medium">{x.nom}</span><br /><span className="text-xs text-slate-500">{x.organisme}</span></td>
                  <td>{x.en_cours}</td>
                  <td className={x.en_retard ? 'font-semibold text-red-700' : ''}>{x.en_retard}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${pct > 40 ? 'bg-red-600' : pct > 15 ? 'bg-orange-500' : 'bg-vert-600'}`} style={{ width: `${pct}%` }} /></div>
                      <span className="w-10 text-right text-xs">{pct} %</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="carte overflow-x-auto">
        <h2 className="mb-3 font-semibold">Délai réel vs délai prévu (médiane, jours)</h2>
        <table className="w-full min-w-[32rem] text-sm">
          <thead className="text-left text-slate-500"><tr><th className="py-2">Procédure / étape</th><th>Prévu</th><th>Réel</th><th>Écart</th><th>n</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {s.delais_par_etape.map((x) => {
              const ecart = x.mediane_jours - x.sla_jours;
              return (
                <tr key={`${x.procedure}-${x.ordre}`}>
                  <td className="py-2"><span className="font-medium">{x.etape}</span><br /><span className="text-xs text-slate-500">{x.procedure}</span></td>
                  <td>{x.sla_jours}</td>
                  <td>{x.mediane_jours}</td>
                  <td className={ecart > 0 ? 'font-semibold text-red-700' : 'text-vert-700'}>{ecart > 0 ? '+' : ''}{ecart.toFixed(1)}</td>
                  <td className="text-slate-500">{x.n}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

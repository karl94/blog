// Client HTTP minimal vers l'API SUIVO
export async function api(chemin, { method = 'GET', body, token } = {}) {
  const res = await fetch(`/api${chemin}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erreur || `Erreur ${res.status}`);
  return data;
}

export const STATUTS = {
  SOUMIS: { libelle: 'Déposé', classe: 'bg-slate-100 text-slate-700' },
  EN_COURS: { libelle: 'En traitement', classe: 'bg-vert-50 text-vert-700' },
  ATTENTE_USAGER: { libelle: 'Action requise', classe: 'bg-orange-100 text-orange-700' },
  PRET: { libelle: 'Finalisé', classe: 'bg-vert-700 text-white' },
  RETIRE: { libelle: 'Clôturé', classe: 'bg-slate-200 text-slate-600' },
  REJETE: { libelle: 'Rejeté', classe: 'bg-red-100 text-red-700' },
};

export const NIVEAUX = {
  vert: { libelle: 'Dans les délais', classe: 'bg-vert-50 text-vert-700', point: 'bg-vert-600' },
  orange: { libelle: 'Échéance proche', classe: 'bg-orange-50 text-orange-700', point: 'bg-orange-500' },
  rouge: { libelle: 'En retard', classe: 'bg-red-50 text-red-700', point: 'bg-red-600' },
};

export const dateFr = (d, heure = false) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', ...(heure ? { hour: '2-digit', minute: '2-digit' } : {}) }) : '—';

export function delaiRestant(echeance) {
  if (!echeance) return null;
  const ms = new Date(echeance) - Date.now();
  const j = Math.round(Math.abs(ms) / 86400000);
  const h = Math.round(Math.abs(ms) / 3600000);
  const txt = j >= 1 ? `${j} jour${j > 1 ? 's' : ''}` : `${h} h`;
  return ms >= 0 ? `reste ${txt}` : `retard de ${txt}`;
}

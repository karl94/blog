// Calcul des échéances en jours ouvrés (lundi → vendredi).
const DAY = 24 * 60 * 60 * 1000;

function ajouterJoursOuvres(date, jours) {
  const d = new Date(date.getTime());
  let restants = jours;
  while (restants > 0) {
    d.setTime(d.getTime() + DAY);
    const j = d.getDay();
    if (j !== 0 && j !== 6) restants -= 1;
  }
  return d;
}

// Niveau d'urgence affiché à l'agent et à l'usager
function niveau(debut, echeance, maintenant = new Date()) {
  const total = echeance - debut;
  const restant = echeance - maintenant;
  if (restant < 0) return 'rouge';
  if (total > 0 && restant / total < 0.2) return 'orange';
  return 'vert';
}

module.exports = { ajouterJoursOuvres, niveau, DAY };

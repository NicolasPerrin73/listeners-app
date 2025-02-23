// URL pour la requête
const URL = "http://stream.omyradio.net:8000/status-json.xsl";

// Fonction pour récupérer le nombre d'auditeurs
async function getListeners() {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data && data.icestats && Array.isArray(data.icestats.source)) {
      // Calculer le total des auditeurs
      const totalListeners = data.icestats.source.reduce((total, stream) => {
        return total + (stream.listeners || 0);
      }, 0);
      return totalListeners;
    } else {
      return "Données incorrectes";
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return "Erreur";
  }
}

// Mettre à jour l'interface avec le nombre d'auditeurs
async function updateListeners() {
  const listeners = await getListeners();
  document.getElementById("listeners").textContent = `${listeners} listeners`;
}

// Mettre à jour toutes les 10 secondes
setInterval(updateListeners, 10000);
updateListeners(); // Appel initial

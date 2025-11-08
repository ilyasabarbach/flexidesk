import React, { useState, useEffect } from "react";
import ressourceService from "../services/ressourceService";
import reservationService from "../services/reservationService";
import CreateReservationForm from "../components/CreateReservationForm"; // 1. IMPORTER LE FORMULAIRE

const DashboardPage = () => {
  const [ressources, setRessources] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. NOUVEL ÉTAT : pour savoir quel formulaire afficher
  const [selectedRessourceId, setSelectedRessourceId] = useState(null);

  // Fonction pour charger TOUTES les données (on va la réutiliser)
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const resRessources = await ressourceService.getAllRessources();
      setRessources(resRessources.data);

      const resReservations = await reservationService.getMyReservations();
      setMyReservations(resReservations.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      setError(
        "Impossible de charger les données. Votre session a peut-être expiré."
      );
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. useEffect : appelle loadData() au chargement
  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  // 4. NOUVELLE FONCTION : est appelée par le formulaire enfant quand la résa est finie
  const handleReservationSuccess = () => {
    setSelectedRessourceId(null); // Ferme le formulaire
    loadData(); // RAFRAÎCHIT TOUTES LES DONNÉES (y compris la liste "Mes Réservations")
  };

  // --- Affichage (Render) ---

  if (loading && !ressources.length) {
    // Ne s'affiche que la première fois
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return (
      <div style={{ color: "red" }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Tableau de Bord</h2>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Se déconnecter
      </button>

      <hr />

      {/* Section 1: Mes Réservations */}
      <div>
        <h3>Mes Réservations</h3>
        {loading && <p>Rafraîchissement...</p>}
        {myReservations.length === 0 && !loading ? (
          <p>Vous n'avez aucune réservation.</p>
        ) : (
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {myReservations.map((resa) => (
              <li
                key={resa.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <strong>Ressource ID: {resa.ressourceId}</strong>
                <br />
                Du: {new Date(resa.dateDebut).toLocaleString("fr-FR")} <br />
                Au: {new Date(resa.dateFin).toLocaleString("fr-FR")}
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr />

      {/* Section 2: Ressources Disponibles */}
      <div>
        <h3>Ressources Disponibles</h3>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          {/* ... (le <thead> reste le même) ... */}
          <thead style={{ backgroundColor: "#f4f4f4" }}>
            <tr>
              <th style={{ padding: "8px" }}>ID</th>
              <th style={{ padding: "8px" }}>Nom</th>
              <th style={{ padding: "8px" }}>Type</th>
              <th style={{ padding: "8px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {ressources.map((res) => (
              // On utilise React.Fragment (<>) pour mettre 2 éléments dans un <tbody>
              <React.Fragment key={res.id}>
                <tr>
                  <td style={{ padding: "8px" }}>{res.id}</td>
                  <td style={{ padding: "8px" }}>{res.nom}</td>
                  <td style={{ padding: "8px" }}>{res.type}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>
                    {/* 5. MODIFICATION DU BOUTON */}
                    <button onClick={() => setSelectedRessourceId(res.id)}>
                      Réserver
                    </button>
                  </td>
                </tr>

                {/* 6. AFFICHAGE CONDITIONNEL DU FORMULAIRE */}
                {selectedRessourceId === res.id && (
                  <tr>
                    <td colSpan="4">
                      <CreateReservationForm
                        ressourceId={res.id}
                        onReservationSuccess={handleReservationSuccess}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;

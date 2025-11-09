import React, { useState, useEffect } from "react";
import ressourceService from "../services/ressourceService";
import reservationService from "../services/reservationService";
import authService from "../services/authService";
import CreateRessourceForm from "../components/CreateRessourceForm";
import CreateReservationForm from "../components/CreateReservationForm";

// Import d'une icône simple pour le chargement (optionnel mais propre)
const LoadingSpinner = () => (
  <div className="flex justify-center p-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
  </div>
);

const DashboardPage = () => {
  const [ressources, setRessources] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRessourceId, setSelectedRessourceId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

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
        // Si le token est invalide, la navbar (via un rechargement) gérera la déconnexion
        localStorage.removeItem("userToken");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    loadData();
  }, []);

  // PAS BESOIN DE handleLogout() ICI

  const handleReservationSuccess = () => {
    setSelectedRessourceId(null);
    loadData();
  };

  const handleRessourceCreated = () => {
    loadData();
  };

  if (loading && !ressources.length) {
    return <LoadingSpinner />;
  }

  return (
    // Conteneur principal du Dashboard
    <div>
      {" "}
      {/* Le conteneur parent est maintenant dans App.jsx */}
      {/* En-tête simple du Dashboard */}
      <h1 className="pb-4 mb-6 text-3xl font-bold text-gray-900 border-b border-gray-200">
        Tableau de Bord
      </h1>
      {/* Affichage du panneau Admin (si admin) */}
      {currentUser && currentUser.role === "ROLE_ADMIN" && (
        <CreateRessourceForm onRessourceCreated={handleRessourceCreated} />
      )}
      {/* Grille principale (Mes Réservations / Ressources) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Colonne 1: Mes Réservations */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            Mes Réservations
          </h2>
          {error && (
            <div className="p-3 mt-4 text-red-800 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          {loading && <p className="mt-4 text-gray-500">Rafraîchissement...</p>}

          <div className="mt-4 space-y-4">
            {myReservations.length === 0 && !loading ? (
              <p className="text-gray-500">Vous n'avez aucune réservation.</p>
            ) : (
              myReservations.map((resa) => (
                <div
                  key={resa.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <p className="font-bold text-gray-800">
                    Ressource ID: {resa.ressourceId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Du: {new Date(resa.dateDebut).toLocaleString("fr-FR")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Au: {new Date(resa.dateFin).toLocaleString("fr-FR")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Colonne 2: Ressources Disponibles */}
        <div className="lg:col-span-2">
          {/* (Cette section est identique à avant, pas de changement) */}
          <h2 className="text-2xl font-semibold text-gray-800">
            Ressources Disponibles
          </h2>
          <div className="mt-4 overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ressources.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Aucune ressource disponible.
                    </td>
                  </tr>
                ) : (
                  ressources.map((res) => (
                    <React.Fragment key={res.id}>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {res.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {res.nom}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {res.type}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                          <button
                            onClick={() =>
                              setSelectedRessourceId(
                                selectedRessourceId === res.id ? null : res.id
                              )
                            }
                            className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            {selectedRessourceId === res.id
                              ? "Annuler"
                              : "Réserver"}
                          </button>
                        </td>
                      </tr>
                      {selectedRessourceId === res.id && (
                        <tr>
                          <td colSpan="4" className="p-0">
                            <CreateReservationForm
                              ressourceId={res.id}
                              onReservationSuccess={handleReservationSuccess}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

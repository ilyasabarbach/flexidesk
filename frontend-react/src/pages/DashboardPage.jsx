import React, { useState, useEffect } from "react";
import ressourceService from "../services/ressourceService";
import reservationService from "../services/reservationService";
import authService from "../services/authService";
import CreateRessourceForm from "../components/CreateRessourceForm";
import CreateReservationForm from "../components/CreateReservationForm";

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

  // --- NOUVEAU : État pour savoir quelle ressource on modifie ---
  const [editingRessource, setEditingRessource] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const resRessources = await ressourceService.getAllRessources();
      setRessources(resRessources.data);
      const resReservations = await reservationService.getMyReservations();
      setMyReservations(resReservations.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les données.");
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
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

  // Callback succès Réservation
  const handleReservationSuccess = () => {
    setSelectedRessourceId(null);
    loadData();
  };

  // Callback succès Création OU Modification
  const handleRessourceSaved = () => {
    setEditingRessource(null); // On sort du mode édition
    loadData(); // On rafraîchit
  };

  const handleCancelReservation = async (id) => {
    if (window.confirm("Annuler cette réservation ?")) {
      try {
        await reservationService.cancelReservation(id);
        loadData();
      } catch (err) {
        alert("Erreur annulation");
      }
    }
  };

  const handleDeleteRessource = async (id) => {
    if (window.confirm("Supprimer cette ressource ?")) {
      try {
        await ressourceService.deleteRessource(id);
        loadData();
      } catch (err) {
        alert("Erreur suppression (peut-être utilisée ?)");
      }
    }
  };

  // --- NOUVEAU : Clic sur Modifier ---
  const handleEditClick = (ressource) => {
    setEditingRessource(ressource);
    // On remonte en haut de page pour voir le formulaire
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && !ressources.length) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="pb-4 mb-6 text-3xl font-bold text-gray-900 border-b border-gray-200">
        Tableau de Bord
      </h1>

      {/* Panneau Admin : Création / Modification */}
      {currentUser && currentUser.role === "ROLE_ADMIN" && (
        <CreateRessourceForm
          onRessourceCreated={handleRessourceSaved}
          editingRessource={editingRessource} // On passe la ressource à modifier
          onCancelEdit={() => setEditingRessource(null)} // Bouton Annuler
        />
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Colonne 1: Mes Réservations */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            Mes Réservations
          </h2>
          {/* ... (Code identique à avant pour la liste des réservations) ... */}
          <div className="mt-4 space-y-4">
            {myReservations.map((resa) => (
              <div
                key={resa.id}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <p className="font-bold">Ressource #{resa.ressourceId}</p>
                <p className="text-sm">
                  Du : {new Date(resa.dateDebut).toLocaleString()}
                </p>
                <p className="text-sm">
                  Au : {new Date(resa.dateFin).toLocaleString()}
                </p>
                <button
                  onClick={() => handleCancelReservation(resa.id)}
                  className="mt-2 text-xs text-red-600 underline"
                >
                  Annuler
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne 2: Ressources Disponibles */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Ressources Disponibles
          </h2>
          <div className="mt-4 overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs text-left text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-xs text-left text-gray-500 uppercase">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-xs text-left text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-xs text-center text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ressources.map((res) => (
                  <React.Fragment key={res.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {res.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {res.nom}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {res.type}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-center space-x-2 whitespace-nowrap">
                        {/* Bouton Réserver */}
                        <button
                          onClick={() =>
                            setSelectedRessourceId(
                              selectedRessourceId === res.id ? null : res.id
                            )
                          }
                          className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          {selectedRessourceId === res.id
                            ? "Fermer"
                            : "Réserver"}
                        </button>

                        {/* Boutons Admin */}
                        {currentUser && currentUser.role === "ROLE_ADMIN" && (
                          <>
                            {/* NOUVEAU : Bouton Modifier */}
                            <button
                              onClick={() => handleEditClick(res)}
                              className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                            >
                              Modifier
                            </button>

                            {/* Bouton Supprimer */}
                            <button
                              onClick={() => handleDeleteRessource(res.id)}
                              className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                            >
                              Supprimer
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                    {selectedRessourceId === res.id && (
                      <tr>
                        <td colSpan="4" className="p-0 bg-gray-50">
                          <div className="p-4">
                            <CreateReservationForm
                              ressourceId={res.id}
                              onReservationSuccess={handleReservationSuccess}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

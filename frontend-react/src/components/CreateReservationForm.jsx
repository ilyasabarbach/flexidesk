import React, { useState } from "react";
import reservationService from "../services/reservationService";

const CreateReservationForm = ({ ressourceId, onReservationSuccess }) => {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [error, setError] = useState("");

  // Fonction pour formater la date pour l'input datetime-local
  const getDefaultDateTime = () => {
    const now = new Date();
    // Ajuste pour le fuseau horaire local
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // Formatte en YYYY-MM-DDTHH:MM
    return now.toISOString().slice(0, 16);
  };

  // Initialise dateDebut avec la date/heure actuelle
  useState(() => {
    setDateDebut(getDefaultDateTime());
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!dateDebut || !dateFin) {
      setError("Veuillez remplir les deux dates.");
      return;
    }

    // Conversion des chaînes en objets Date (ou en format ISO)
    const startDate = new Date(dateDebut).toISOString();
    const endDate = new Date(dateFin).toISOString();

    if (new Date(endDate) <= new Date(startDate)) {
      setError("La date de fin doit être après la date de début.");
      return;
    }

    try {
      await reservationService.createReservation(
        ressourceId,
        startDate,
        endDate
      );

      alert("Réservation créée avec succès !");
      onReservationSuccess(); // Notifie le parent pour rafraîchir
    } catch (err) {
      console.error("Erreur de réservation:", err);
      // Gère l'erreur de conflit
      if (
        err.response &&
        err.response.data &&
        err.response.data.message &&
        err.response.data.message.includes("Conflit")
      ) {
        setError("Conflit de réservation. Ce créneau est déjà pris.");
      } else {
        setError("Une erreur est survenue.");
      }
    }
  };

  return (
    // Formulaire stylisé : fond bleu clair, padding
    <form
      onSubmit={handleSubmit}
      className="p-4 my-2 bg-blue-50 border border-blue-200 rounded-md"
    >
      <h4 className="text-lg font-semibold text-blue-800">
        Réserver la ressource {ressourceId}
      </h4>

      {/* Alerte d'erreur */}
      {error && (
        <div className="p-2 mt-2 text-sm text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Grille pour les champs de date */}
      <div className="grid grid-cols-1 gap-4 mt-3 sm:grid-cols-2">
        {/* Champ Date de Début */}
        <div>
          <label
            htmlFor={`start-${ressourceId}`}
            className="block text-sm font-medium text-gray-700"
          >
            Début
          </label>
          <input
            type="datetime-local"
            id={`start-${ressourceId}`}
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Champ Date de Fin */}
        <div>
          <label
            htmlFor={`end-${ressourceId}`}
            className="block text-sm font-medium text-gray-700"
          >
            Fin
          </label>
          <input
            type="datetime-local"
            id={`end-${ressourceId}`}
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bouton de soumission */}
      <div className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Confirmer
        </button>
      </div>
    </form>
  );
};

export default CreateReservationForm;

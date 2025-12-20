import React, { useState, useEffect } from "react";
import reservationService from "../services/reservationService";

const CreateReservationForm = ({ ressourceId, onReservationSuccess }) => {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [error, setError] = useState("");

  // Fonction pour obtenir la date locale au format YYYY-MM-DDTHH:MM
  const getDefaultDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; // offset en millisecondes
    const localISOTime = new Date(now - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  // Initialisation de la date de début au montage du composant
  useEffect(() => {
    setDateDebut(getDefaultDateTime());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!dateDebut || !dateFin) {
      setError("Veuillez remplir les deux dates.");
      return;
    }

    // --- CORRECTION : On envoie les chaînes brutes sans conversion ISO "Z" ---
    // Le format datetime-local (YYYY-MM-DDTHH:mm) est exactement ce que LocalDateTime attend.
    const startDate = dateDebut.length === 16 ? `${dateDebut}:00` : dateDebut;
    const endDate = dateFin.length === 16 ? `${dateFin}:00` : dateFin;

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
      onReservationSuccess();
      setDateFin(""); // Reset de la date de fin
    } catch (err) {
      console.error("Erreur de réservation:", err);

      // Gestion propre des messages d'erreur du backend
      if (err.response && err.response.data) {
        const msg = err.response.data.message || "";
        if (msg.includes("Conflit") || msg.includes("pris")) {
          setError("Conflit : Ce créneau est déjà réservé.");
        } else if (msg.includes("n'existe pas")) {
          setError("Erreur : La ressource est introuvable.");
        } else {
          setError(msg || "Une erreur est survenue côté serveur.");
        }
      } else {
        setError("Impossible de contacter le service de réservation.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 my-2 bg-blue-50 border border-blue-200 rounded-md shadow-sm"
    >
      <h4 className="text-lg font-semibold text-blue-800">
        Réserver la ressource #{ressourceId}
      </h4>

      {error && (
        <div className="p-2 mt-2 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mt-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Début
          </label>
          <input
            type="datetime-local"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fin</label>
          <input
            type="datetime-local"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Confirmer la réservation
        </button>
      </div>
    </form>
  );
};

export default CreateReservationForm;

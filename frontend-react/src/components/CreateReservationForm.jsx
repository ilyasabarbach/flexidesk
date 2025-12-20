import React, { useState, useEffect } from "react";
import reservationService from "../services/reservationService";

const CreateReservationForm = ({ ressourceId, onReservationSuccess }) => {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [error, setError] = useState("");

  // --- NOUVEAU : État pour bloquer le bouton (anti double-clic) ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction pour obtenir la date locale au format YYYY-MM-DDTHH:MM
  const getDefaultDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    setDateDebut(getDefaultDateTime());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- SÉCURITÉ : On arrête si déjà en cours ---
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!dateDebut || !dateFin) {
      setError("Veuillez remplir les deux dates.");
      setIsSubmitting(false);
      return;
    }

    const startDate = dateDebut.length === 16 ? `${dateDebut}:00` : dateDebut;
    const endDate = dateFin.length === 16 ? `${dateFin}:00` : dateFin;

    if (new Date(endDate) <= new Date(startDate)) {
      setError("La date de fin doit être après la date de début.");
      setIsSubmitting(false);
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
      setDateFin("");
    } catch (err) {
      console.error("Erreur de réservation:", err);

      // --- CORRECTION : Gestion optimisée des messages d'erreur ---
      if (err.response && err.response.data) {
        const serverMessage = err.response.data.message || "";

        // Si c'est un conflit (409), on affiche le message précis du serveur
        if (err.response.status === 409) {
          setError(serverMessage || "Conflit : Ce créneau est déjà réservé.");
        } else if (serverMessage.includes("n'existe pas")) {
          setError("Erreur : La ressource est introuvable.");
        } else {
          setError(serverMessage || "Une erreur est survenue côté serveur.");
        }
      } else {
        setError("Impossible de contacter le service de réservation.");
      }
    } finally {
      // --- IMPORTANT : On déverrouille le bouton quoi qu'il arrive ---
      setIsSubmitting(false);
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
            disabled={isSubmitting} // Désactivé pendant l'envoi
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fin</label>
          <input
            type="datetime-local"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            disabled={isSubmitting} // Désactivé pendant l'envoi
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          disabled={isSubmitting} // Bouton grisé + curseur interdit
          className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Traitement..." : "Confirmer la réservation"}
        </button>
      </div>
    </form>
  );
};

export default CreateReservationForm;

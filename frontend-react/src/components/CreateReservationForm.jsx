import React, { useState } from "react";
import reservationService from "../services/reservationService";

/**
 * Un formulaire pour créer une réservation.
 * Il prend deux "props" (paramètres) :
 * - ressourceId: L'ID de la ressource qu'on veut réserver.
 * - onReservationSuccess: Une fonction à appeler quand la réservation réussit,
 * pour que le Dashboard puisse se rafraîchir.
 */
const CreateReservationForm = ({ ressourceId, onReservationSuccess }) => {
  // On utilise des chaînes de caractères pour les inputs 'datetime-local'
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Vérification simple
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
      // On appelle notre service API (le token est géré automatiquement)
      await reservationService.createReservation(
        ressourceId,
        startDate,
        endDate
      );

      // Succès !
      alert("Réservation créée avec succès !"); // simple alerte pour l'utilisateur
      onReservationSuccess(); // On notifie le parent (Dashboard) de rafraîchir
    } catch (err) {
      console.error("Erreur de réservation:", err);
      // L'erreur de conflit de réservation vient du backend
      if (err.response && err.response.status === 500) {
        setError("Conflit de réservation. Ce créneau est déjà pris.");
      } else {
        setError("Une erreur est survenue.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ margin: "15px", padding: "10px", border: "1px solid blue" }}
    >
      <h4>Réserver la ressource {ressourceId}</h4>
      <div>
        <label>Début: </label>
        <input
          type="datetime-local" // L'input HTML5 pour les dates et heures
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
        />
      </div>
      <div style={{ marginTop: "5px" }}>
        <label>Fin: </label>
        <input
          type="datetime-local"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
        />
      </div>

      <button type="submit" style={{ marginTop: "10px" }}>
        Confirmer la réservation
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateReservationForm;

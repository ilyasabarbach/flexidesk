import React, { useState, useEffect } from "react";
import ressourceService from "../services/ressourceService";

// On ajoute deux nouvelles props : editingRessource (l'objet à modifier) et onCancelEdit
const CreateRessourceForm = ({
  onRessourceCreated,
  editingRessource,
  onCancelEdit,
}) => {
  const [nom, setNom] = useState("");
  const [type, setType] = useState("BUREAU");
  const [capacite, setCapacite] = useState(1);
  const [error, setError] = useState("");

  // EFFET : Quand on clique sur "Modifier" dans la liste, on remplit le formulaire
  useEffect(() => {
    if (editingRessource) {
      setNom(editingRessource.nom);
      setType(editingRessource.type);
      setCapacite(editingRessource.capacite);
    } else {
      // Si on n'est plus en édition, on vide
      setNom("");
      setType("BUREAU");
      setCapacite(1);
    }
  }, [editingRessource]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const ressourceData = {
      nom,
      type,
      capacite,
      disponibilite: true, // Par défaut
    };

    try {
      if (editingRessource) {
        // --- MODE MODIFICATION ---
        await ressourceService.updateRessource(
          editingRessource.id,
          ressourceData
        );
        alert("Ressource modifiée avec succès !");
      } else {
        // --- MODE CRÉATION ---
        await ressourceService.createRessource(ressourceData);
        alert("Ressource créée avec succès !");
      }

      // On prévient le parent pour rafraîchir la liste et quitter le mode édition
      onRessourceCreated();

      // Reset du formulaire
      setNom("");
      setType("BUREAU");
      setCapacite(1);
    } catch (err) {
      console.error("Détails de l'erreur :", err);
      setError("Erreur lors de l'opération. Vérifiez vos droits.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 my-4 border-2 rounded-lg shadow-sm transition-colors ${
        editingRessource
          ? "bg-yellow-50 border-yellow-200" // Couleur Jaune pour Modification
          : "bg-green-50 border-green-200" // Couleur Verte pour Création
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-xl font-semibold ${
            editingRessource ? "text-yellow-800" : "text-green-800"
          }`}
        >
          {editingRessource
            ? `Modifier : ${editingRessource.nom}`
            : "Panneau Admin : Créer une Ressource"}
        </h3>

        {/* Bouton Annuler (visible seulement en édition) */}
        {editingRessource && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Annuler la modification
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 mt-3 text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
        {/* Champ Nom */}
        <div>
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-gray-700"
          >
            Nom de la ressource
          </label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Champ Type */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="BUREAU">Bureau</option>
            <option value="SALLE_REUNION">Salle de réunion</option>
            <option value="PARKING">Parking</option>
          </select>
        </div>

        {/* Champ Capacité */}
        <div>
          <label
            htmlFor="capacite"
            className="block text-sm font-medium text-gray-700"
          >
            Capacité
          </label>
          <input
            type="number"
            id="capacite"
            value={capacite}
            onChange={(e) => setCapacite(parseInt(e.target.value))}
            min="1"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 text-right space-x-3">
        <button
          type="submit"
          className={`px-6 py-2 font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            editingRessource
              ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
              : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
          }`}
        >
          {editingRessource
            ? "Enregistrer les modifications"
            : "Créer la ressource"}
        </button>
      </div>
    </form>
  );
};

export default CreateRessourceForm;

import React, { useState } from "react";
import ressourceService from "../services/ressourceService";

const CreateRessourceForm = ({ onRessourceCreated }) => {
  const [nom, setNom] = useState("");
  const [type, setType] = useState("BUREAU");
  const [capacite, setCapacite] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await ressourceService.createRessource(nom, type, capacite);
      alert("Ressource créée !");
      onRessourceCreated();
      setNom("");
      setType("BUREAU");
      setCapacite(1);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création. Avez-vous les droits (Admin) ?");
    }
  };

  return (
    // Formulaire stylisé : fond vert clair, bordure, ombre
    <form
      onSubmit={handleSubmit}
      className="p-6 my-4 bg-green-50 border-2 border-green-200 rounded-lg shadow-sm"
    >
      <h3 className="text-xl font-semibold text-green-800">
        Panneau Admin : Créer une Ressource
      </h3>

      {/* Alerte d'erreur */}
      {error && (
        <div className="p-3 mt-3 text-red-800 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Grille pour les champs du formulaire */}
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
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bouton de soumission */}
      <div className="mt-6 text-right">
        <button
          type="submit"
          className="px-6 py-2 font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Créer
        </button>
      </div>
    </form>
  );
};

export default CreateRessourceForm;

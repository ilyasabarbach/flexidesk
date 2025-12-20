import React, { useState } from "react";
import authService from "../services/authService";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // NOUVEAU : État pour basculer entre Connexion et Inscription
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Fonction de validation simple
  const validateForm = () => {
    if (!username.trim() || !password.trim()) {
      setMessage("Veuillez remplir tous les champs.");
      setIsError(true);
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setMessage("");
    setIsError(false);

    try {
      const response = await authService.login(username, password);
      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        window.location.href = "/"; // Redirection vers le Dashboard
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur : Identifiants incorrects.");
      setIsError(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setMessage("");
    setIsError(false);

    try {
      await authService.register(username, password);
      // SUCCÈS : On repasse en mode connexion et on affiche un message vert
      setIsRegisterMode(false);
      setMessage("Compte créé avec succès ! Connectez-vous maintenant.");
      setIsError(false);
      // On vide le mot de passe pour sécurité, mais on garde le username
      setPassword("");
    } catch (error) {
      console.error(error);
      setMessage("Erreur : Ce nom d'utilisateur est déjà pris.");
      setIsError(true);
    }
  };

  // Fonction pour basculer de mode et nettoyer les messages
  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setMessage("");
    setIsError(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          FlexiDesk {isRegisterMode ? "Inscription" : "Connexion"}
        </h2>

        {/* Zone de Message (Erreur ou Succès) */}
        {message && (
          <div
            className={`p-3 rounded-md text-center text-sm ${
              isError
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={isRegisterMode ? handleRegister : handleLogin}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez votre identifiant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
            />
          </div>

          {/* Bouton Principal (Change selon le mode) */}
          <button
            type="submit" // Type submit active la validation standard si besoin
            className={`w-full px-4 py-2 font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isRegisterMode
                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {isRegisterMode ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>

        {/* Lien de bascule */}
        <div className="text-center">
          <button
            onClick={toggleMode}
            className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
          >
            {isRegisterMode
              ? "Déjà un compte ? Se connecter"
              : "Pas encore de compte ? S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

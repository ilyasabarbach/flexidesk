import React, { useState } from "react";
import authService from "../services/authService";

const LoginPage = () => {
  // Note: Nous avons retiré useNavigate, car window.location.href est plus fiable ici
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const response = await authService.login(username, password);
      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        window.location.href = "/"; // Redirection
      }
    } catch (error) {
      setMessage("Erreur: Nom d'utilisateur ou mot de passe incorrect.");
      setIsError(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      await authService.register(username, password);
      setMessage(
        "Inscription réussie ! Vous pouvez maintenant vous connecter."
      );
    } catch (error) {
      setMessage("Erreur: Cet utilisateur existe peut-être déjà.");
      setIsError(true);
    }
  };

  return (
    // Conteneur principal: centré, fond gris clair
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* La boîte de formulaire */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          FlexiDesk Connexion
        </h2>

        {/* Affichage des messages d'erreur ou de succès */}
        {message && (
          <div
            className={`p-3 rounded-md text-center ${
              isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Formulaire */}
        <form className="space-y-4">
          {/* Champ Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Champ Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Conteneur pour les boutons */}
          <div className="flex space-x-4">
            {/* Bouton Se connecter */}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Se connecter
            </button>

            {/* Bouton S'inscrire */}
            <button
              type="button"
              onClick={handleRegister}
              className="w-full px-4 py-2 font-medium text-blue-700 bg-blue-100 rounded-md shadow-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

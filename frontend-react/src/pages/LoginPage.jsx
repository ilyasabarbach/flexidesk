import React, { useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

/**
 * Page de connexion ET d'inscription
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Pour afficher les messages

  // Fonction pour le LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await authService.login(username, password);

      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        // On force le rechargement de la page pour que ProtectedRoute lise le nouveau localStorage
        window.location.href = "/";
      }
    } catch (error) {
      setMessage("Erreur Login: Nom d'utilisateur ou mot de passe incorrect.");
      console.error("Erreur de login:", error);
    }
  };

  // NOUVELLE FONCTION pour le REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // On appelle la fonction 'register' de notre service
      const response = await authService.register(username, password);
      setMessage(
        "Inscription réussie ! Vous pouvez maintenant vous connecter."
      );
      console.log(response.data); // Affiche le message de succès du backend
    } catch (error) {
      // Gère les erreurs (ex: utilisateur existe déjà)
      setMessage("Erreur Inscription: Cet utilisateur existe peut-être déjà.");
      console.error("Erreur d'inscription:", error);
    }
  };

  // Le HTML (JSX) mis à jour
  return (
    <div>
      <h2>Connexion / Inscription</h2>
      <form>
        <div>
          <label>Nom d'utilisateur: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* NOUVEAUX BOUTONS */}
        <div style={{ marginTop: "10px" }}>
          <button type="button" onClick={handleLogin}>
            Se connecter
          </button>

          <button
            type="button"
            onClick={handleRegister}
            style={{ marginLeft: "10px" }}
          >
            S'inscrire
          </button>
        </div>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;

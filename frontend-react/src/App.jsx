import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  Link, // Importez Link pour le logo
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import authService from "./services/authService"; // Nous avons besoin de ce service ici

/**
 * Composant de Route Protégée (inchangé)
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

/**
 * Composant App principal (maintenant un "Layout")
 */
function App() {
  // Nouvel état pour savoir qui est connecté
  const [currentUser, setCurrentUser] = useState(null);

  // Au chargement de l'application, on vérifie qui est connecté
  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  // Logique de déconnexion, maintenant gérée ici
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    // Redirection complète pour vider tout état
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      {/* Conteneur principal de la page avec fond gris */}
      <div className="min-h-screen bg-gray-100">
        {/* NOUVELLE BARRE DE NAVIGATION */}
        <nav className="bg-white shadow-md">
          <div className="container p-4 mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              {/* Côté Gauche : Logo/Titre */}
              <Link
                to="/"
                className="text-2xl font-bold text-blue-600 hover:text-blue-700"
              >
                FlexiDesk
              </Link>

              {/* Côté Droit : Infos Utilisateur & Déconnexion */}
              <div>
                {/* On n'affiche ceci que si un utilisateur est connecté */}
                {currentUser && (
                  <div className="flex items-center gap-4">
                    <span className="hidden text-gray-700 sm:block">
                      Bonjour,{" "}
                      <strong className="font-medium">
                        {currentUser.username}
                      </strong>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-md shadow-sm hover:bg-red-200"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        {/* FIN DE LA NAVBAR */}

        {/* Contenu principal de la page */}
        <main>
          <div className="container p-4 mx-auto max-w-7xl">
            {" "}
            {/* Conteneur pour centrer le contenu */}
            <Routes>
              {/* /login utilise maintenant le layout complet, mais c'est ok */}
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

import React from "react";

const DashboardPage = () => {
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  return (
    <div>
      <h2>Tableau de Bord (Connecté)</h2>
      <p>Bienvenue sur votre espace. Vous êtes authentifié.</p>

      <button onClick={handleLogout}>Se déconnecter</button>

      <hr />
    </div>
  );
};

export default DashboardPage;

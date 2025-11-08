import apiClient from "./api";

const getMyReservations = () => {
  return apiClient.get("/reservations/my-reservations");
};

const createReservation = (ressourceId, dateDebut, dateFin) => {
  return apiClient.post("/reservations", {
    ressourceId,
    dateDebut,
    dateFin,
  });
};

export default {
  createReservation,
  getMyReservations,
};

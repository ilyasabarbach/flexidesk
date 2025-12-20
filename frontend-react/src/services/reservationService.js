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
const cancelReservation = (id) => {
  return apiClient.delete(`/reservations/${id}`);
};

export default {
  createReservation,
  getMyReservations,
  cancelReservation,
};

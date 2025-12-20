import apiClient from "./api";

const getAllRessources = () => {
  return apiClient.get("/ressources");
};

const createRessource = (ressourceData) => {
  return apiClient.post("/ressources", ressourceData);
};
const deleteRessource = (id) => {
  return apiClient.delete(`/ressources/${id}`);
};

const updateRessource = (id, data) => {
  return apiClient.put(`/ressources/${id}`, data);
};

export default {
  getAllRessources,
  createRessource,
  deleteRessource,
  updateRessource,
};

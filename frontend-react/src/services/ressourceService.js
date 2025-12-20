import apiClient from "./api";

const getAllRessources = () => {
  return apiClient.get("/ressources");
};

const createRessource = (ressourceData) => {
  return apiClient.post("/ressources", ressourceData);
};

export default {
  getAllRessources,
  createRessource,
};

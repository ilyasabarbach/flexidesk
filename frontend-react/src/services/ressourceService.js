import apiClient from "./api";

const getAllRessources = () => {
  return apiClient.get("/ressources");
};

export default {
  getAllRessources,
};

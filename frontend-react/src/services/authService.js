import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth";

const login = (username, password) => {
  return axios.post(`${API_URL}/login`, {
    username,
    password,
  });
};

const register = (username, password) => {
  return axios.post(`${API_URL}/register`, {
    username,
    password,
  });
};

export default {
  login,
  register,
};

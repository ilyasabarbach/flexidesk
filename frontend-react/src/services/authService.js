import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

const getCurrentUser = () => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return {
      username: decodedToken.sub,
      role: decodedToken.role,
      userId: decodedToken.userId,
    };
  } catch (error) {
    console.error("Token invalide ou expiré:", error);
    localStorage.removeItem("userToken");
    return null;
  }
};

export default {
  login,
  register,
  getCurrentUser,
};

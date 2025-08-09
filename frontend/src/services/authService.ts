import api from "../utils/api";
import { RegisterRequest, LoginRequest } from "../types";

export const authService = {
  register: async (data: RegisterRequest) => {
    const response = await api.post("/users/register", data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await api.post("/users/login", data);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("/users/logout");
    } finally {
      localStorage.removeItem("token");
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

import axios from "axios";

const TODO_API_BASE_URL = "http://localhost:3001/api";

// Create axios instance for todo service
const todoApi = axios.create({
  baseURL: TODO_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
todoApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const todoService = {
  getTodos: async () => {
    const response = await todoApi.get("/todos");
    return response.data;
  },

  createTodo: async (content: string) => {
    const response = await todoApi.post("/todos", { content });
    return response.data;
  },

  updateTodo: async (id: number, content: string) => {
    const response = await todoApi.put(`/todos/${id}`, { content });
    return response.data;
  },

  markComplete: async (id: number) => {
    const response = await todoApi.put(`/markComplete/${id}`);
    return response.data;
  },

  markUncomplete: async (id: number) => {
    const response = await todoApi.put(`/markUncomplete/${id}`);
    return response.data;
  },

  deleteTodo: async (id: number) => {
    const response = await todoApi.delete(`/todos/${id}`);
    return response.data;
  },
};

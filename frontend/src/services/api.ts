import axios from "axios";
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../types/index.js";

const USER_SERVICE_URL =
  import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:3000";
const TODO_SERVICE_URL =
  import.meta.env.VITE_TODO_SERVICE_URL || "http://localhost:3001";

// Create axios instances
const userApi = axios.create({
  baseURL: USER_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const todoApi = axios.create({
  baseURL: TODO_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to todo requests
todoApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Service APIs
export const authApi = {
  register: async (data: RegisterRequest): Promise<void> => {
    await userApi.post("/auth/register", data);
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await userApi.post("/auth/login", data);
    return response.data;
  },
};

// Todo Service APIs
export const todosApi = {
  getTodos: async (): Promise<Todo[]> => {
    const response = await todoApi.get("/todos");
    return response.data;
  },

  createTodo: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await todoApi.post("/todos", data);
    return response.data;
  },

  updateTodo: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await todoApi.put(`/todos/${id}`, data);
    return response.data;
  },

  deleteTodo: async (id: string): Promise<void> => {
    await todoApi.delete(`/todos/${id}`);
  },

  markComplete: async (id: string): Promise<Todo> => {
    const response = await todoApi.patch(`/todos/${id}/complete`);
    return response.data;
  },

  markIncomplete: async (id: string): Promise<Todo> => {
    const response = await todoApi.patch(`/todos/${id}/incomplete`);
    return response.data;
  },
};

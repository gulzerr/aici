export interface User {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  is_complete: boolean;
  user_uuid: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  is_complete?: boolean;
}

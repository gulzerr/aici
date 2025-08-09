import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { todoService } from "../services/todoService";
import { authService } from "../services/authService";

interface Todo {
  id: number;
  uuid: string;
  content: string;
  user_uuid: string;
  is_completed: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingTodo, setAddingTodo] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    const loadTodos = async () => {
      try {
        const response = await todoService.getTodos();
        setTodos(response.body?.data || []);
      } catch (err: unknown) {
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to fetch todos");
        }
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [navigate]);

  const fetchTodos = async () => {
    try {
      const response = await todoService.getTodos();
      setTodos(response.body?.data || []);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to fetch todos");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setAddingTodo(true);
    try {
      await todoService.createTodo(newTodo);
      setNewTodo("");
      await fetchTodos();
    } catch {
      setError("Failed to add todo");
    } finally {
      setAddingTodo(false);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      if (todo.is_completed) {
        // Todo is currently completed, so mark it as uncomplete
        await todoService.markUncomplete(todo.id);
      } else {
        // Todo is currently incomplete, so mark it as complete
        await todoService.markComplete(todo.id);
      }
      // Refresh the todo list to reflect changes
      await fetchTodos();
    } catch (err) {
      console.error("Failed to toggle todo completion:", err);
      const action = todo.is_completed ? "uncomplete" : "complete";
      setError(`Failed to ${action} todo`);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      await fetchTodos();
    } catch {
      setError("Failed to delete todo");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch {
      // Even if logout fails on server, remove token locally
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Add Todo Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <form onSubmit={handleAddTodo} className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={addingTodo || !newTodo.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              {addingTodo ? "Adding..." : "Add Todo"}
            </button>
          </form>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-lg shadow-sm border">
          {todos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p>No todos yet. Add one above to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Complete/Incomplete Button */}
                    <button
                      onClick={() => handleToggleComplete(todo)}
                      title={
                        todo.is_completed
                          ? "Mark as incomplete"
                          : "Mark as complete"
                      }
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        todo.is_completed
                          ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                          : "border-gray-300 hover:border-green-500 hover:bg-green-50"
                      }`}
                    >
                      {todo.is_completed && <CheckIcon className="h-4 w-4" />}
                    </button>

                    {/* Todo Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          todo.is_completed
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {todo.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(todo.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: {todos.length}</span>
              <span>
                Completed: {todos.filter((t) => t.is_completed).length}
              </span>
              <span>
                Pending: {todos.filter((t) => !t.is_completed).length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todos;

import { useState } from "react";
import { LocaleSwitcher } from "@lingo.dev/compiler/react";
import { CheckCircle2, Circle, Trash2, Plus, Globe } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Learn Lingo.dev", completed: false },
    { id: 2, text: "Build multilingual app", completed: false },
    { id: 3, text: "Deploy to production", completed: false },
  ]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>My Todo List</h1>
          <div className="header-right">
            <LocaleSwitcher
              locales={[
                { code: "en", label: "English" },
                { code: "es", label: "Español" },
                { code: "fr", label: "Français" },
                { code: "de", label: "Deutsch" },
                { code: "ja", label: "日本語" },
              ]}
              className="locale-switcher"
            />
            <div className="badge">
              <Globe size={16} />
              <span>Powered by Lingo.dev</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="input-section">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
              className="input"
            />
            <button onClick={addTodo} className="add-btn">
              <Plus size={20} />
              Add Task
            </button>
          </div>

          <div className="stats">
            <span>Total: {todos.length} tasks</span>
            <span>Completed: {completedCount}</span>
            <span>Remaining: {todos.length - completedCount}</span>
          </div>

          <div className="todo-list">
            {todos.length === 0 ? (
              <div className="empty">
                <p>No tasks yet. Add one to get started!</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`todo-item ${todo.completed ? "completed" : ""}`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="checkbox-btn"
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={24} className="checked" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>
                  <span className="todo-text">{todo.text}</span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-btn"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="footer">
            <p>
              This app is fully multilingual! Switch languages to see everything
              translate automatically.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

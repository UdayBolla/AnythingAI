import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "https://anythingai-4.onrender.com";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // 🔁 Fetch tasks
  const getTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (token) getTasks();
  }, [token, getTasks]);

  // 🔐 Register
  const register = async () => {
    try {
      await axios.post(`${API}/auth/register`, { email, password });
      alert("Registered successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  // 🔐 Login
  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      alert("Login success");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // ➕ Add task
  const addTask = async () => {
    try {
      await axios.post(
        `${API}/tasks`,
        { title: task },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTask("");
      getTasks();
    } catch (err) {
      alert("Add task failed");
    }
  };

  // ❌ Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getTasks();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
  };

  return (
    <div style={{ padding: 30 }}>
      {!token ? (
        <>
          <h3>Auth</h3>
          <input
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </>
      ) : (
        <>
          <h3>Tasks</h3>
          <input
            placeholder="task title"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
          <button onClick={logout} style={{ marginLeft: 10 }}>
            Logout
          </button>

          <ul>
            {tasks.map((t) => (
              <li key={t._id}>
                {t.title}
                <button
                  onClick={() => deleteTask(t._id)}
                  style={{ marginLeft: 10 }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;

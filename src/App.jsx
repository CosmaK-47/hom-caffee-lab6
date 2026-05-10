import { useState, useEffect } from "react";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("menu");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const openDashboard = async () => {
    const pin = prompt("Enter admin PIN:");

    try {
      const response = await fetch("http://localhost:5000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: pin,
          role: "ADMIN",
        }),
      });

      if (!response.ok) {
        alert("Wrong PIN");
        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      setPage("dashboard");
    } catch (error) {
      console.error(error);
      alert("Backend is not running or token request failed");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <button onClick={() => setPage("menu")}>Menu / Catering</button>
        <button onClick={openDashboard}>
          Admin Dashboard
        </button>
        <button onClick={toggleTheme}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>

      {page === "menu" && <Menu />}
      {page === "dashboard" && <Dashboard />}
    </div>
  );
}

export default App;

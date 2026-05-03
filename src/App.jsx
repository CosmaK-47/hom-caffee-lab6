import { useState, useEffect } from "react";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("menu");
  const ADMIN_PIN = "8885553535";
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

  const openDashboard = () => {
    const pin = prompt("Enter admin PIN:");

    if (pin === ADMIN_PIN) {
      setPage("dashboard");
    } else {
      alert("Wrong PIN");
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

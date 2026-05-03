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

  return (
    <div>
      <nav className="navbar">
        <button onClick={() => setPage("menu")}>Menu / Catering</button>
        <button onClick={() => setPage("dashboard")}>Admin Dashboard</button>
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

import { useState } from "react";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("menu");

  return (
    <div>
      <nav>
        <button onClick={() => setPage("menu")}>Menu / Catering</button>
        <button onClick={() => setPage("dashboard")}>Admin Dashboard</button>
      </nav>

      {page === "menu" && <Menu />}
      {page === "dashboard" && <Dashboard />}
    </div>
  );
}

export default App;

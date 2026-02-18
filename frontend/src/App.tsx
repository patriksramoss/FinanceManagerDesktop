import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import Budgets from "./pages/Budgets/Budgets";
import NetWorth from "./pages/NetWorth/NetWorth";
import Transactions from "./pages/Transactions/Transactions";
import Reports from "./pages/Reports/Reports";

import useAuthStore from "./stores/Auth";
import Navbar from "src/components/Navbar/Navbar";
import { getCachedAccessToken } from "src/stores/Plaid";
import Lenis from "lenis";

// styles
import "./styles/Global.scss";
import "lenis/dist/lenis.css";

const App: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // const loadAccessToken = useAuthStore((state) => state.loadAccessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    getCachedAccessToken().then((token: string | null) => {
      if (token) setAccessToken(token);
    });
  }, []);

  const handleLogout = async () => {
    await clearAccessToken();
    navigate("/");
  };

  const lenis = new Lenis({
    autoRaf: true,
  });

  return (
    <>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Auth />} />
      </Routes>
      {isAuthenticated && (
        <>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Routes>
            <Route path="/netWorth" element={<NetWorth />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;

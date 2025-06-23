import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import useAuthStore from "./stores/Auth";
import Navbar from "src/components/Navbar/Navbar";
import Store from "src/stores/Plaid";
// styles
import "./styles/Global.scss";

const App: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // const loadAccessToken = useAuthStore((state) => state.loadAccessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    Store.getCachedAccessToken().then((token) => {
      if (token) setAccessToken(token);
    });
  }, []);

  const handleLogout = async () => {
    await clearAccessToken();
  };

  return (
    <Router>
      <Navbar onLogout={handleLogout} isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Auth />} />
      </Routes>
    </Router>
  );
};

export default App;

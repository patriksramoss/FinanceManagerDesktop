import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import Summary from "./pages/Summary/Summary";
import Identity from "./pages/Identity/Identity";
import Accounts from "./pages/Accounts/Accounts";

import useAuthStore from "./stores/Auth";
import Navbar from "src/components/Navbar/Navbar";
import Store from "src/stores/Plaid";
// styles
import "./styles/Global.scss";

const App: React.FC = () => {
  const navigate = useNavigate();
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
    navigate("/");
  };

  return (
    <>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Summary /> : <Auth />} />
      </Routes>
      {isAuthenticated && (
        <>
          <Routes>
            <Route path="/summary" element={<Summary />} />
          </Routes>
          <Routes>
            <Route path="/accounts" element={<Accounts />} />
          </Routes>
          <Routes>
            <Route path="/identity" element={<Identity />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;

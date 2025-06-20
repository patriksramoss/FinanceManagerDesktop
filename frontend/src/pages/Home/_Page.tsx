import React, { useState, useEffect } from "react";
import PlaidLinkButton from "src/components/Plaid/PlaidLinkButton";
import EssentialData from "./Content/EssentialData/EssentialData";
import Summary from "./Content/Summary/Summary";
import Store from "src/Store";
import styles from "./Home.module.scss";
import Navbar from "src/components/Navbar/Navbar";

const Home: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    Store.getCachedAccessToken().then((token) => {
      if (token) setAccessToken(token);
    });
  }, []);

  const handleSuccess = async (publicToken: string) => {
    const token = await Store.getAccessToken(publicToken);
    setAccessToken(token);
  };

  const handleLogout = async () => {
    await Store.clearAccessToken();
    setAccessToken(null);
  };

  return (
    <div className={styles.homeContainer}>
      <Navbar onLogout={handleLogout} isAuthenticated={!!accessToken} />
      {!accessToken ? (
        <PlaidLinkButton onSuccess={handleSuccess} />
      ) : (
        <div className={styles.flexBox}>
          <Summary />

          <EssentialData />
        </div>
      )}
    </div>
  );
};

export default Home;

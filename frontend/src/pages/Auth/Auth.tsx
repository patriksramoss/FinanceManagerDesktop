import React from "react";
import PlaidLinkButton from "src/components/Plaid/PlaidLinkButton";
import { getAccessToken } from "src/stores/Plaid";
import useAuthStore from "src/stores/Auth";
import styles from "./Auth.module.scss";
import logoImg from "src/assets/images/logo.png";

const Auth: React.FC = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleSuccess = async (publicToken: string) => {
    const token = await getAccessToken(publicToken);
    setAccessToken(token);
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <img src={logoImg} alt="Logo" className={styles.logo} />
        <h2>Link Your Bank</h2>
        <PlaidLinkButton onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default Auth;

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
      <div className={styles.authCard}>
        <div className={styles.leftPane} />
        <div className={styles.rightPane}>
          <img src={logoImg} alt="Logo" className={styles.logo} />
          <h2 className={styles.title}>Link Your Bank</h2>
          <p className={styles.subtitle}>
            Securely connect your bank account to continue
          </p>
          <PlaidLinkButton onSuccess={handleSuccess} />
          <span className={styles.disclaimer}></span>
        </div>
      </div>
    </div>
  );
};

export default Auth;

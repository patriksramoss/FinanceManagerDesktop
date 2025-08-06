import { useState, useEffect } from "react";
import styles from "./Accounts.module.scss";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import useAuthStore from "src/stores/Auth";
import Loader from "src/components/Loader/Loader";

const Accounts: React.FC = () => {
  const [essentialData, setEssentialData] = useState<any>(null);
  const loadAccessToken = useAuthStore((state) => state.loadAccessToken);
  useEffect(() => {
    const fetchTokenAndData = async () => {
      const token = await loadAccessToken();
      if (!token) {
        console.warn("No cached access token found.");
        return;
      }

      try {
        const response = await fetch(
          `${backendUrl}/api/plaid/get-essential-data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              access_token: token,
            }),
          }
        );

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();
        console.log("datadatadatadata", data);

        setEssentialData(data);
      } catch (error) {
        console.error("Error fetching essential data:", error);
      }
    };

    fetchTokenAndData();
  }, []);

  if (!essentialData)
    return (
      <div className={styles.homeContainer}>
        <div className={styles.flexBox}>
          <div className={styles.accountWrapper}>
            <Loader loading={true} />
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.homeContainer}>
      <div className={styles.flexBox}>
        <div className={styles.accountWrapper}>
          <h3>Accounts</h3>
          <div className={styles.accounts}>
            {essentialData.accounts.map((account: any) => (
              <div key={account.account_id} className={styles.section}>
                <p>
                  <strong>{account.name}</strong> ({account.subtype})
                </p>
                <p>
                  Balance: {account.balances.current}{" "}
                  {account.balances.iso_currency_code}
                </p>
                <p>Account Number: ****{account.mask}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;

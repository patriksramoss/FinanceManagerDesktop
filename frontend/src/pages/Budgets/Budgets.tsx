import { useState, useEffect } from "react";
import styles from "./Budgets.module.scss";
import useAuthStore from "src/stores/Auth";
import Loader from "src/components/Loader/Loader";
import dayjs from "dayjs";
//apis
import { plaidController } from "src/api/plaid/index";

const Budgets: React.FC = () => {
  const [essentialData, setEssentialData] = useState<any>(null);
  const loadAccessToken = useAuthStore((state) => state.loadAccessToken);
  useEffect(() => {
    const fetchTokenAndData = async () => {
      const token = await loadAccessToken();
      if (!token) {
        console.warn("No cached access token found.");
        return;
      }
      console.log("222222222222");

      try {
        const data = await plaidController.getEssentialData(
          dayjs().format("YYYY-MM")
        );
        if (!data) return;
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

export default Budgets;

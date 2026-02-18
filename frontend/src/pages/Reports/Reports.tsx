import { useState } from "react";
import styles from "./Reports.module.scss";
import Loader from "src/components/Loader/Loader";

const Reports: React.FC = () => {
  const [essentialData, setEssentialData] = useState<any>(null);

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

export default Reports;

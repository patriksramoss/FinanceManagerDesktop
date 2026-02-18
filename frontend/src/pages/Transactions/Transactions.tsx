import { useState } from "react";
import styles from "./Transactions.module.scss";
import Loader from "src/components/Loader/Loader";

const Transactions: React.FC = () => {
  const [essentialData] = useState<any>(null);

  if (!essentialData)
    return (
      <div className={styles.homeContainer}>
        <div className={styles.flexBox}>
          <div className={styles.identityWrapper}>
            <Loader loading={true} />
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.homeContainer}>
      <div className={styles.flexBox}>
        <div className={styles.identityWrapper}>
          <h3>Identity</h3>
          <div className={styles.identity}>
            {essentialData.identity.accounts.map((account: any) => (
              <div key={account.account_id} className={styles.section}>
                <p>
                  <strong>{account.name}</strong> ({account.subtype})
                </p>
                {account.owners.map((owner: any, index: number) => (
                  <div key={index}>
                    <p>Owner(s): {owner.names.join(", ")}</p>
                    <p>
                      Emails:{" "}
                      {owner.emails.map((email: any) => email.data).join(", ")}
                    </p>
                    <p>
                      Phone Numbers:{" "}
                      {owner.phone_numbers
                        .map((phone: any) => phone.data)
                        .join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

import { useEffect, useState } from "react";
import usePlaidStore from "src/stores/Plaid";
import plaidController from "src/api/plaid/index";
import Loader from "src/components/Loader/Loader";
import styles from "./NetWorth.module.scss";

const NetWorth: React.FC = () => {
  const { accounts, accountsLoading, setAccountsLoading } = usePlaidStore();
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    const fetchAccounts = async () => {
      setAccountsLoading(true);
      try {
        const fetchedAccounts = await plaidController.getAccounts();
        const worth = fetchedAccounts.reduce((sum: number, acc: any) => {
          const balance = acc.balances?.current ?? 0;
          if (acc.type === "credit" || acc.type === "loan") {
            return sum - balance;
          }
          return sum + balance;
        }, 0);
        setAccountsLoading(false);
        setNetWorth(Number(worth.toFixed(2)));
      } catch (err) {
        console.error("Error fetching accounts:", err);
      }
    };

    fetchAccounts();
  }, []);

  if (accountsLoading || !accounts) {
    return (
      <div className={styles.homeContainer}>
        <Loader loading={true} />
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      <h2>
        Net Worth:{" "}
        {netWorth.toLocaleString("en-EN", {
          style: "currency",
          currency: "EUR",
        })}
      </h2>

      <div className={styles.accounts}>
        {accounts.map((acc: any) => (
          <div key={acc.account_id} className={styles.section}>
            <h4>
              {acc.name} {acc.mask ? `****${acc.mask}` : ""}
            </h4>
            <p>
              Type: {acc.type} ({acc.subtype})
            </p>
            <p>
              Balance:{" "}
              {acc.balances?.current != null
                ? acc.balances.current.toLocaleString("en-EN", {
                    style: "currency",
                    currency: acc.balances.iso_currency_code || "EUR",
                  })
                : "N/A"}
            </p>
            {acc.balances?.available != null && (
              <p>
                Available:{" "}
                {acc.balances.available.toLocaleString("en-EN", {
                  style: "currency",
                  currency: acc.balances.iso_currency_code || "EUR",
                })}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetWorth;

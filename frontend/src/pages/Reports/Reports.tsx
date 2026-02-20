import { useMemo, useState } from "react";
import styles from "./Reports.module.scss";
import Loader from "src/components/Loader/Loader";
import usePlaidStore from "src/stores/Plaid";
import dayjs from "dayjs";
import { getFilteredEssentialData } from "src/utils/filterEssentialData";

const Reports: React.FC = () => {
  const cache = usePlaidStore((s) => s.cache);
  const selectedMonth = usePlaidStore(
    (s) => s.selectedMonthDashboard ?? dayjs().format("YYYY-MM"),
  );
  const selectedAccount = usePlaidStore((s) => s.selectedAccountDashboard);
  const selectedCategory = usePlaidStore((s) => s.selectedCategoryDashboard);
  const essentialData = useMemo(() => {
    const month = selectedMonth ?? dayjs().format("YYYY-MM");
    return getFilteredEssentialData(
      cache[month],
      selectedAccount,
      selectedCategory,
    );
  }, [cache, selectedMonth, selectedAccount, selectedCategory]);
  const accounts = cache[selectedMonth]?.accounts ?? [];

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
            {accounts.map((account: any) => (
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

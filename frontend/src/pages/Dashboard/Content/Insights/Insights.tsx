import React, { useEffect } from "react";
import styles from "./Insights.module.scss";
//stores
import usePlaidStore from "src/stores/Plaid";

const Insights: React.FC = () => {
  const selectedMonthDashboard = usePlaidStore(
    (state) => state.selectedMonthDashboard || ""
  );
  const essentialData = usePlaidStore((state) =>
    selectedMonthDashboard ? state.cache[selectedMonthDashboard] : undefined
  );
  useEffect(() => {
    console.log("eeeesential data", essentialData);
  }, [essentialData]);
  return (
    <div className={styles.insights}>
      <h3>Spending Insights</h3>

      <div className={styles.insightBlock}>
        <p className={styles.subtitle}>Top Spending Category</p>
        <p className={styles.highlight}>Dining Out</p>
        <p>You spent $750 on dining out this month (30% of total).</p>
      </div>

      <div className={styles.insightBlock}>
        <p className={styles.subtitle}>Spending Alert</p>
        <p className={styles.highlight}>High Entertainment Spending</p>
        <p>Entertainment went up 20% compared to last month.</p>
      </div>
    </div>
  );
};

export default Insights;

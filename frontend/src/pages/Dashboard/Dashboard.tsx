import React from "react";
import styles from "./Dashboard.module.scss";
import Chart from "./Content/Chart/Chart";
import Card from "./Content/Card/Card";
import Insights from "./Content/Insights/Insights";
import Header from "./Content/Header/Header";

const Dashboard: React.FC = () => {
  return (
    <div className={styles.summaryContainer}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <div className={styles.flexBox}>
        <div className={styles.sideColumn}>
          <Card
            title="Monthly Spending"
            amount="$2,450"
            subtitle="This Month"
            change="5%"
            trend="up"
          />
          <Card
            title="Category Breakdown"
            amount="$8,750"
            subtitle="This Year"
            change="10%"
            trend="up"
          />
        </div>

        <div className={styles.mainColumn}>
          <Chart />
          <Insights />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

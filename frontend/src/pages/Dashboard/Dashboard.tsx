import React, { useEffect } from "react";
import styles from "./Dashboard.module.scss";
import dayjs from "dayjs";
// components
import Chart from "./Content/Chart/Chart";
import Header from "./Content/Header/Header";
import MiniCalendar from "./Content/MiniCalendar/MiniCalendar";
import SummaryRow from "./Content/Summary/SummaryRow";
//stores
import usePlaidStore from "src/stores/Plaid";
//interfaces
import { EssentialData } from "src/api/plaid/types";
//utils
import { fetchTokenAndData } from "src/pages/Dashboard/utils/fetchTokenAndData";

const Dashboard: React.FC = () => {
  const selectedMonthDashboard = usePlaidStore(
    (state) => state.selectedMonthDashboard || dayjs().format("YYYY-MM"),
  );
  const essentialData: EssentialData = usePlaidStore(
    (state) => state.cache[selectedMonthDashboard],
  );

  useEffect(() => {
    const load = async () => {
      const data = await fetchTokenAndData(selectedMonthDashboard);
      if (data) {
        usePlaidStore.getState().setEssentialData(selectedMonthDashboard, data);
      }
    };
    load();
  }, [selectedMonthDashboard]);

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <div className={styles.flexBox}>
        <div className={styles.sideColumn}>
          <SummaryRow />
          <MiniCalendar />
        </div>
        <div className={styles.mainColumn}>
          <Chart transactions={essentialData?.transactions || []} />
        </div>
      </div>
      <div className={styles.flexBox}></div>
    </div>
  );
};

export default Dashboard;

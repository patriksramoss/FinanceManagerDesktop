import React, { useEffect } from "react";
import dayjs from "dayjs";
// components
import Chart from "./Content/Chart/Chart";
import Header from "./Content/Header/Header";
import MiniCalendar from "./Content/MiniCalendar/MiniCalendar";
import SummaryRow from "./Content/Summary/SummaryRow";
//stores
import usePlaidStore from "src/stores/Plaid";
//utils
import { fetchTokenAndData } from "src/pages/Dashboard/utils/fetchTokenAndData";

const Dashboard: React.FC = () => {
  const selectedMonthDashboard = usePlaidStore(
    (state) => state.selectedMonthDashboard || dayjs().format("YYYY-MM"),
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
    <div className="flex flex-col items-center p-8 m-4 relative">
      <div className="flex flex-row items-center justify-between w-full my-4 relative">
        <Header />
      </div>
      <div className="flex flex-row justify-between w-full gap-4 max-[1050px]:flex-col-reverse">
        <div className="flex flex-col gap-2 w-[30%] max-[1050px]:w-full">
          <SummaryRow />
          <MiniCalendar />
        </div>
        <div className="flex flex-col gap-8 w-[70%] max-[1050px]:w-full">
          <Chart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

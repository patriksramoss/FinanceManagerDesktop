import { useState, useMemo } from "react";
import styles from "./Chart.module.scss";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import Loader from "src/components/Loader/Loader";
//stores
import usePlaidStore from "src/stores/Plaid";
// interfaces
import { PlaidTransaction } from "src/api/plaid/types";
// utils
import { processCategoryData } from "src/pages/Dashboard/utils/processCategoryData";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#8dd1e1",
  "#d0ed57",
  "#a4de6c",
  "#d88884",
];

type ChartProps = {
  transactions: PlaidTransaction[];
};

const Chart: React.FC<ChartProps> = ({ transactions }) => {
  const [loadingChartData] = useState<boolean>(false);
  const selectedMonthDashboard = usePlaidStore(
    (state) => state.selectedMonthDashboard || dayjs().format("YYYY-MM"),
  );
  const essentialData = usePlaidStore((state) =>
    selectedMonthDashboard ? state.cache[selectedMonthDashboard] : undefined,
  );

  const categorizedData = useMemo(() => {
    return processCategoryData(transactions, selectedMonthDashboard);
  }, [transactions, selectedMonthDashboard]);

  if (!essentialData)
    return (
      <div className={styles["essential-data"]}>
        <h2>Summary</h2>
        <Loader loading={true} />
      </div>
    );

  return (
    <div className={styles["essential-data"]}>
      <h2>Summary</h2>
      {loadingChartData ? (
        <div style={{ width: "100%", height: 400 }}>
          <div className={styles.loadingData}>
            <Loader loading />
          </div>
        </div>
      ) : essentialData.transactions.length === 0 ? (
        <div className={styles.noData}>No Data</div>
      ) : (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                innerRadius={70}
                outerRadius={120}
                data={categorizedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                isAnimationActive={false}
              >
                {categorizedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} EUR`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Chart;

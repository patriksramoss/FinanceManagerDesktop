import { useState, useEffect } from "react";
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

const Chart = () => {
  const [loadingChartData, setLoadingChartData] = useState<boolean>(false);
  const [categorizedData, setCategorizedData] = useState<any[]>([]);
  const selectedMonthDashboard = usePlaidStore(
    (state) => state.selectedMonthDashboard || ""
  );
  const essentialData = usePlaidStore((state) =>
    selectedMonthDashboard ? state.cache[selectedMonthDashboard] : undefined
  );

  useEffect(() => {
    if (essentialData) {
      processCategoryData(essentialData?.transactions, selectedMonthDashboard);
    }
  }, [selectedMonthDashboard]);

  const processCategoryData = (transactions: any[], month: string) => {
    const filtered = transactions.filter(
      (txn) => dayjs(txn.date).format("YYYY-MM") === month
    );

    const summary: { [category: string]: number } = {};

    filtered.forEach((txn) => {
      const category =
        txn.personal_finance_category?.primary ||
        txn.merchant_name ||
        "Uncategorized";

      summary[category] = (summary[category] || 0) + txn.amount;
    });

    const data = Object.entries(summary).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));

    const formattedData = data.map((entry) => ({
      ...entry,
      value: Math.abs(entry.value),
      name: entry.name
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    }));
    setCategorizedData(formattedData);
  };

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
      {essentialData.transactions.length === 0 && loadingChartData ? (
        <div style={{ width: "100%", height: 400 }}>
          <div className={styles.loadingData}>
            <Loader loading={true} />
          </div>
        </div>
      ) : essentialData.transactions.length === 0 && !loadingChartData ? (
        <div className={styles.noData}>No Data</div>
      ) : (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={categorizedData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
                isAnimationActive={false}
              >
                {categorizedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Chart;

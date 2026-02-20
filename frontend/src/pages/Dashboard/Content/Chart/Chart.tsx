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
// utils
import { processCategoryData } from "src/pages/Dashboard/utils/processCategoryData";
import { getFilteredEssentialData } from "src/utils/filterEssentialData";

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
  const [loadingChartData] = useState<boolean>(false);
  const cache = usePlaidStore((s) => s.cache);
  const selectedMonth = usePlaidStore((s) => s.selectedMonthDashboard);
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

  const categorizedData = useMemo(() => {
    return processCategoryData(
      essentialData?.transactions ?? [],
      selectedMonth,
    );
  }, [essentialData, selectedMonth]);

  if (!essentialData)
    return (
      <div className={styles["essential-data"]}>
        <Loader loading={true} />
      </div>
    );

  return (
    <div className={styles["essential-data"]}>
      {loadingChartData ? (
        <div className="w-full h-[400px]">
          <div className={styles.loadingData}>
            <Loader loading />
          </div>
        </div>
      ) : essentialData.transactions.length === 0 ? (
        <div className={styles.noData}>No Data</div>
      ) : (
        <div className="w-full h-[400px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                innerRadius={80}
                outerRadius={160}
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

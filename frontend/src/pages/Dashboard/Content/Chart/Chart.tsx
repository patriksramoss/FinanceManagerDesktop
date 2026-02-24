import { useMemo } from "react";
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
  const {
    cache,
    selectedMonthDashboard: selectedMonth,
    selectedAccountDashboard: selectedAccount,
    selectedCategoryDashboard: selectedCategory,
  } = usePlaidStore();

  const month = selectedMonth ?? dayjs().format("YYYY-MM");

  const essentialData = useMemo(
    () =>
      getFilteredEssentialData(cache[month], selectedAccount, selectedCategory),
    [cache, month, selectedAccount, selectedCategory],
  );

  const categorizedData = useMemo(
    () => processCategoryData(essentialData?.transactions ?? [], month),
    [essentialData],
  );

  return (
    <div className="flex flex-col items-center justify-center p-5 mx-4 rounded-lg border border-gray-300 bg-white h-[700px] relative">
      {!essentialData ? (
        <div className="w-full h-[400px] flex items-center justify-center relative top-12">
          <Loader loading />
        </div>
      ) : essentialData.transactions.length === 0 ? (
        <div className="w-full h-[400px] flex items-center justify-center text-gray-500">
          No Data
        </div>
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

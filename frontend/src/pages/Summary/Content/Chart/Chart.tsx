import { useState, useEffect } from "react";
import styles from "./Chart.module.scss";
import useAuthStore from "src/stores/Auth";
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

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
  const [essentialData, setEssentialData] = useState<any>(null);
  const loadAccessToken = useAuthStore((state) => state.loadAccessToken);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    dayjs().format("YYYY-MM")
  );
  const [categorizedData, setCategorizedData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTokenAndData = async () => {
      const token = await loadAccessToken();
      if (!token) {
        console.warn("No cached access token found.");
        return;
      }

      try {
        const response = await fetch(
          `${backendUrl}/api/plaid/get-essential-data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              access_token: token,
              month: selectedMonth,
            }),
          }
        );

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();
        console.log("datadatadatadata", data);

        setEssentialData(data);
        processCategoryData(data.transactions, selectedMonth);
      } catch (error) {
        console.error("Error fetching essential data:", error);
      }
    };

    fetchTokenAndData();
  }, []);

  useEffect(() => {
    if (essentialData?.transactions) {
      processCategoryData(essentialData.transactions, selectedMonth);
    }
  }, [selectedMonth]);

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

  const changeMonth = (direction: "prev" | "next") => {
    const current = dayjs(selectedMonth + "-01");
    const newDate =
      direction === "prev"
        ? current.subtract(1, "month")
        : current.add(1, "month");
    setSelectedMonth(newDate.format("YYYY-MM"));
  };

  if (!essentialData)
    return (
      <div className={styles["essential-data"]}>
        <Loader loading={true} />
      </div>
    );

  return (
    <div className={styles["essential-data"]}>
      <h2>Summary</h2>

      <div className={styles.monthSwitcher}>
        <button onClick={() => changeMonth("prev")}>←</button>
        <span>{dayjs(selectedMonth + "-01").format("MMMM YYYY")}</span>
        <button onClick={() => changeMonth("next")}>→</button>
      </div>

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
    </div>
  );
};

export default Chart;

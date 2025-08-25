import { useState, useEffect } from "react";
import styles from "./Summary.module.scss";
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

//apis
import { getEssentialData } from "src/api/plaid";

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

const Summary = () => {
  const [essentialData, setEssentialData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    dayjs().format("YYYY-MM")
  );
  const [categorizedData, setCategorizedData] = useState<any[]>([]);

  const fetchTokenAndData = async () => {
    console.log("fetchTokenAndData", selectedMonth);
    try {
      const data = await getEssentialData(selectedMonth);
      if (!data) return;
      setEssentialData(data);
      processCategoryData(data.transactions, selectedMonth);
    } catch (err) {
      console.error("Error fetching essential data:", err);
    }
  };

  useEffect(() => {
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
    fetchTokenAndData();
  };

  if (!essentialData) return <Loader loading={true} />;

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

export default Summary;

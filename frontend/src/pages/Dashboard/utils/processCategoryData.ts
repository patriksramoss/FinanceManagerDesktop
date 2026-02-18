import dayjs from "dayjs";

export const processCategoryData = (transactions: any[], month: string) => {
  const filtered = transactions.filter(
    (txn) => dayjs(txn.date).format("YYYY-MM") === month,
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

  /// ------------- formatting and categorization

  const formattedData = data.map((entry) => ({
    ...entry,
    value: Math.abs(entry.value),
    name: entry.name
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }));
  const filteredData = formattedData.filter((item) => item.value > 0);
  const threshold = 3;
  const total = filteredData.reduce((sum, item) => sum + item.value, 0);

  const main = [];
  let otherValue = 0;

  for (const item of filteredData) {
    const pct = (item.value / total) * 100;
    if (pct >= threshold) main.push(item);
    else otherValue += item.value;
  }

  if (otherValue > 0) main.push({ name: "Other", value: otherValue });

  /// -------------

  return main;
};

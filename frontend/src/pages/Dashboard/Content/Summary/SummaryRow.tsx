import usePlaidStore from "src/stores/Plaid";
import { calculateSummary } from "src/pages/Dashboard/utils/calculateSummary";
import { useMemo } from "react";
//components
import SummaryCard from "./Components/SummaryCard";
import { getFilteredEssentialData } from "src/utils/filterEssentialData";
import dayjs from "dayjs";

const SummaryRow = () => {
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
  const { income, expense, net } = useMemo(() => {
    return calculateSummary(essentialData?.transactions ?? []);
  }, [essentialData]);

  const format = (n: number) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(n);

  const netColor = net > 0 ? "text-green-600" : net === 0 ? "" : "text-red-600";

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-3 gap-2">
      <SummaryCard title="Total Income" value={format(income)} />
      <SummaryCard title="Total Expense" value={format(expense)} />
      <SummaryCard title="Net" value={format(net)} valueClassName={netColor} />
    </div>
  );
};

export default SummaryRow;

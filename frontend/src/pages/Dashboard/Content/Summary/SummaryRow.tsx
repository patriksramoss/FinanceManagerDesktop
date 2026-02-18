import dayjs from "dayjs";
//stores
import usePlaidStore from "src/stores/Plaid";

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col p-4 border rounded-xl bg-card">
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}

const SummaryRow = () => {
  const selectedMonth = usePlaidStore(
    (state) => state.selectedMonthDashboard || dayjs().format("YYYY-MM"),
  );
  const essentialData = usePlaidStore((state) =>
    selectedMonth ? state.cache[selectedMonth] : undefined,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <SummaryCard title="Total Income" value="€0.00" />
      <SummaryCard title="Total Expense" value="€0.00" />
      <SummaryCard title="Net" value="€0.00" />
      <SummaryCard title="Credit Utilization" value="0%" />
      <SummaryCard title="Loan Balance" value="€0.00" />
    </div>
  );
};

export default SummaryRow;

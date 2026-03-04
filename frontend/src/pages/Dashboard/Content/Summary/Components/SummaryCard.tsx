import usePlaidStore from "src/stores/Plaid";
import Loader from "src/components/Loader/Loader";

export default function SummaryCard({
  title,
  value,
  valueClassName,
}: {
  title: string;
  value: string;
  valueClassName?: string;
}) {
  const essentialDataLoading = usePlaidStore((s) => s.essentialDataLoading);

  return (
    <div className="flex flex-col p-4 border border-gray-300 rounded-xl bg-card">
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className={`text-xl font-semibold h-6 ${valueClassName}`}>
        {essentialDataLoading ? (
          <Loader loading size={6} posX="start" />
        ) : (
          value
        )}
      </span>
    </div>
  );
}

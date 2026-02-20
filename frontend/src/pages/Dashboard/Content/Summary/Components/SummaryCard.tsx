export default function SummaryCard({
  title,
  value,
  valueClassName,
}: {
  title: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col p-4 border rounded-xl bg-card">
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className={`text-xl font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}

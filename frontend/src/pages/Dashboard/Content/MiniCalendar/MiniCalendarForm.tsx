import * as React from "react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { PlaidTransaction } from "src/api/plaid/types";

interface MiniCalendarFormProps {
  selectedDate: Date;
  transactions: PlaidTransaction[];
  notes: string;
  setNotes: (value: string) => void;
  categorizedData: { name: string }[]; // same order as chart
}

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

export const MiniCalendarForm: React.FC<MiniCalendarFormProps> = ({
  selectedDate,
  transactions,
  notes,
  setNotes,
  categorizedData,
}) => {
  const getCategoryColor = (categoryName: string) => {
    const index = categorizedData.findIndex((c) => c.name === categoryName);
    return COLORS[index % COLORS.length] || "#ccc";
  };

  return (
    <div className="space-y-2 p-2 border border-gray-300 rounded-xl w-full bg-white">
      <div className="text-sm font-medium">
        {format(selectedDate, "MMM d, yyyy")}
      </div>

      {transactions.length > 0 ? (
        <ul className="text-sm list-disc pl-4 space-y-1">
          {transactions.map((t) => {
            const category =
              t.personal_finance_category?.detailed ??
              t.personal_finance_category?.primary ??
              "Uncategorized";
            const color = getCategoryColor(category);

            return (
              <li key={t.transaction_id} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span>
                  {t.name} — €{t.amount.toFixed(2)} ({category})
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-sm text-muted-foreground">No transactions</div>
      )}

      <Textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

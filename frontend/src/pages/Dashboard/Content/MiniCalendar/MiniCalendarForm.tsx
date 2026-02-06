import * as React from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type DayData = {
  income: number;
  expense: number;
  notes?: string;
};

type AmountMap = Record<string, DayData>;

interface MiniCalendarFormProps {
  selectedDate: Date | undefined;
  dayData: AmountMap;
  setDayData: React.Dispatch<React.SetStateAction<AmountMap>>;
}

export const MiniCalendarForm: React.FC<MiniCalendarFormProps> = ({
  selectedDate,
  dayData,
  setDayData,
}) => {
  if (!selectedDate) return null;

  const key = format(selectedDate, "yyyy-MM-dd");

  return (
    <div className=" space-y-2 p-2 border rounded-xl w-full bg-white">
      <div className="text-sm font-medium">
        {format(selectedDate, "MMM d, yyyy")}
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1">Income</label>
          <Input
            type="number"
            value={dayData[key]?.income ?? 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDayData((prev) => ({
                ...prev,
                [key]: {
                  ...prev[key],
                  income: Number(e.target.value) || 0,
                },
              }))
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground mb-1">Expense</label>
          <Input
            type="number"
            value={dayData[key]?.expense ?? 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDayData((prev) => ({
                ...prev,
                [key]: {
                  ...prev[key],
                  expense: Number(e.target.value) || 0,
                },
              }))
            }
          />
        </div>
      </div>

      <Textarea
        placeholder="Notes"
        value={dayData[key]?.notes ?? ""}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDayData((prev) => ({
            ...prev,
            [key]: { ...prev[key], notes: e.target.value },
          }))
        }
        className="w-full"
      />
    </div>
  );
};

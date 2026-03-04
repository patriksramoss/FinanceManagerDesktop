import * as React from "react";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import dayjs from "dayjs";

// interfaces
import { EssentialData } from "src/api/plaid/types";

// stores
import usePlaidStore from "src/stores/Plaid";

// styling
import styles from "./MiniCalendar.module.scss";

// components
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { MiniCalendarForm } from "./MiniCalendarForm";

// utils
import { truncateNumber } from "src/utils/truncateNumbers";
import { mapTransactions } from "src/pages/Dashboard/utils/mapTransactions";
import { getFilteredEssentialData } from "src/utils/filterEssentialData";
import { processCategoryData } from "src/pages/Dashboard/utils/processCategoryData";

const MiniCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState<Record<string, string>>({});

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

  const defaultMonth = selectedMonth
    ? parseISO(`${selectedMonth}-01`)
    : new Date();

  const dailyMap = useMemo(
    () => mapTransactions(essentialData),
    [essentialData],
  );

  const selectedKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  const selectedTransactions: EssentialData["transactions"] =
    selectedKey && dailyMap[selectedKey]
      ? dailyMap[selectedKey].transactions
      : [];

  const categorizedData = useMemo(() => {
    if (!essentialData?.transactions) return [];
    return processCategoryData(essentialData.transactions, selectedMonth);
  }, [essentialData, selectedMonth]);

  return (
    <div className="flex flex-col gap-2">
      <Card className="border-none shadow-none w-full h-full p-0">
        <CardContent className="p-0 h-full">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={defaultMonth}
            numberOfMonths={1}
            hideNavigation
            className={`w-full h-full rounded-xl ${styles.calendarStyles}`}
            components={{
              DayButton: ({ day, modifiers, ...props }: any) => {
                const k = format(day.date, "yyyy-MM-dd");
                const data = dailyMap[k];

                const income = data?.income ?? 0;
                const expense = data?.expense ?? 0;
                const sum = income - expense;

                let bg = "";
                if (sum > 0) bg = "bg-green-200/50";
                else if (sum < 0) bg = "bg-red-200/50";

                return (
                  <CalendarDayButton
                    key={k}
                    day={day}
                    modifiers={modifiers}
                    {...props}
                    className={`relative ${bg} flex flex-col items-center justify-center `}
                  >
                    <span>{day.date.getDate()}</span>

                    {data && (
                      <span className="text-xs text-muted-foreground">
                        €{truncateNumber(sum)}
                      </span>
                    )}

                    {notes[k] && (
                      <span className="absolute top-1 right-1 text-xs">📝</span>
                    )}
                  </CalendarDayButton>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      {selectedDate && selectedKey && (
        <MiniCalendarForm
          selectedDate={selectedDate}
          transactions={selectedTransactions}
          notes={notes[selectedKey] ?? ""}
          setNotes={(value) =>
            setNotes((prev) => ({ ...prev, [selectedKey]: value }))
          }
          categorizedData={categorizedData}
        />
      )}
    </div>
  );
};

export default MiniCalendar;

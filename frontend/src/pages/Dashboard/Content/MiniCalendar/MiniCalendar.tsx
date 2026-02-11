import * as React from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import usePlaidStore from "src/stores/Plaid";
import { MiniCalendarForm } from "./MiniCalendarForm";
import styles from "./MiniCalendar.module.scss";
import { truncateNumber } from "src/utils/truncateNumbers";

type DayData = {
  income: number;
  expense: number;
  notes?: string;
};

const MiniCalendar: React.FC = () => {
  const [dayData, setDayData] = React.useState<Record<string, DayData>>({});
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const selectedMonth = usePlaidStore((s) => s.selectedMonthDashboard);

  const defaultMonth = selectedMonth
    ? parseISO(`${selectedMonth}-01`)
    : new Date();

  return (
    <div className="flex flex-col gap-[0.55rem]">
      <Card className={`border border-none shadow-none w-full h-full p-0 `}>
        <CardContent className="p-0 h-full">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={defaultMonth}
            numberOfMonths={1}
            hideNavigation={true}
            className={`${styles.hideCaption} w-full h-full rounded-xl`}
            components={{
              DayButton: ({ day, modifiers, ...props }: any) => {
                const k = format(day.date, "yyyy-MM-dd");
                const today = new Date();
                const isPast =
                  day.date <
                  new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate(),
                  );
                const data = dayData[k] ?? {
                  income: 0,
                  expense: 0,
                  notes: "",
                };
                const sum = (data?.income ?? 0) - (data?.expense ?? 0);

                let bg = "";
                if (sum > 0) bg = "bg-green-200/50";
                else if (sum < 0) bg = "bg-red-200/50";
                else if (sum === 0 && data) bg = "";
                if (isPast) bg = "bg-gray-100 text-gray-400";

                return (
                  <CalendarDayButton
                    key={k}
                    day={day}
                    modifiers={modifiers}
                    {...props}
                    className={`relative ${bg} flex flex-col items-center justify-center `}
                  >
                    <span>{day.date.getDate()}</span>

                    {data.notes && (
                      <span className="absolute top-1 right-1 text-xs">📝</span>
                    )}

                    {data && (data.income || data.expense) !== null && (
                      <span className=" text-xs text-muted-foreground">
                        €
                        {truncateNumber(
                          (data.income ?? 0) - (data.expense ?? 0),
                        )}
                      </span>
                    )}
                  </CalendarDayButton>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="w-full">
        {selectedDate && (
          <MiniCalendarForm
            selectedDate={selectedDate}
            dayData={dayData}
            setDayData={setDayData}
          />
        )}
      </div>
    </div>
  );
};

export default MiniCalendar;

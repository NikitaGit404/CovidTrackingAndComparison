import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRootStore } from "@/store/store";
import { saveUserSearch } from "@/api/getApis";

const DateSelector = () => {
  const { dateFrom, setDateFrom, dateTo, setDateTo, userEmail, countries } =
    useRootStore((state) => state);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (dateFrom && dateTo) {
      setDate({ from: dateFrom, to: dateTo });
    }
  }, [dateFrom, dateTo]);
  return (
    <div className="flex flex-row gap-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            data-testid="date-selector"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Button
        disabled={!date?.from || !date?.to}
        className="m-2"
        onClick={async () => {
          if (date?.from && date?.to) {
            setDateFrom(date.from);
            setDateTo(date.to);
            await saveUserSearch(userEmail, countries, date.from, date.to);
          }
        }}
      >
        Set Date
      </Button>
    </div>
  );
};

export default DateSelector;

"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { useState } from "react";
import { format } from "date-fns";
import { Column } from "@/types/column";

export default function DatePicker({ column }: { column: Column }) {
  const [date, setDate] = useState<Date>();
  return (
    <>
      <input type="hidden" readOnly required={column.is_nullable == 'NO'} name={column.column_name} value={date?.valueOf()} />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
}

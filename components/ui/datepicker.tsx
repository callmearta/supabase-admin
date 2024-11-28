"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { useRef, useState } from "react";
import { format } from "date-fns";
import { Column } from "@/types/column";

export default function DatePicker({ column, name, required }: { column?: Column, name?: string, required?: boolean }) {
  const [date, setDate] = useState<Date>();
  const hiddenRef = useRef<HTMLInputElement>(null);
  const _handleSelect = (date?: Date) => {
    if (!hiddenRef.current || !date) return;
    setDate(date);
    hiddenRef.current.value = date.toISOString();
  };
  return (
    <>
      <input
        type="hidden"
        required={typeof required != 'undefined' ? required : column?.is_nullable == "NO"}
        name={name ? name : column?.column_name}
        ref={hiddenRef}
        disabled={!date}
      />
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
            onSelect={_handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
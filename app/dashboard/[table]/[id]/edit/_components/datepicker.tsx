"use client";

import { CalendarIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useRef, useState } from "react";
import { format } from "date-fns";
import { Column } from "@/types/column";

export default function DatePicker({ column, name, required, defaultValue }: { column?: Column, name?: string, required?: boolean, defaultValue?: string }) {
    const [date, setDate] = useState<Date | 'null'>(defaultValue ? new Date(defaultValue) : 'null');
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
                value={date == 'null' ? 'null' : date?.toISOString()}
            />
            <div className="flex gap-2">
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
                            {date == 'null' ? <span>Pick a date</span> : format(date, "PPP")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date == 'null' ? new Date() : date}
                            onSelect={_handleSelect}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {date != 'null' && <Button type="button" variant={"outline"} className="w-fit" onClick={() => setDate('null')}>
                    <XIcon className="mr-2 h-4 w-4" />
                    Clear
                </Button>}
            </div>
        </>
    );
}

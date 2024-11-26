"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Option = { label: string; value: string };

interface ISelectProps {
  placeholder: string;
  options: Option[];
  name: string;
  selectedOptions: string[];
  defaultValue?: string[];
  onAddItem?: (value: string) => void;
  onRemoveItem?: (value: string) => void;
  setSelectedOptions: Dispatch<SetStateAction<string[]>>;
  disabled?: boolean;
}
const MultiSelect = ({
  disabled,
  placeholder,
  options: values,
  name,
  selectedOptions: selectedItems,
  setSelectedOptions: setSelectedItems,
  defaultValue,
  onAddItem,
  onRemoveItem
}: ISelectProps) => {

  const handleSelectChange = (value: string) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems((prev) => [...prev, value]);
      onAddItem && !defaultValue?.includes(value) && onAddItem(value);
    } else {
      const referencedArray = [...selectedItems];
      const indexOfItemToBeRemoved = referencedArray.indexOf(value);
      referencedArray.splice(indexOfItemToBeRemoved, 1);
      setSelectedItems(referencedArray);
      onRemoveItem && !defaultValue?.includes(value) && onRemoveItem(value);
    }
  };

  const isOptionSelected = (value: string): boolean => {
    return selectedItems?.includes(value) ? true : false;
  };

  return (
    <>
      <input type="hidden" name={name} value={selectedItems.join(',')} />
      <DropdownMenu>
        <DropdownMenuTrigger disabled={disabled} asChild className={cn("w-full", { "cursor-not-allowed opacity-50": disabled })}>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
          >
            <div>{selectedItems.length > 0 ? values.filter(option => selectedItems.includes(option.value)).map(option => option.label).join(', ') : placeholder}</div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn("w-56", { "cursor-not-allowed opacity-50": disabled })}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {values.map((value: ISelectProps["options"][0], index: number) => {
            return (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                key={index}
                checked={isOptionSelected(value.value)}
                onCheckedChange={() => handleSelectChange(value.value)}
              >
                {value.label}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MultiSelect;
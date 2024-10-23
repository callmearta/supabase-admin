import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Column } from "@/types/column";

export default function Enum({ column }: { column: Column }) {
  const defaultValue = column.enum_values
    .split(",")
    .find(
      (value) =>
        (column.column_default as string)?.split("::")[0].replace(/'/g, "") ==
        value
    );
  return (
    <Select required={column.is_nullable == 'NO'} defaultValue={defaultValue}>
      <SelectTrigger className="capitalize w-[180px]">
        <SelectValue
          className="capitalize"
          placeholder={`Select ${column.column_name}`}
        />
      </SelectTrigger>
      <SelectContent className="capitalize">
        {column.enum_values.split(",").map((value) => (
          <SelectItem
            key={value}
            value={value}
            defaultChecked={
              (column.column_default as string)
                ?.split("::")[0]
                .replace(/'/g, "") == value
            }
            className="capitalize"
          >
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

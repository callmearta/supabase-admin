import DatePicker from "@/components/ui/datepicker";
import FileInput from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import RichTextArea from "@/components/ui/richtextarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";
import { Column } from "@/types/column";
import { OverrideType } from "@/types/supabase-admin";

export default function Overrides(tableName: string, column: Column) {
  //@ts-ignore
  const override =
    SUPABASE_ADMIN_CONFIG.overrides && SUPABASE_ADMIN_CONFIG.overrides[tableName][column.column_name];
  if (!override) {
    console.error("No override found for column", column.column_name);
    return null;
  }
  const overrideType = override.type;
  switch (overrideType) {
    case OverrideType.Text:
      return <Input type="text" name={column.column_name} />;
      break;
    case OverrideType.RichText:
      return <RichTextArea column={column} />;
      break;
    case OverrideType.Date:
      return <DatePicker column={column} />;
      break;
    case OverrideType.Select:
      return (
        <Select name={column.column_name}>
          <SelectTrigger className="capitalize w-[180px]">
            <SelectValue
              className="capitalize"
              placeholder={`Select ${column.column_name}`}
            />
          </SelectTrigger>
          <SelectContent className="capitalize">
            {column.enum_values.split(",").map((value) => (
              <SelectItem key={value} value={value} className="capitalize">
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;
    case OverrideType.UploadSingle:
      return <FileInput name={column.column_name} accept="image/*" />;
      break;
    case OverrideType.UploadMultiple:
      return <FileInput multiple={true} name={column.column_name} accept="image/*" />;
      break;
    case OverrideType.Number:
      return <Input name={column.column_name} type="number" />;
      break;
    default:
      return null;
  }
}

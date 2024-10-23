import { fetchColumnsForTable } from "@/app/actions";
import DatePicker from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextArea from "@/components/ui/richtextarea";
import Enum from "./_components/enum";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";
import Overrides from "./overrides";
import Form from "./_components/form";

export default async function Page(props: {
  params: Promise<{ table: string }>;
}) {
  const params = await props.params;
  const { table } = params;
  const columns = await fetchColumnsForTable(table);
  console.log(columns);
  const sortedColumns = columns.sort(
    (a, b) => a.ordinal_position - b.ordinal_position
  );
  const inputRenderer = (column: (typeof columns)[0]) => {
    const type = column.udt_name;
    const hasOverride =
      // @ts-ignore
      typeof SUPABASE_ADMIN_CONFIG.overrides[table] != "undefined" &&
      typeof SUPABASE_ADMIN_CONFIG.overrides[table][column.column_name] !=
        undefined &&
      SUPABASE_ADMIN_CONFIG.overrides[table] &&
      SUPABASE_ADMIN_CONFIG.overrides[table][column.column_name];
    if (hasOverride) {
      return Overrides(table, column);
    }
    if (column.data_type == "USER-DEFINED") {
      return <Enum column={column} />;
    }
    switch (type) {
      case "varchar":
        return (
          <Input
            required={column.is_nullable == "NO"}
            name={column.column_name}
            type="text"
          />
        );
        break;
      case "text":
        return <RichTextArea column={column} />;
        break;
      case "timestamptz":
        return <DatePicker column={column} />;
        break;
      case "int8":
      case "int4":
      case "int2":
      case "uuid":
        return (
          <Input
            type="text"
            placeholder="Auto Generated UUID"
            readOnly
            disabled
          />
        );
        break;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl capitalize">Create {table}</h1>
      <Form table={table}>
        {sortedColumns.map((c) => {
          return (
            <div key={c.column_name} className="my-4">
              <Label className="capitalize mb-2 block">
                {c.column_name.replace("_", " ")}{" "}
                {c.is_nullable == "NO" ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </Label>
              {inputRenderer(c)}
            </div>
          );
        })}
      </Form>
    </div>
  );
}

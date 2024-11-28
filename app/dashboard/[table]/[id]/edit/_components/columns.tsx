import DatePicker from "./datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextArea from "@/components/ui/richtextarea";
import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";
import { Column } from "@/types/column";
import Overrides from "./overrides";
import Enum from "./enum";

export default function Columns({ data, columns, table }: { table: string, columns: Column[], data: any }) {
    const inputRenderer = (column: (typeof columns)[0], value: any) => {
        const type = column.udt_name;
        const hasOverride = SUPABASE_ADMIN_CONFIG.overrides &&
            // @ts-ignore
            typeof SUPABASE_ADMIN_CONFIG.overrides[table] != "undefined" &&
            typeof SUPABASE_ADMIN_CONFIG.overrides[table][column.column_name] !=
            undefined &&
            SUPABASE_ADMIN_CONFIG.overrides[table] &&
            SUPABASE_ADMIN_CONFIG.overrides[table][column.column_name];
        if (hasOverride) {
            return Overrides(table, column, value);
        }
        if (column.data_type == "USER-DEFINED") {
            return <Enum column={column} defaultValue={value} />;
        }
        switch (type) {
            case "varchar":
                return (
                    <Input
                        required={column.is_nullable == "NO"}
                        name={column.column_name}
                        type="text"
                        defaultValue={value}
                    />
                );
                break;
            case "text":
                return <RichTextArea column={column} defaultValue={value} />;
                break;
            case "timestamptz":
                return <DatePicker column={column} defaultValue={value} />;
                break;
            case "int8":
            case "int4":
            case "int2":
            case "uuid":
                return (
                    <Input
                        type="text"
                        defaultValue={value}
                        placeholder={column.is_identity == "YES" ? "Auto Generated" : ""}
                        readOnly={column.is_identity == "YES"}
                        disabled={column.is_identity == "YES"}
                    />
                );
                break;
            default:
                return null;
        }
    };
    return columns.map((c) => {
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
                {inputRenderer(c, data[c.column_name])}
            </div>
        );
    })
}
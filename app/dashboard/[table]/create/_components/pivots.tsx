import DatePicker from "@/components/ui/datepicker";
import FileInput from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextArea from "@/components/ui/richtextarea";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";
import { OverrideType, PivotField } from "@/types/supabase-admin";

export default function Pivots({ table }: { table: string }) {
    const fieldRenderer = (fieldName: string, field: (PivotField)) => {
        const type = field.type;

        switch (type) {
            case OverrideType.Text:
                return <Input type="text" name={fieldName} />;
                break;
            case OverrideType.RichText:
                return <RichTextArea name={fieldName} />;
                break;
            case OverrideType.Date:
                return <DatePicker name={fieldName} />;
                break;
            case OverrideType.UploadSingle:
                return <FileInput name={fieldName} accept="image/*" />;
                break;
            case OverrideType.UploadMultiple:
                return <FileInput multiple={true} name={fieldName} accept="image/*" />;
                break;
            case OverrideType.Number:
                return <Input name={fieldName} type="number" />;
                break;
            default:
                return null;
        }
    };

    return SUPABASE_ADMIN_CONFIG.pivotFields && SUPABASE_ADMIN_CONFIG.pivotFields[table] && Object.keys(SUPABASE_ADMIN_CONFIG.pivotFields[table]).map(key => {
        if (!SUPABASE_ADMIN_CONFIG.pivotFields || !SUPABASE_ADMIN_CONFIG.pivotFields[table]) return null;
        const field = SUPABASE_ADMIN_CONFIG.pivotFields[table][key];
        return <div key={key} className="my-4">
            <Label className="capitalize mb-2 block">
                {key.replace("_", " ")}{" "}
                {!field.nullable ? (
                    <span className="text-red-500">*</span>
                ) : (
                    ""
                )}
            </Label>
            {fieldRenderer(key, field)}
        </div>
    })

}
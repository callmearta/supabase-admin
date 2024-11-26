import { cn } from "@/lib/utils";
import { getStoreInFieldName } from "@/utils/getStoreInFieldName";
import { getRelationalColumn } from "@/utils/hasTableViewOverride";
import { createClient } from "@/utils/supabase/client";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { Toast } from "./toast";

export default function UploadedFile({ file, table, id, name }: { file: any, table: string, id: string, name: string }) {
    const [isRemoved, setIsRemoved] = useState(false);
    const [loading, setLoading] = useState(false);
    const _handleRemove = async () => {
        setLoading(true);
        const supabase = createClient();
        const result = await supabase.from(name).delete().eq(getStoreInFieldName(table as string, name) as string, file[getStoreInFieldName(table as string, name) as keyof typeof file]).eq(getRelationalColumn(table as string, name) as string, id).select();
        if (result.error) {
            Toast({ title: result.error.message || 'Please try again later', type: 'foreground' });
            return;
        }
        setIsRemoved(true);
        setLoading(false);
    }
    if (isRemoved) return null;
    return <div
        className={cn("w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center relative", { "opacity-50": loading })}
    >
        <span className="absolute top-2 right-2 bg-white rounded-full flex items-center justify-center cursor-pointer" onClick={_handleRemove}>
            <XIcon size={20} />
        </span>
        <img src={file[getStoreInFieldName(table as string, name) as keyof typeof file]} className="w-full h-full object-cover" />
    </div>
}
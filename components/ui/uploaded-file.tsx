import { cn } from "@/lib/utils";
import { getStoreInFieldName } from "@/utils/getStoreInFieldName";
import { getRelationalColumn } from "@/utils/hasTableViewOverride";
import { createClient } from "@/utils/supabase/client";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { Toast } from "./toast";
import isRelational from "@/utils/isRelational";

export default function UploadedFile({ file, table, id, name, imageUrl }: { file: any, table: string, id: string, name: string, imageUrl: string }) {
    const isRelationalField = isRelational(table, name);
    const [isRemoved, setIsRemoved] = useState(false);
    const [loading, setLoading] = useState(false);
    const _handleRemove = async () => {
        setLoading(true);
        const supabase = createClient();
        if (isRelationalField) {
            const result = await supabase.from(name).delete().eq(getStoreInFieldName(table as string, name) as string, file).eq(getRelationalColumn(table as string, name) as string, id);
            if (result.error) {
                Toast({ title: result.error.message || 'Please try again later', type: 'foreground' });
                return;
            }
            setIsRemoved(true);
            setLoading(false);
        } else {
            const result = await supabase.from(table).update({
                [name]: null
            }).eq('id', id).select();
            if (result.error) {
                Toast({ title: result.error.message || 'Please try again later', type: 'foreground' });
                return;
            }
            setIsRemoved(true);
            setLoading(false);
        }
    }
    if (isRemoved) return null;
    return <div
        className={cn("w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center relative", { "opacity-50": loading })}
    >
        <span className="absolute top-2 right-2 bg-white rounded-full flex items-center justify-center cursor-pointer" onClick={_handleRemove}>
            <XIcon size={20} />
        </span>
        <img src={imageUrl.includes('http') ? imageUrl : process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/' + imageUrl} className="w-full h-full object-cover" />
    </div>
}
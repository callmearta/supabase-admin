"use client";

import MultiSelect from "@/components/ui/multiselect";
import { getRelationalColumn, getRelationalStoreColumn } from "@/utils/hasTableViewOverride";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SelectMultiple({ name, fetchOptions, defaultValue, table }: { name: string, fetchOptions: (supabase: SupabaseClient<any, "public", any>) => Promise<any[]>, defaultValue: any[], table: string }) {
    const [options, setOptions] = useState<any[]>([]);
    const { id } = useParams();
    const [selectedOptions, setSelectedOptions] = useState<any[]>(getRelationalStoreColumn(table, name) ? defaultValue.map(v => v && v[getRelationalStoreColumn(table, name)!]) : []);
    const [fieldLoading, setFieldLoading] = useState(false);
    const supabase = createClient();
    useEffect(() => {
        fetchOptions(supabase).then(setOptions);
    }, [fetchOptions]);

    return <MultiSelect
        name={name}
        disabled={fieldLoading}
        placeholder={name}
        options={options.map(option => ({ label: option.title, value: option.id }))}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        onAddItem={async (value) => {
            setFieldLoading(true);
            await supabase.from(name).insert({ [getRelationalStoreColumn(table, name)!]: value, [getRelationalColumn(table, name)!]: id });
            setFieldLoading(false);
        }}
        onRemoveItem={async (value) => {
            setFieldLoading(true);
            await supabase.from(name).delete().eq(getRelationalStoreColumn(table, name)!, value).eq(getRelationalColumn(table, name)!, id);
            setFieldLoading(false);
        }}
    />;
}
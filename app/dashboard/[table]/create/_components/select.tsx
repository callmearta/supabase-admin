"use client";

import MultiSelect from "@/components/ui/multiselect";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useState } from "react";

export default function SelectMultiple({ name, fetchOptions }: { name: string, fetchOptions: (supabase: SupabaseClient<any, "public", any>) => Promise<any[]> }) {
    const [options, setOptions] = useState<any[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const supabase = createClient();
    useEffect(() => {
        fetchOptions(supabase).then(setOptions);
    }, [fetchOptions]);

    return <MultiSelect
        name={name}
        placeholder={name}
        options={options.map(option => ({ label: option.title, value: option.id }))}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
    />;
}
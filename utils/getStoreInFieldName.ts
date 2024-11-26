import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";

export const getStoreInFieldName = (table: string, column: string) => {
    const hasOverride = SUPABASE_ADMIN_CONFIG.relationalFields && SUPABASE_ADMIN_CONFIG.relationalFields[table] && SUPABASE_ADMIN_CONFIG.relationalFields[table][column];
    if (!hasOverride) return null;
    return hasOverride.storeIn?.fieldName;
}
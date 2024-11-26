import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";
import { OverrideType } from "@/types/supabase-admin";

export const getTableViewColumnOverride = (table: string, columnName: string) => {
    const overrides = SUPABASE_ADMIN_CONFIG.tableViewOverrides &&
        SUPABASE_ADMIN_CONFIG.tableViewOverrides[table] &&
        SUPABASE_ADMIN_CONFIG.tableViewOverrides[table].find(v => typeof v === "object" && v.columnName == columnName);
    if (overrides) return overrides as { columnName: string, displayName?: string, type?: OverrideType };
    return null;
}

export const hasTableViewOverrides = (table: string) => {
    return SUPABASE_ADMIN_CONFIG.tableViewOverrides && SUPABASE_ADMIN_CONFIG.tableViewOverrides[table];
}

export const getTableViewOverrides = (table: string) => {
    return SUPABASE_ADMIN_CONFIG.tableViewOverrides && SUPABASE_ADMIN_CONFIG.tableViewOverrides[table];
}

export const hasTableViewColumnOverride = (table: string, columnName: string) => {
    return getTableViewColumnOverride(table, columnName) !== undefined;
}

export const hasTableViewColumnObjectOverride = (table: string, columnName: string) => {
    return getTableViewColumnOverride(table, columnName) !== undefined && typeof getTableViewColumnOverride(table, columnName) === "object";
}

export const getTableViewColumnOverrideType = (table: string, columnName: string) => {
    if (!hasTableViewColumnObjectOverride(table, columnName)) return null;
    return (getTableViewColumnOverride(table, columnName) as { type: OverrideType })?.type;
}

export const getRelationalColumn = (table: string, columnName: string) => {
    const hasOverride = SUPABASE_ADMIN_CONFIG.relationalFields && SUPABASE_ADMIN_CONFIG.relationalFields[table] && SUPABASE_ADMIN_CONFIG.relationalFields[table][columnName];
    if (!hasOverride) return null;
    return hasOverride.relationalColumn;
}

export const getRelationalStoreColumn = (table: string, columnName: string) => {
    const hasOverride = SUPABASE_ADMIN_CONFIG.relationalFields && SUPABASE_ADMIN_CONFIG.relationalFields[table] && SUPABASE_ADMIN_CONFIG.relationalFields[table][columnName];
    if (!hasOverride) return null;
    return hasOverride.storeColumn;
}


import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";

export default function isRelational(tableName: string, field: string) {
  return SUPABASE_ADMIN_CONFIG.relationalFields && SUPABASE_ADMIN_CONFIG.relationalFields[tableName] && SUPABASE_ADMIN_CONFIG.relationalFields[tableName][field as string] ? true : false;
}
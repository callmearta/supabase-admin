import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";
import isRelational from "./isRelational";

export default function getBucketName(tableName: string, fieldName: string) {
    if (isRelational(tableName, fieldName)) {
        return SUPABASE_ADMIN_CONFIG.relationalFields &&
            SUPABASE_ADMIN_CONFIG.relationalFields[tableName] &&
            SUPABASE_ADMIN_CONFIG.relationalFields[tableName][fieldName] &&
            SUPABASE_ADMIN_CONFIG.relationalFields[tableName][fieldName].storeIn?.bucketName;
    }
    return SUPABASE_ADMIN_CONFIG.overrides &&
        SUPABASE_ADMIN_CONFIG.overrides[tableName] &&
        SUPABASE_ADMIN_CONFIG.overrides[tableName][fieldName] &&
        SUPABASE_ADMIN_CONFIG.overrides[tableName][fieldName].bucketName ?
        SUPABASE_ADMIN_CONFIG.overrides[tableName][fieldName].bucketName : 'uploads';
}
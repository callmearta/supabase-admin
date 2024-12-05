"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers as NextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { databaseClient } from "@/utils/supabase/database";
import { Column } from "@/types/column";
import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";
import { OverrideType, PivotField, RelationalField } from "@/types/supabase-admin";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const headers = await NextHeaders();
  const origin = headers.get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }
  const isAdmin = typeof SUPABASE_ADMIN_CONFIG.auth?.isAdminCallback == 'function' ? SUPABASE_ADMIN_CONFIG.auth?.isAdminCallback(data.user, supabase) : false;
  if (!isAdmin) {
    await supabase.auth.signOut();
    return encodedRedirect("error", "/sign-in", "Invalid login credentials");
  }
  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const headers = await NextHeaders();
  const origin = headers.get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export async function fetchTablesFromSupabase() {
  const client = databaseClient();
  await client.connect();
  const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);

  await client.end();
  return res.rows;
}

export async function fetchColumnsForTable(tableName: string) {
  const client = databaseClient();
  await client.connect();
  const res = await client.query(`
     WITH enum_values AS (
        SELECT t.typname AS enum_type, e.enumlabel AS enum_value
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
      ),
      columns_with_enum AS (
        SELECT 
          c.is_identity,
          c.column_name, 
          c.ordinal_position, 
          c.column_default, 
          c.is_nullable, 
          c.data_type, 
          c.udt_name,
          array_to_string(array_agg(e.enum_value), ',') AS enum_values -- Converts array to comma-separated string
        FROM information_schema.columns c
        LEFT JOIN enum_values e ON c.udt_name = e.enum_type
        WHERE c.table_schema = 'public'
        AND c.table_name = '${tableName}'
        GROUP BY c.is_identity, c.column_name, c.ordinal_position, c.column_default, c.is_nullable, c.data_type, c.udt_name
      )
      SELECT * FROM columns_with_enum;
    `);
  await client.end();
  return res.rows as Column[];
}

export async function saveDataToSupabase(tableName: string, data: FormData) {
  const relationalFields = SUPABASE_ADMIN_CONFIG.relationalFields ? SUPABASE_ADMIN_CONFIG.relationalFields[tableName] as { [key: string]: RelationalField } : null;

  if (relationalFields) {
    const result = await saveRelationalDataToSupabase({
      relationalFields,
      formData: data,
      tableName,
    })
    return result;
  }
  const supabase = await createClient();
  const result = await supabase.from(tableName).insert(Object.fromEntries(data));

  return result;
}

async function saveRelationalDataToSupabase({
  relationalFields,
  formData,
  tableName
}: {
  relationalFields: { [key: string]: RelationalField },
  formData: FormData,
  tableName: string,
}) {
  const supabase = await createClient();
  const relationalFieldNames = Object.keys(relationalFields);
  const copyFormData = new FormData();
  for (const [key, value] of Array.from(formData.entries())) {
    if (!value.toString().length) continue;
    copyFormData.append(key, value);
  }
  relationalFieldNames.forEach(async key => {
    copyFormData.delete(key);
  });

  const objectToInsert: { [key: string]: any } = Object.fromEntries(copyFormData);
  Object.keys(objectToInsert).forEach(key => {
    if (objectToInsert[key] == 'null') objectToInsert[key] = null;
  });

  const result = await supabase.from(tableName).upsert(objectToInsert).select();

  if (!result.data) {
    console.error("Failed to insert into Supabase");
    return result;
  }
  relationalFieldNames.forEach(async key => {
    const relationalField = relationalFields[key];
    const relationalFieldValue = formData.get(key);
    if (!relationalFieldValue) return;
    if (relationalField.store && typeof relationalField.store === 'function') {
      const storeResult = await relationalField.store(supabase, result.data[0], relationalFieldValue);
      if (!storeResult) throw new Error(`Failed to store relational field: ${key}`);
      return;
    }
    if (relationalField.type == OverrideType.UploadSingle) {
      if (!relationalField.storeIn?.bucketName) return;

      const fileUrl = await supabase.storage.from(relationalField.storeIn.bucketName).upload("" + Math.floor(Date.now() / 1000) + (relationalFieldValue as File).name.replace(/s/g, '-'), relationalFieldValue as File);
      if (!fileUrl.data) throw new Error("File upload to Supabase failed.");
      const insertedFilesResult = await supabase.from(key).upsert({
        [relationalField.storeIn.fieldName]: fileUrl.data?.fullPath,
        [relationalField.relationalColumn]: result.data[0].id
      }).select();
      if (!insertedFilesResult.data) throw new Error(`Failed to insert into pivot object table: storeIn ${key}`);
    }
    if (relationalField.type == OverrideType.UploadMultiple) {
      const relationalFieldValues = formData.getAll(key);
      if (!relationalFieldValues || !relationalFieldValues.length) return;
      relationalFieldValues.forEach(async (value) => {
        if (!relationalField.storeIn?.bucketName) return;

        const fileUrl = await supabase.storage.from(relationalField.storeIn.bucketName).upload("" + Math.floor(Date.now() / 1000) + (value as File).name.replace(/s/g, '-'), value as File);
        if (!fileUrl.data) throw new Error("File upload to Supabase failed.");
        const insertedFilesResult = await supabase.from(key).upsert({
          [relationalField.storeIn.fieldName]: fileUrl.data?.fullPath,
          [relationalField.relationalColumn]: result.data[0].id
        }).select();
        if (!insertedFilesResult.data) throw new Error(`Failed to insert into pivot object table: storeIn ${key}`);
      });
    }
  });
  return result;
}

export async function uploadFileToSupabase(bucketId: string, file: File, fileName?: string) {
  const supabase = await createClient();
  const unixTimestamp = Math.floor(Date.now() / 1000);
  const result = await supabase.storage
    .from(bucketId)
    .upload(fileName ? fileName : `${unixTimestamp}-${file.name.replace(/s/g, '-')}`, file);
  return result;
}

export async function fetchDataFromSupabase(tableName: string, id: string) {
  const supabase = await createClient();
  const result = await supabase.from(tableName).select().eq('id', id);
  return result;
}

export async function fetchRelationalDataFromSupabase(tableName: string, id: string) {
  const supabase = await createClient();
  const relationalFields = SUPABASE_ADMIN_CONFIG.relationalFields ? SUPABASE_ADMIN_CONFIG.relationalFields[tableName] as { [key: string]: RelationalField } : null;
  if (!relationalFields) return null;
  const relationalFieldNames = Object.keys(relationalFields);
  const results = await Promise.all(relationalFieldNames.map(async (key) => {
    const relationalField = relationalFields[key];
    const result = await supabase.from(key).select().eq(relationalField.relationalColumn, id);
    return result.data;
  }));

  return Object.fromEntries(relationalFieldNames.map((key, index) => [key, results[index] ? results[index] : null]));
}

export async function updateDataInSupabase(tableName: string, formData: FormData, id: string, relationalData: any, initialFormData: FormData | null) {
  const supabase = await createClient();
  const copyFormData = new FormData();
  for (const [key, value] of Array.from(formData.entries())) {
    if (!value.toString().length) continue;
    if (relationalData && key in relationalData || key == 'id') continue;
    copyFormData.append(key, value);
  }
  const objectToUpdate: { [x: string]: any } = Object.fromEntries(copyFormData);
  Object.keys(objectToUpdate).forEach(key => {
    if (objectToUpdate[key] == 'null') objectToUpdate[key] = null;
  });
  const result = await supabase.from(tableName).update(objectToUpdate).eq('id', id).select();

  return result;
}
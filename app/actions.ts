"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers as NextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { databaseClient } from "@/utils/supabase/database";
import { Column } from "@/types/column";
import { SUPABASE_ADMIN_CONFIG } from "@/supabase-admin.config";
import { OverrideType, PivotField } from "@/types/supabase-admin";

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
  const userInPublic = (
    await supabase.from("users").select("*").eq("id", `${data.user.id}`)
  ).data;
  if (!userInPublic?.length) {
    await supabase.auth.signOut();
    return encodedRedirect("error", "/sign-in", "Invalid login credentials");
  }
  const userRole = userInPublic[0].role;
  const isAdmin = userRole == "admin";
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
  const pivotFields = SUPABASE_ADMIN_CONFIG.pivotFields ? SUPABASE_ADMIN_CONFIG.pivotFields[tableName] as { [key: string]: PivotField } : null;
  if (pivotFields) {
    const result = await savePivotDataToSupabase({
      pivotFields,
      formData: data,
      tableName,
    })
    return result;
  }
  const supabase = await createClient();
  const result = await supabase.from(tableName).insert(Object.fromEntries(data));

  return result;
}

async function savePivotDataToSupabase({
  pivotFields,
  formData,
  tableName
}: {
  pivotFields: { [key: string]: PivotField },
  formData: FormData,
  tableName: string,
}) {
  const supabase = await createClient();
  const pivotFieldNames = Object.keys(pivotFields);
  pivotFieldNames.forEach(async key => {
    formData.delete(key);
  });
  const result = await supabase.from(tableName).upsert(Object.fromEntries(formData)).select();
  console.log(result)
  if (!result.data) {
    throw new Error("Failed to insert into Supabase");
  }
  pivotFieldNames.forEach(async key => {
    const pivotObject = pivotFields[key];
    let fileUrl;
    if (pivotObject.type == OverrideType.UploadMultiple || pivotObject.type == OverrideType.UploadSingle) {
      if (!pivotObject.bucketName) return;
      fileUrl = await supabase.storage.from(pivotObject.bucketName).upload((formData.get(key) as File).name.replace(/s/g, '-'), formData.get(key) as File);
      if (!fileUrl.data) throw new Error("File upload to Supabase failed.");
      const insertedFile = await supabase.from(pivotObject.storeIn.tableName).upsert({
        [pivotObject.storeIn.fieldName]: fileUrl.data?.fullPath
      }).select();
      if (!insertedFile.data) throw new Error(`Failed to insert into pivot object table: storeIn ${pivotObject.storeIn.tableName}`);
      await supabase.from(pivotObject.pivotTable.tableName).insert({
        [pivotObject.pivotTable.foreignKeys.fillableColumn]: insertedFile.data[0].id,
        [pivotObject.pivotTable.foreignKeys.relationalColumn]: result.data[0].id
      });

      return;
    }
  });
  return result;
}

export async function uploadFileToSupabase(bucketId: string, file: File) {
  const supabase = await createClient();
  const result = await supabase.storage
    .from(bucketId)
    .upload(file.name.replace(/s/g, '-'), file);
  return result;
}
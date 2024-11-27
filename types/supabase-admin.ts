import { SupabaseClient, User } from "@supabase/supabase-js";

export enum OverrideType {
  UploadSingle = "uploadsingle",
  UploadMultiple = "uploadmultiple",
  Select = "select",
  Date = "date",
  Text = "text",
  RichText = "richtext",
  Number = "number",
}

export type Config = {
  auth?: {
    isAdminCallback?: (user: User | null, supabase: SupabaseClient<any, "public", any>) => Promise<boolean>
  },
  general: {
    panelTitle: string,
    panelSubtitle: string,
    icon: any,
    itemsPerPage?: number
  },
  tableViewOverrides?: {
    [tableName: string]: (string | {
      columnName: string,
      displayName?: string,
      type?: OverrideType
    })[]
  },
  menu?: {
    [key: string]: {
      icon?: any;
      displayName?: string;
      url?: string;
      hidden?: boolean;
    };
  };
  overrides?: {
    [tableName: string]: {
      [columnName: string]: {
        type: OverrideType;
        bucketName?: string;
      };
    };
  };
  pivotFields?: {
    [tableName: string]: {
      [fieldName: string]: PivotField
    }
  },
  relationalFields?: {
    [tableName: string]: {
      [fieldName: string]: RelationalField
    }
  }
};

export type RelationalField = {
  type: OverrideType,
  nullable?: boolean,
  relationalColumn: string,
  storeColumn?: string,
  fetchOptions?: (supabase: SupabaseClient<any, "public", any>) => Promise<any[]>,
  storeIn?: {
    bucketName?: string,
    fieldName: string
  },
  store?: (supabase: SupabaseClient<any, "public", any>, insertResult: { id: string, [key: string]: any }, fieldValue: any) => Promise<any[]>
};

export type PivotField = {
  type: OverrideType,
  pivotTable: {
    tableName: string,
    foreignKeys: {
      fillableColumn: string,
      relationalColumn: string
    }
  },
  storeIn: {
    tableName: string,
    fieldName: string
  },
  nullable?: boolean,
  bucketName?: string,
  placeholder?: string,
  readOnly?: boolean,
  defaultValue?: any,
  disabled?: boolean,
}
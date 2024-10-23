export type Column = {
  column_name: string;
  ordinal_position: number;
  column_default: null | "now()" | number | string;
  is_nullable: "YES" | "NO";
  data_type: "USER-DEFINED" | "bigint" | "int" | "float" | "double" | string;
  udt_name:
    | "varchar"
    | "text"
    | "timestamptz"
    | "uuid"
    | "int8"
    | "int4"
    | "int2";
  enum_values: "{NULL}" | string;
};

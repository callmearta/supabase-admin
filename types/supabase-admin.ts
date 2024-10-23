export enum OverrideType {
  Upload = "upload",
  Select = "select",
  Date = "date",
  Text = "text",
  RichText = "richtext",
  Number = "number",
}

export type Config = {
  menu: {
    [key: string]: {
      icon?: any;
      displayName?: string;
      url?: string;
      hidden?: boolean;
    };
  };
  overrides: {
    [key: string]: {
      [key: string]: {
        type: OverrideType;
        tableName?: string;
        values?: string[];
      };
    };
  };
  relations: {
    [key: string]: {
      [key: string]: {
        displayName?: string;
        type: OverrideType;
        tableName?: string;
        columnName?: string;
      };
    };
  };
};

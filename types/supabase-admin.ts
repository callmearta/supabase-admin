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
  general: {
    panelTitle: string,
    panelSubtitle: string,
    icon: any
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
      };
    };
  };
  pivotFields?: {
    [tableName: string]: {
      [fieldName: string]: PivotField
    }
  }
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
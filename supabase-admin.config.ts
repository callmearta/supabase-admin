import { Paperclip, Truck, UserIcon } from "lucide-react";
import { Config, OverrideType } from "./types/supabase-admin";

export const SUPABASE_ADMIN_CONFIG: Config = {
  menu: {
    users: {
      icon: UserIcon,
      displayName: "Users",
      url: "/users",
    },
    products: {
      icon: Truck,
      displayName: "Products",
      url: "/products",
    },
    attachments: {
      icon: Paperclip,
      displayName: "Attachments",
      url: "/attachments",
    },
    attachments_products: {
      hidden: true,
    },
  },
  overrides: {
    attachments: {
      url: {
        type: OverrideType.UploadSingle,
      },
    },
  },
  pivotFields: {
    products: {
      coverImage: {
        type: OverrideType.UploadSingle,
        bucketName: "uploads",
        pivotTable: {
          tableName: "attachments_products",
          foreignKeys: {
            fillableColumn: 'attachment_id',
            relationalColumn: 'product_id'
          }
        },
        storeIn:{
          tableName: 'attachments',
          fieldName: 'url'
        }
      }
    }
  }
};

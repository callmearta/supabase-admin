import { Command, Paperclip, Truck, UserIcon } from "lucide-react";
import { Config, OverrideType } from "./types/supabase-admin";

export const SUPABASE_ADMIN_CONFIG: Config = {
  auth: {
    isAdminCallback: async (user, supabase) => {
      if(!user) return false;
      
      const userInPublic = (
        await supabase.from("users").select("*").eq("id", `${user.id}`)
      ).data;
      if (!userInPublic?.length) {
        await supabase.auth.signOut();
        return false;
      }
      const userRole = userInPublic[0].role;
      const isAdmin = userRole == "admin";
      return isAdmin;
    }
  },
  general:{
    panelTitle: "Mock",
    panelSubtitle:"This is mock data",
    icon: Command,
    itemsPerPage: 50
  },
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

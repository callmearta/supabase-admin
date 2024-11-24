import { Command, Paperclip, Truck, UserIcon } from "lucide-react";
import { Config, OverrideType } from "./types/supabase-admin";

export const SUPABASE_ADMIN_CONFIG: Config = {
  auth: {
    isAdminCallback: async (user, supabase) => {
      if (!user) return false;

      const userInPublic = (
        await supabase.from("users").select("*").eq("user_id", `${user.id}`)
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
  general: {
    panelTitle: "PanelTitle",
    panelSubtitle: "PanelSubtitle",
    icon: Command,
    itemsPerPage: 50
  },
  tableViewOverrides: {
    products: ["id", "title", "slug", { columnName: "link", displayName: "Link" }, "price", { columnName: 'cover_image', displayName: 'Cover Image', type: OverrideType.UploadSingle }],
    categories: ['id', 'title', 'slug', { columnName: 'icon', displayName: 'Icon', type: OverrideType.UploadSingle }]
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
    products_categories: {
      hidden: true,
    },
  },
  overrides: {
    products: {
      cover_image: {
        type: OverrideType.UploadSingle,
      },
      price: {
        type: OverrideType.Text,
      },
      file_size: {
        type: OverrideType.Text,
      },
      file_link: {
        type: OverrideType.Text,
      },
      gumroad_link: {
        type: OverrideType.Text,
      }
    },
  },
  relationalFields: {
    products: {
      products_categories: {
        type: OverrideType.Select,
        relationalColumn: 'product_id',
        nullable: true,
        fetchOptions: async (supabase) => {
          const { data, error } = await supabase.from('categories').select('*');
          return data || [];
        },
        store: async (supabase, insertResult, fieldValue) => {
          const values = fieldValue.split(',').map((id: string) => ({
            product_id: insertResult.id,
            category_id: id
          }));
          const { data, error } = await supabase.from('products_categories').insert(values);
          return data || [];
        }
      },
      products_images: {
        type: OverrideType.UploadMultiple,
        relationalColumn: 'product_id',
        nullable: true,
        storeIn: {
          fieldName: 'image_url',
          bucketName: 'product_images'
        },
      }
    }
  },
};

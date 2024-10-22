import { Paperclip, Truck, UserIcon } from "lucide-react";

export const SUPABASE_ADMIN_CONFIG = {
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
};

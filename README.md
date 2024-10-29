<h1 align="center">Supabase Admin Dashboard</h1>

<p align="center">
 Fastest way to build an admin panel for using Supabase.
</p>

<br/>

> **WARNING**  
> This repository is still under development. While feedbacks and pull requests are appreciated, There's no guarantee to use this in production.

# Important note for using
Right now detecting if a user is an admin indeed is just hardcoded. For now you need to have a `users` table in your public schema with a column named `role` with the value of `admin` for an admin user. While you can customize this logic, There isn't any support right now for admin detection condition. So feel free to either try to edit the code, or make custom logic handlers and open a PR. I'd really appreciate it.

## Doesn't Supabase's own dashboard cover all needs?

<p>While Supabase's own dashboard covers exactly everything you need, The user experience is not that great for handing off a project to a client. This is a challenge I was facing while trying to develop multiple projects using Supabase. So I decided to create a generic admin panel.</p>

## Why and how it works?
<p>The main thing while creating a generic admin panel in mind, is to be able to do everything with the least effort. Here's what happens when you try to use this admin panel:</p>

1. You enter your PostgreSql connection string that you can copy from Supabase dashboard
2. At runtime Nextjs makes a request to that database fetching the 'public' schema to display sidebar menu
3. When navigating to a table, Nextjs would use that table name from the url to fetch columns for that table in order to display a table in the list page while allowing you to overwrite things.

<p>That's the basic structure of how Supabase Admin works. Now it's still under development but the goal to achieve is a customizable admin panel that can be done withing 5 minutes just by overwriting a config file.</p>

# Supabase Admin Configuration

This configuration file sets up an administrative interface for a Supabase-powered application. It defines authentication, layout, navigation, and field handling for the admin panel.

## Configuration Sections

### Authentication
Defines authentication logic to verify admin access. Callback function is passed the user and supabase instance.

```typescript
auth: {
   isAdminCallback: async (user, supabase) => {
      // Check if user is admin
   }
}
```


### General Settings
Basic panel configuration including title, subtitle, main icon, and pagination settings.

```typescript
general: {
   panelTitle: "YOUR PANEL TITLE",
   panelSubtitle: "YOUR PANEL SUBTITLE",
   icon: Command, // An icon from Lucide React
   itemsPerPage: 50
}
```

### Navigation Menu
Configures the sidebar navigation. Fetches all tables from the schema and auto generates a sidebar. This config is for changing how they display.

Each menu item can be configured with:
- `icon`: The icon to display
- `displayName`: Label shown in the menu
- `url`: Navigation path
- `hidden`: Optional flag to hide menu items
```typescript
{
   users: {
      icon: UserIcon,
      displayName: "Users",
      url: "/dashbaord/users"
   },
   users_products: {
      hidden: true
   }
}
```

### Field Overrides
Specifies special handling for specific fields. In this case, the `url` field in `attachments` is configured as a single file upload.

```typescript
overrides: {
   attachments: {
      url: {
         type: OverrideType.UploadSingle
      }
   }
}
```

### Pivot Fields
Handles many-to-many relationships with file uploads. Example:
- Configures product cover images
- Uses `attachments_products` as pivot table
- Stores files in the "uploads" bucket
- Maps relationships between products and attachments
```typescript
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
```



## Clone and run

1. Clone the project

   ```bash
   git clone https://github.com/callmearta/supabase-admin
   cd supabase-admin
   ```

2. Install dependencies

   ```bash
   npm i
   # OR
   bun i
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   DB_CONNECTION_STRING=[INSERT SUPABASE DATABASE CONNECTION STRING]
   ```

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The admin panel should now be running on [localhost:3000](http://localhost:3000/).

## License
This software is open for personal, educational, or non-commercial use, modification, and distribution. Contributions to the project are welcome, subject to the terms outlined below.
<br/>
## Terms and Conditions

### 1. Usage and Contribution:

You may use, copy, and modify this software freely, as long as it is not for commercial purposes.
Contributions to this project are encouraged, and all contributions are licensed under these terms.

### 2. Non-Commercial Use Only:

Any commercial use, defined as usage intended to generate revenue, or used by any business or organization with more than 10 employees, is strictly prohibited without express written permission from the author.

### 3. Attribution:

Proper attribution must be given to the original author(s) in any copies or substantial portions of the software.

### 4. No Warranty:

This software is provided "as is," without warranty of any kind, express or implied.
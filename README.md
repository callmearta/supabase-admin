<h1 align="center">Supabase Admin Dashboard</h1>

<p align="center">
 Fastest way to build an admin panel for using Supabase.
</p>

<br/>

> **WARNING**  
> This repository is still under development. While feedbacks and pull requests are appreciated, There's no guarantee to use this in production.

# Important note for using
<p>Right now detecting if a user is an admin indeed is just hardcoded. For now you need to have a `users` table in your public schema with a column named `role` with the value of `admin` for an admin user. While you can customize this logic, There isn't any support right now for admin detection condition. So feel free to either try to edit the code, or make custom logic handlers and open a PR. I'd really appreciate it.</p>

## Doesn't Supabase's own dashboard cover all needs?

<p>While Supabase's own dashboard covers exactly everything you need, The user experience is not that great for handing off a project to a client. This is a challenge I was facing while trying to develop multiple projects using Supabase. So I decided to create a generic admin panel.</p>

## Why and how it works?
<p>The main thing while creating a generic admin panel in mind, is to be able to do everything with the least effort. Here's what happens when you try to use this admin panel:</p>

1. You enter your PostgreSql connection string that you can copy from Supabase dashboard
2. At runtime Nextjs makes a request to that database fetching the 'public' schema to display sidebar menu
3. When navigating to a table, Nextjs would use that table name from the url to fetch columns for that table in order to display a table in the list page while allowing you to overwrite things.

<p>That's the basic structure of how Supabase Admin works. Now it's still under development but the goal to achieve is a customizable admin panel that can be done withing 5 minutes just by overwriting a config file.</p>


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
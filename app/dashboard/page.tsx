import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { fetchTablesFromSupabase } from "../actions";

export default async function Dashboard() {
  const supabase = await createClient();
  const tables = await fetchTablesFromSupabase();
  const tablesDataCount = await Promise.all(tables.map(t => supabase.from(t.table_name).select('id', { count: 'exact' })));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <h1 className="font-bold text-2xl mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tables.map((table,index) => <div key={index} className="border rounded-xl p-4">
          <strong className="text-4xl block mb-2 font-bold">{tablesDataCount[index].count || 0}</strong>
          <span className="capitalize">{table.table_name.replace(/_/g,' ')}</span>
        </div>)}
      </div>
    </div>
  );
}

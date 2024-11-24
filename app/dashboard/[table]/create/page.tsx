import { fetchColumnsForTable } from "@/app/actions";
import Form from "./_components/form";
import Pivots from "./_components/pivots";
import Columns from "./_components/columns";
import RelationalFields from "./_components/relational";

export default async function Page(props: {
  params: Promise<{ table: string }>;
}) {
  const params = await props.params;
  const { table } = params;
  const columns = await fetchColumnsForTable(table);

  const sortedColumns = columns.sort(
    (a, b) => a.ordinal_position - b.ordinal_position
  );


  return (
    <div className="w-full">
      <h1 className="font-bold text-2xl capitalize">Create {table}</h1>
      <Form table={table}>
        <Columns table={table} columns={sortedColumns} />
        <Pivots table={table} />
        <RelationalFields table={table} />
      </Form>
    </div>
  );
}

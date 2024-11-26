import { fetchColumnsForTable, fetchDataFromSupabase, fetchRelationalDataFromSupabase } from "@/app/actions";
import Form from "./_components/form";
import Pivots from "./_components/pivots";
import Columns from "./_components/columns";
import RelationalFields from "./_components/relational";

export default async function Page(props: {
    params: Promise<{ table: string, id: string }>;
}) {
    const params = await props.params;
    const { table, id } = params;
    const columns = await fetchColumnsForTable(table);
    const result = await fetchDataFromSupabase(table, id);
    const relationalData = await fetchRelationalDataFromSupabase(table, id);
    if (!result.data) {
        return <div>No data found</div>;
    }
    const data = result.data;

    const sortedColumns = columns.sort(
        (a, b) => a.ordinal_position - b.ordinal_position
    );


    return (
        <div className="w-full">
            <h1 className="font-bold text-2xl capitalize">Create {table}</h1>
            <Form relationalData={relationalData} table={table} id={id}>
                <Columns data={data[0]} table={table} columns={sortedColumns} />
                {/* <Pivots table={table} /> */}
                <RelationalFields data={relationalData} table={table} />
            </Form>
        </div>
    );
}

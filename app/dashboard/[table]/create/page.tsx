import { fetchColumnsForTable } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function Page(props: { params: Promise<{ table: string }> }) {
    const params = await props.params;
    const { table } = params;
    const columns = await fetchColumnsForTable(table);
    const sortedColumns = columns.sort((a,b) => a.ordinal_position - b.ordinal_position);
    console.log(sortedColumns);
    const inputRenderer = (column: typeof columns[0]) => {
        const type = column.udt_name;
        if (column.data_type == 'USER-DEFINED') {
            return <select>
                {column.enum_values.split(',').map(value => <option key={value} value={value}>{value}</option>)}
            </select>
        }
        switch (type) {
            case "varchar":
                return <Input type="text" />
                break;
            case "text":
                return <textarea></textarea>
                break;
            case "timestamptz":
                return <p>Calendar</p>;
                break;
            case "uuid":
                return <Input type="text" placeholder="Auto Generated UUID" readOnly disabled />
                break;
            default:
                return null;
        }
    };
    return <div className="flex-1 w-full flex flex-col gap-12">
        <h1 className="font-bold text-2xl capitalize">Create {table}</h1>
        {sortedColumns.map(c => {
            return <div key={c.column_name}>
                <Label className="capitalize">{c.column_name}</Label>
                {inputRenderer(c)}
            </div>
        })}
    </div>
}
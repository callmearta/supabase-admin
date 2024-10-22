import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";

export default async function Page({
  params: { table },
}: {
  params: { table: string };
}) {
  const supabase = createClient();
  const { data, error, count } = await supabase.from(table).select("*");
  if (error) {
    return <p>{error.message}</p>;
  }
  if (!data) {
    return <p>No data found.</p>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <h1 className="font-bold text-2xl capitalize">{table}</h1>
      <Table>
        <TableHeader>
          <TableRow>
            {Object.keys(data[0]).map((key, index) => (
              <TableHead key={index + "-" + key}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d, i) => (
            <TableRow key={d.id || i}>
              {Object.keys(d).map((key, index) => (
                <TableCell key={index + "-" + key}>{d[key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ table: string }>;
}) {
  const { table } = await params;
  const supabase = await createClient();
  const { data, error, count } = await supabase.from(table).select("*");
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl capitalize">{table}</h1>
        <Link href={`/dashboard/${table}/create`} className={cn(buttonVariants({ variant: "outline" }))}>
          <PlusIcon size={14} className="mr-1" />
          <span>Create</span>
        </Link>
      </div>
      {!data || !data.length ? <p>No data found.</p> : <Table>
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
      </Table>}
    </div>
  );
}

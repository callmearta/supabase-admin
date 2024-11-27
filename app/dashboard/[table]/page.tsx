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
import { OverrideType } from "@/types/supabase-admin";
import getFileUrl from "@/utils/getFilUrl";
import { getTableViewColumnOverride, getTableViewColumnOverrideType, getTableViewOverrides, hasTableViewOverrides } from "@/utils/hasTableViewOverride";
import { hasTableViewColumnOverride } from "@/utils/hasTableViewOverride";
import { createClient } from "@/utils/supabase/server";
import { EditIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ table: string }>;
}) {
  const { table } = await params;
  const supabase = await createClient();
  const { data, error, count } = await supabase.from(table).select(hasTableViewOverrides(table) ?
    getTableViewOverrides(table)?.map(v => typeof v === "string" ? v : v.columnName).join(',')
    : "*");
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
              <TableHead key={index + "-" + key}>{getTableViewColumnOverride(table, key)?.displayName || key}</TableHead>
            ))}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d: any, i) => (
            <TableRow key={i}>
              {Object.keys(d).map((key, index) => (
                <TableCell key={index + "-" + key}>
                  {hasTableViewColumnOverride(table, key) && getTableViewColumnOverrideType(table, key) === OverrideType.UploadSingle && d[key] && d[key].length ?
                    <Image alt="" src={getFileUrl(d[key])} width={48} height={48} className="rounded-full flex-none w-12 h-12 object-cover" /> :
                    d[key]}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <Link href={`/dashboard/${table}/${d.id}/edit`} className={cn(buttonVariants({ variant: "outline" }))}>
                  <EditIcon size={14} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>}
    </div>
  );
}

import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { PropsWithChildren } from "react";
import HeaderAuth from '@/components/header-auth'
import { fetchTablesFromSupabase } from "../actions";

export default async function DashboardLayout({ children }: PropsWithChildren) {
    const tables = await fetchTablesFromSupabase();
    return <SidebarProvider>
        <DashboardSidebar tables={tables} />
        <div className="w-full">
            <nav className="w-full flex justify-start border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-full flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                        <Link href={"/"}>SupiAdmin</Link>
                    </div>
                    <HeaderAuth />
                </div>
            </nav>
            <main className="p-5 flex flex-col">
                <SidebarTrigger />
                <div className="max-w-7xl flex mx-auto flex-col gap-12 items-start">{children}</div>
            </main>
        </div>
    </SidebarProvider>
}
import Link from "next/link";
import HeaderAuth from "@/components/header-auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }
  return (
    <>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"}>SupiAdmin</Link>
          </div>
          <HeaderAuth />
        </div>
      </nav>
      <div className="flex flex-col gap-20 max-w-5xl p-5">
        <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div>
      </div>
    </>
  );
}

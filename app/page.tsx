import Hero from "@/components/hero";
import { redirect } from "next/navigation";

export default async function Index() {
  redirect('/sign-in');
}

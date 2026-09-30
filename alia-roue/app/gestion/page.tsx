import type { Metadata } from "next";
import { isAdmin, passwordConfigured } from "@/lib/auth";
import { Admin } from "@/components/admin/Admin";
import { Login } from "@/components/admin/Login";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gestion | ALIA coiffure", robots: { index: false, follow: false } };

export default async function Gestion() {
  if (!(await isAdmin())) return <Login configured={passwordConfigured()} />;
  return <Admin />;
}

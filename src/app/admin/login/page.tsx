import Link from "next/link";
import { headers } from "next/headers";
import AdminLoginForm from "@/components/AdminLoginForm";
import { isAuthConfigured } from "@/lib/auth";
import { isMySqlConfigured } from "@/lib/db";

export const instant = false;

export default async function AdminLoginPage() {
  await headers();
  const configured = isMySqlConfigured() && isAuthConfigured();

  return (
    <main className="grid min-h-screen place-items-center bg-[#F8F6EF] px-5 py-10">
      <section className="w-full max-w-md border border-[#D8CDBD] bg-white p-7 shadow-[0_26px_70px_-45px_rgba(55,35,15,.4)] sm:p-10">
        <Link href="/" className="text-xs font-bold uppercase tracking-[.25em] text-[#3F8FB7]">CAICOS / Administración</Link>
        <h1 className="serif-display mt-5 text-4xl text-[#5A4731]">Ingresar al panel</h1>
        {configured ? (
          <AdminLoginForm />
        ) : (
          <p role="alert" className="mt-6 border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
            El panel todavía no está configurado. Completá las variables MySQL y BETTER_AUTH_SECRET del servidor, ejecutá las migraciones y volvé a intentar.
          </p>
        )}
      </section>
    </main>
  );
}

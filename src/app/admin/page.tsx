import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminAvailability from "@/components/AdminAvailability";
import { auth, isAuthConfigured } from "@/lib/auth";
import { isMySqlConfigured } from "@/lib/db";

export const instant = false;

export default async function AdminPage() {
  const requestHeaders = await headers();

  if (!isMySqlConfigured() || !isAuthConfigured() || !auth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F8F6EF] px-5 py-10">
        <p role="alert" className="max-w-xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
          El panel todavía no está configurado. Completá las variables MySQL y BETTER_AUTH_SECRET del servidor, ejecutá las migraciones y volvé a intentar.
        </p>
      </main>
    );
  }

  let session;
  try {
    session = await auth.api.getSession({ headers: requestHeaders });
  } catch (error) {
    console.error("[admin] Failed to validate admin session:", error);
    return (
      <main className="grid min-h-screen place-items-center bg-[#F8F6EF] px-5 py-10">
        <p role="alert" className="max-w-xl border border-red-300 bg-red-50 p-5 text-sm text-red-900">
          No se pudo verificar la sesión. Revisá la conexión con MySQL e intentá nuevamente.
        </p>
      </main>
    );
  }

  if (!session) redirect("/admin/login");
  if (session.user.role !== "admin") redirect("/admin/login?error=forbidden");
  return <AdminAvailability adminName={session.user.name || session.user.email} />;
}

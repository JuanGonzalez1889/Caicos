"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await authClient.signIn.email({ email, password, callbackURL: "/admin" });
      if (result.error) {
        setError("No se pudo iniciar sesión. Revisá el correo y la contraseña.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch (requestError) {
      console.error("[admin/login] Sign-in request failed:", requestError);
      setError("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block text-sm font-bold text-[#5A4731]">
        Correo electrónico
        <input
          required
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 block min-h-12 w-full border border-[#D8CDBD] px-4 py-3 font-normal outline-[#3F8FB7]"
        />
      </label>
      <label className="block text-sm font-bold text-[#5A4731]">
        Contraseña
        <input
          required
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 block min-h-12 w-full border border-[#D8CDBD] px-4 py-3 font-normal outline-[#3F8FB7]"
        />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="min-h-12 w-full bg-[#3F8FB7] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#28789f] disabled:opacity-60"
      >
        {submitting ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}

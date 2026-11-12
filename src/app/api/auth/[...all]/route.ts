import { toNextJsHandler } from "better-auth/next-js";
import { auth, isAuthConfigured } from "@/lib/auth";
import { isMySqlConfigured } from "@/lib/db";

function configurationError() {
  return Response.json(
    { error: "El acceso de administración no está configurado en el servidor." },
    { status: 503 },
  );
}

function handle(request: Request, method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE") {
  if (!isMySqlConfigured() || !isAuthConfigured() || !auth) return configurationError();
  return toNextJsHandler(auth)[method](request);
}

export const GET = (request: Request) => handle(request, "GET");
export const POST = (request: Request) => handle(request, "POST");
export const PATCH = (request: Request) => handle(request, "PATCH");
export const PUT = (request: Request) => handle(request, "PUT");
export const DELETE = (request: Request) => handle(request, "DELETE");

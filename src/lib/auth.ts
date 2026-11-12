import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { getMySqlPool, isMySqlConfigured } from "./db";

export const isAuthConfigured = () => Boolean(process.env.BETTER_AUTH_SECRET);

export const auth = isMySqlConfigured() && isAuthConfigured()
  ? betterAuth({
      database: getMySqlPool(),
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
      emailAndPassword: {
        enabled: true,
        disableSignUp: true,
      },
      plugins: [admin()],
    })
  : null;

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { db, schemaWithRelations } from "@repo/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schemaWithRelations,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      companyId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  experimental: {
    joins: true,
  },
  plugins: [nextCookies()],
});

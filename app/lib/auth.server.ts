import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    debugLogs: true,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  rateLimit: {
    enabled: true,
    customRules: {
      "/login": {
        window: 60 * 1000,
        max: 5,
      },
    },
    storage: "database",
  },
});

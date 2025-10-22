import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy, username } from "better-auth/plugins";
import { Resend } from "resend";
import * as authSchema from "~/server/db/schema/auth-schema";
import { db } from "~/server/db";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
  resendApiKey: string | undefined;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: authSchema,
      camelCase: true,
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "user",
          input: false,
          required: true,
          returned: true,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        const resend = new Resend(options.resendApiKey);
        try {
          const { error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: user.email,
            subject: "Reset your password - Odysseat",
            html: `
              <h2>Password Reset Request</h2>
              <p>Click the link below to reset your password:</p>
              <a href="${url}">Reset Password</a>
            `,
          });

          if (error) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: error.message,
            });
          }
        } catch (error) {
          throw error; // Re-throw to let BetterAuth handle it
        }
      },
    },
    plugins: [
      username(),
      oAuthProxy({
        /**
         * Auto-inference blocked by https://github.com/better-auth/better-auth/pull/2891
         */
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
    ],
    // trustedOrigins: ["expo://"],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];

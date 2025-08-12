import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth, oAuthProxy } from "better-auth/plugins";

import { db } from "~/server/db";

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      genericOAuth({
        config: [
          {
            providerId: "cognito",
            clientId: "",
            clientSecret: "",
            discoveryUrl: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_/.well-known/openid-configuration",
            authorizationUrl: "https://ap-southeast-2.auth.ap-southeast-2.amazoncognito.com/authorize",
            responseType: 'code',
            scopes: ['email', 'phone', 'openid', 'profile'],
          }
        ]
      }),
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

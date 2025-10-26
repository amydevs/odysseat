import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { initAuth } from "~/server/auth";

import { env } from "~/env";

let baseUrl: string = "http://localhost:3000";

try {
  baseUrl = new URL(env.BASE_URL ?? "").href;
} catch (error) {
  console.error(`Invalid base URL: ${env.BASE_URL}, using default localhost URL instead.`);
}

export const auth = initAuth({
  baseUrl,
  productionUrl: `https://turbo.t3.gg`,
  secret: env.AUTH_SECRET,
  resendApiKey: env.RESEND_API_KEY,
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

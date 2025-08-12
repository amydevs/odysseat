import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { initAuth } from "~/server/auth";

import { env } from "~/env";

const baseUrl = "http://localhost:3000";

export const auth = initAuth({
  baseUrl,
  productionUrl: `https://turbo.t3.gg`,
  secret: env.AUTH_SECRET,
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

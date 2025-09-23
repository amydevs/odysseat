import { env } from "~/env";
import { initAuth } from "~/server/auth";

export const auth = initAuth({
  baseUrl: "",
  productionUrl: "",
  secret: env.AUTH_SECRET,
});
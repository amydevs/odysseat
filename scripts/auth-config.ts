import { initAuth } from "~/server/auth";

export const auth = initAuth({
  baseUrl: "",
  productionUrl: "",
  secret: "",
});
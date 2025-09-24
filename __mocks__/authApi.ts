import { vi, type Mock } from "vitest";
import { initAuth } from "~/server/auth";

export const auth = initAuth({
  baseUrl: "",
  productionUrl: "",
  secret: "",
});

type AuthApi = typeof auth.api;

export function createAuthApiMock(obj?: {
  [K in keyof AuthApi]: Mock<AuthApi[K]>;
}) {
  return Object.fromEntries(
    Object.keys(auth.api).map((k) => [
      k,
      obj?.[k as keyof typeof obj] ?? vi.fn(),
    ]),
  ) as unknown as { [K in keyof AuthApi]: AuthApi[K] & Mock };
}

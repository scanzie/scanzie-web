import { authClient } from "@/lib/auth/client";
export type SessionData = typeof authClient.getSession extends (
  ...args: unknown[]
) => Promise<{ data: infer D }>
  ? D
  : never;

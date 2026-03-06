import { authClient } from "@/lib/auth/client";
type T = typeof authClient.getSession extends (...args: any) => Promise<{ data: infer D }> ? D : never;

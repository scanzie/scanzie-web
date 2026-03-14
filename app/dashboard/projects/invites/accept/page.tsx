"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/api/client";
import Link from "next/link";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AcceptProjectInvitePage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const accept = async () => {
      if (!token) {
        if (!mounted) return;
        setError("Missing invite token.");
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.post("/projects/invites/accept", { token });
        const data = res.data as { ok?: boolean; projectId?: string };
        if (!data?.ok) {
          throw new Error("Failed to accept invite");
        }
        toast.success("Invite accepted!");
        router.push("/dashboard/projects");
      } catch (err: unknown) {
        if (!mounted) return;
        const message =
          typeof err === "object" &&
          err != null &&
          "response" in err &&
          typeof (err as { response?: unknown }).response === "object" &&
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message
            ? (err as { response: { data: { message: string } } }).response.data
                .message
            : err instanceof Error
              ? err.message
              : "Unable to accept invite.";
        setError(message);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    accept();

    return () => {
      mounted = false;
    };
  }, [router, token]);

  return (
    <div className="min-h-screen relative bg-slate-50 flex items-center justify-center px-4">
      <SidebarTrigger className="absolute top-4 left-4 bg-blue-50 p-3 rounded-md md:hidden" />
      <div className="w-full max-w-md rounded-3xl bg-white border border-gray-100 shadow-sm p-8">
        <h1 className="text-xl font-semibold text-gray-900">Project invite</h1>
        {loading ? (
          <p className="mt-2 text-sm text-gray-600">Accepting invite…</p>
        ) : error ? (
          <>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <Link className="mt-4 inline-block text-sm underline text-blue-700" href="/dashboard/projects">
              Back to projects
            </Link>
          </>
        ) : (
          <p className="mt-2 text-sm text-gray-600">Redirecting…</p>
        )}
      </div>
    </div>
  );
}

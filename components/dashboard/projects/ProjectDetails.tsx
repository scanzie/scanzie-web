"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePlan } from "@/hooks/usePlan";
import type { ProjectPageData } from "@/lib/actions/projects";
import { Users, Mail, FolderOpen, Globe } from "lucide-react";

function resolveFaviconSrc(faviconUrl: unknown, pageUrl: unknown) {
  if (typeof faviconUrl !== "string" || faviconUrl.trim().length === 0) {
    return null;
  }

  try {
    const base =
      typeof pageUrl === "string" && pageUrl.trim().length > 0 ? pageUrl : undefined;
    return new URL(faviconUrl, base).toString();
  } catch {
    return null;
  }
}

export default function ProjectDetails({ data }: { data: ProjectPageData }) {
  const { limits, loading: planLoading } = usePlan();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const canInvite = limits?.canInvite === true && data.isOwner;
  const maxInvites = Number(limits?.maxInvitesPerProject ?? 0);

  const memberCount = useMemo(() => {
    // owner is included in the list; plan limit refers to invited members only
    const nonOwnerMembers = data.members.filter((m) => m.role !== "owner").length;
    return { total: data.members.length, invited: nonOwnerMembers };
  }, [data.members]);

  const inviteDisabled =
    planLoading ||
    !canInvite ||
    sending ||
    !email.trim() ||
    (Number.isFinite(maxInvites) && memberCount.invited >= maxInvites);

  const sendInvite = async () => {
    setSending(true);
    try {
      await apiClient.post(`/projects/${data.project.id}/invite`, {
        email: email.trim(),
      });
      toast("Invite sent!");
      setEmail("");
    } catch (err: unknown) {
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
            : "Failed to send invite";
      toast(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white border-b">
        <main className="dashboard-container">
          <div className="flex justify-between items-center bg-white border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {data.project.name}
                </h1>
                <p className="text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {memberCount.total} members
                  </span>
                </p>
              </div>
            </div>
            <SidebarTrigger className="bg-blue-50 p-3 rounded-md md:hidden" />
          </div>
        </main>
      </div>

      <main className="dashboard-container">
        <div className="p-6 space-y-8">
          <div>
            <Link
              href="/dashboard/projects"
              className="text-sm underline text-blue-700"
            >
              Back to projects
            </Link>
          </div>

          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Team</h2>
            <p className="mt-1 text-sm text-gray-500">
              Invite teammates (Pro/Business only).
            </p>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  className="pl-10 h-11 rounded-2xl"
                  disabled={!canInvite || sending}
                />
              </div>
              <Button
                className="h-11 rounded-2xl"
                onClick={sendInvite}
                disabled={inviteDisabled}
              >
                {sending ? "Sending…" : "Send invite"}
              </Button>
            </div>

            {!canInvite && (
              <p className="mt-3 text-xs text-gray-500">
                {data.isOwner
                  ? "Upgrade to Pro/Business to invite team members."
                  : "Only the project owner can invite team members."}
              </p>
            )}
            {canInvite && Number.isFinite(maxInvites) && (
              <p className="mt-3 text-xs text-gray-500">
                {memberCount.invited}/{maxInvites} invited members used.
              </p>
            )}

            <div className="mt-6 divide-y">
              {data.members.map((m) => (
                <div key={`${m.userId}-${m.role}`} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {m.name || m.email}
                    </p>
                    <p className="text-xs text-gray-500">{m.email}</p>
                  </div>
                  <span className="text-xs rounded-full border px-3 py-1 text-gray-700 bg-gray-50">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Analyses</h2>
            <p className="mt-1 text-sm text-gray-500">
              Recent analyses in this project.
            </p>

            {data.analyses.length === 0 ? (
              <div className="mt-4 text-sm text-gray-600">
                No analyses yet.{" "}
                <Link className="underline text-blue-700" href="/dashboard/analysis/new">
                  Start a new analysis
                </Link>
                .
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {data.analyses.map((a) => {
                  const faviconSrc = resolveFaviconSrc(a.on_page?.favicon?.url, a.url);
                  const displayTitle =
                    (a.on_page?.title?.text ?? "").trim() || a.title || "Untitled";

                  return (
                    <Link
                      key={a.id}
                      href={`/dashboard/analysis/${encodeURIComponent(a.url)}`}
                      className="flex gap-3 items-start rounded-xl border p-4 hover:border-blue-200 hover:bg-blue-50 transition"
                    >
                      {faviconSrc ? (
                        <Image
                          src={faviconSrc}
                          alt="Favicon"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-sm shrink-0"
                        />
                      ) : (
                        <Globe className="w-8 h-8 text-gray-700 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {displayTitle.length > 30 ? displayTitle.slice(0, 30) + "…" : displayTitle}
                        </p>
                        <p className="text-xs text-gray-500 break-all">{a.url}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

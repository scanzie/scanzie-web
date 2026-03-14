"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  Globe,
  Loader2Icon,
  Search,
  ShieldCheck,
  XIcon,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AnalysisProgress from "@/components/dashboard/analysis/AnalysisProgress";
import apiClient from "@/lib/api/client";
import { createProject, getUserProjects } from "@/lib/actions/projects";
import { usePlan } from "@/hooks/usePlan";

const FEATURE_PILLS = [
  { icon: ShieldCheck, label: "Technical SEO" },
  { icon: Zap, label: "Page Speed" },
  { icon: BarChart2, label: "On-Page Score" },
];

type ProjectListItem = { id: string; name: string; updatedAt: Date };

const isValidUrl = (value: string) => {
  try {
    if (value.includes(" ")) return false;
    const parsed = new URL(value);
    void parsed;
    return true;
  } catch {
    return false;
  }
};

export default function NewAnalysis() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const [progressOpen, setProgressOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [newProjectName, setNewProjectName] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);

  const { loading: planLoading, limits, usage, isFreePlan } = usePlan();

  const analysesUsed = usage?.analyses ?? 0;
  const analysesLimit = limits.maxAnalyses;
  const hasReachedAnalysisLimit =
    !planLoading && usage != null && analysesUsed >= analysesLimit;

  const canPickProject = useMemo(() => {
    return !isFreePlan && Number(limits?.maxProjects ?? 0) > 1;
  }, [isFreePlan, limits?.maxProjects]);

  useEffect(() => {
    if (!projectDialogOpen || projects.length > 0 || projectsLoading) return;
    let mounted = true;

    const load = async () => {
      setProjectsLoading(true);
      try {
        const rows = await getUserProjects();
        if (!mounted) return;
        setProjects(
          (rows ?? []).map((p) => ({
            id: p.id,
            name: p.name,
            updatedAt: new Date(p.updatedAt),
          })),
        );
      } finally {
        if (mounted) setProjectsLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [projectDialogOpen, projects.length, projectsLoading]);

  const startAnalysisDirect = async (payload: {
    url: string;
    projectId?: string | null;
  }) => {
    setLoading(true);
    try {
      setProgressOpen(true);
      const res = await apiClient.post("/analyze", payload);
      const data = await res.data;
      setSessionId(data.sessionId);
      setUserId(data.userId);
    } catch (err: unknown) {
      setProgressOpen(false);
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
            : "Failed to start analysis";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const startAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasReachedAnalysisLimit) {
      toast.error(
        `You have reached your maximum of ${analysesLimit} unique analyses on the ${
          isFreePlan ? "Free" : "current"
        } plan. Please upgrade to create more analyses.`,
      );
      return;
    }

    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    if (canPickProject) {
      setProjectDialogOpen(true);
      return;
    }

    await startAnalysisDirect({ url });
  };

  const createProjectInline = async () => {
    const name = newProjectName.trim();
    if (!name) return;

    setCreatingProject(true);
    try {
      const res = await createProject(name);
      if (!res.ok) {
        toast.error(res.message ?? "Failed to create project");
        return;
      }

      const now = new Date();
      setProjects((prev) => [{ id: res.projectId, name, updatedAt: now }, ...prev]);
      setSelectedProjectId(res.projectId);
      setNewProjectName("");
      toast.success("Project created");
    } finally {
      setCreatingProject(false);
    }
  };

  const startWithSelectedProject = async () => {
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    setProjectDialogOpen(false);
    await startAnalysisDirect({
      url,
      projectId: selectedProjectId ? selectedProjectId : null,
    });
  };

  return (
    <div className="min-h-screen relative bg-slate-50 flex items-center justify-center px-4">
      <SidebarTrigger className="absolute top-4 left-4 bg-blue-50 p-3 rounded-md md:hidden" />
      <div className="w-full max-w-xl space-y-8">
        <div className="rounded-3xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-gray-200">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Analyze your website&apos;s SEO
                </h2>
                <p className="text-sm text-gray-400">
                  Paste any URL and get a full SEO audit in seconds
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {FEATURE_PILLS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </span>
              ))}
            </div>

            <form onSubmit={startAnalysis} className="space-y-3">
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="https://yourwebsite.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 h-11 rounded-2xl border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-100 transition"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !url.trim() || hasReachedAnalysisLimit}
                className="w-full h-11 rounded-2xl text-white"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    Start Analysis
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {hasReachedAnalysisLimit && (
              <p className="text-xs text-red-600 mt-2 text-center">
                You&apos;ve used {analysesUsed}/{analysesLimit} unique analyses on
                your current plan.{" "}
                <Link href="/upgrade" className="underline font-medium text-red-700">
                  Upgrade
                </Link>{" "}
                to analyze more URLs.
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">
          Helpful Analysis Tips. &copy; 2026 Scanzie Inc.
        </p>
      </div>

      <AlertDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              <span>Choose a project</span>
              <XIcon
                onClick={() => setProjectDialogOpen(false)}
                className="h-9 w-9 p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"
              />
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-gray-700">URL</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-11 rounded-2xl"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-700">Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full h-11 rounded-2xl border border-gray-200 bg-white px-3 text-sm text-gray-800"
                disabled={projectsLoading}
              >
                <option value="">General (default)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {projectsLoading && (
                <p className="text-xs text-gray-500">Loading projects…</p>
              )}
              <p className="text-xs text-gray-500">
                You can have multiple projects with the same name.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <p className="text-sm font-medium text-gray-900">Create a project</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="h-11 rounded-2xl bg-white"
                  placeholder="e.g. Marketing site"
                />
                <Button
                  type="button"
                  className="h-11 rounded-2xl"
                  disabled={creatingProject || !newProjectName.trim()}
                  onClick={createProjectInline}
                >
                  {creatingProject ? "Creating…" : "Create"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => setProjectDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="rounded-2xl"
                onClick={startWithSelectedProject}
                disabled={loading || !url.trim()}
              >
                Start analysis
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={progressOpen} onOpenChange={setProgressOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              <span>SEO Analysis Progress</span>
              <XIcon
                onClick={() => setProgressOpen(false)}
                className="h-9 w-9 p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer"
              />
            </AlertDialogTitle>
          </AlertDialogHeader>

          {sessionId && userId ? (
            <AnalysisProgress sessionId={sessionId} userId={userId} url={url} />
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2Icon className="animate-spin h-32 w-32 text-blue-500 mt-4" />
              <p className="text-center text-gray-500 p-6">Preparing analysis…</p>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

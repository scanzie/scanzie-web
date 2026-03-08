"use client";

import { useRouter } from "next/navigation";
import {
  FolderPlus,
  FolderOpen,
  Calendar,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { formatDate } from "@/utils/general";
import { usePlan } from "@/hooks/usePlan";

interface ProjectCardProps {
  id: string;
  name: string;
  analysisCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  analysisCount,
  createdAt,
  updatedAt,
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/dashboard/projects/${id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          <FolderOpen className="w-6 h-6 text-blue-600" />
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
        {name}
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
          <span className="text-sm text-gray-600">Analyses</span>
          <span className="font-bold text-lg text-gray-900 group-hover:text-blue-700">
            {analysisCount}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 text-xs text-gray-500">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-3 h-3" />
          <span>Created {formatDate(new Date(createdAt))}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>Updated {formatDate(new Date(updatedAt))}</span>
        </div>
      </div>
    </div>
  );
};

interface AllProjectsProps {
  projects: Array<{
    id: string;
    name: string;
    analysisCount: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

const AllProjects: React.FC<AllProjectsProps> = ({ projects }) => {
  const { loading: planLoading, limits, usage } = usePlan();

  const projectsUsed = usage?.projects ?? projects.length;
  const projectLimit = limits.maxProjects;
  const atProjectLimit =
    !planLoading && Number.isFinite(projectLimit) && projectsUsed >= projectLimit;

  return (
    <div className="w-full mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <main className="dashboard-container">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                <p className="text-gray-600 mt-1">
                  Organize your SEO analyses into projects
                </p>
              </div>
              <Button
                className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={atProjectLimit}
              >
                <Plus className="w-5 h-5" />
                <span>New Project</span>
              </Button>
              <SidebarTrigger className="bg-blue-50 p-3 rounded-md md:hidden" />
            </div>
          </div>
        </main>
      </div>

      <main className="dashboard-container">
        <div className="px-6 py-10">
          {projects && projects.length > 0 ?
            <>
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Projects ({projects.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((proj) => (
                    <ProjectCard
                      key={proj.id}
                      id={proj.id}
                      name={proj.name}
                      analysisCount={proj.analysisCount}
                      createdAt={proj.createdAt}
                      updatedAt={proj.updatedAt}
                    />
                  ))}
                </div>
              </div>
            </>
          : <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <FolderPlus className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Projects Yet
              </h3>
              <p className="text-gray-500 text-center max-w-sm mb-6">
                Create your first project to organize your SEO analyses and keep
                everything in one place.
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={atProjectLimit}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Project
              </Button>
            </div>
          }
        </div>
      </main>
    </div>
  );
};

export default AllProjects;

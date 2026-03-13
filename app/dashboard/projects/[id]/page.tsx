import Link from "next/link";
import { getProjectPageData } from "@/lib/actions/projects";
import ProjectDetails from "@/components/dashboard/projects/ProjectDetails";

const ProjectPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: projectId } = await params;
  const data = await getProjectPageData(projectId);

  if (!data) {
    return (
      <div className="p-10">
        <p className="text-sm text-gray-700">Project not found.</p>
        <Link
          className="underline text-sm text-blue-700"
          href="/dashboard/projects"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  return <ProjectDetails data={data} />;
};

export default ProjectPage;

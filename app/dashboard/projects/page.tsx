import AllProjects from "@/components/dashboard/projects/AllProjects";
import { getUserProjects } from "@/lib/actions/projects";

const ProjectsPage = async () => {
  const projects = await getUserProjects();

  return (
    <AllProjects
      projects={projects.map((p) => ({
        ...p,
        analysisCount: Number(p.analysisCount) || 0,
      }))}
    />
  );
};

export default ProjectsPage;

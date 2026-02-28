import { Skeleton } from "@/components/ui/skeleton";

export const ProjectCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-5 h-5 rounded" />
      </div>

      <Skeleton className="h-6 w-3/4 mb-3" />

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-8" />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 rounded-full shrink-0" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 rounded-full shrink-0" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
};

export const ProjectsLoadingSkeleton = () => {
  return (
    <div className="w-full mx-auto bg-gray-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <main className="dashboard-container">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </div>
              <Skeleton className="hidden md:block h-10 w-32 rounded-md" />
            </div>
          </div>
        </main>
      </div>

      {/* Content Skeleton */}
      <main className="dashboard-container">
        <div className="px-6 py-10">
          <div className="mb-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

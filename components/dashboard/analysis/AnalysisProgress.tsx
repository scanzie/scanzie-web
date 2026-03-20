"use client";
import { useAnalysisProgress } from "@/hooks/useAnalysisProgress";
import { formatUrl } from "@/utils/general";
import { CheckIcon, Circle, XCircleIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import confetti from "canvas-confetti";

interface AnalysisProgressProps {
  sessionId: string;
  userId: string;
  url: string;
}

const fireConfetti = () => {
  const duration = 2200;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899"],
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  sessionId,
  userId,
  url,
}) => {
  const router = useRouter();
  const confettiFired = useRef(false);

  const { progress, error, isLoading } = useAnalysisProgress(
    userId,
    sessionId,
    url,
  );

  // Fire confetti once when analysis completes
  useEffect(() => {
    if (!progress?.jobs) return;

    const shouldRedirect =
      progress.status === "completed" ||
      (progress.jobs.some((job) => job.status === "completed") &&
        progress.jobs.every(
          (job) => job.status === "completed" || job.status === "failed",
        ));

    if (shouldRedirect) {
      if (!confettiFired.current) {
        confettiFired.current = true;
        fireConfetti();
      }

      // Redirect to analysis details page after a short delay for UX
      const timer = setTimeout(() => {
        window.location.href = `/dashboard/analysis/${encodeURIComponent(url)}`;
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [progress?.status, progress?.jobs, url, router]);

  if (isLoading && !progress) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-b-blue-500"></div>
        <p className="mt-4 text-gray-600">Starting analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No progress data available</p>
      </div>
    );
  }

  const isComplete =
    progress.status === "completed" ||
    (progress.jobs?.some((job) => job.status === "completed") &&
      progress.jobs?.every(
        (job) => job.status === "completed" || job.status === "failed",
      ));

  return (
    <div className="max-w-md mx-auto">
      <div className="grid gap-2 text-center mb-6">
        <p className="text-gray-600">
          {progress.overallProgress === 0
            ? "Kickoff phase is running"
            : isComplete
              ? "All checks completed successfully"
              : "Analysis is actively processing"}
        </p>
        <p className="text-sm p-2 rounded-full bg-gray-100 w-60 mx-auto">
          {formatUrl(url)}
        </p>
      </div>

      {/* Progress Circle */}
      <div className="flex justify-center mb-8">
        <div style={{ width: 120, height: 120 }}>
          <CircularProgressbar
            value={progress.overallProgress ? progress.overallProgress : 0}
            text={`${progress.overallProgress ? progress.overallProgress : 0}%`}
            styles={buildStyles({
              pathColor: isComplete ? "#10b981" : "#3b82f6",
              textColor: "#1f2937",
              trailColor: "#e5e7eb",
              backgroundColor: "#3b82f6",
            })}
          />
        </div>
      </div>

      {/* Job Status Cards */}
      <div className="space-y-4 mb-6">
        {progress.jobs &&
          progress.jobs.map((job) => (
            <div
              key={job.type}
              className={`mx-auto w-96 p-4 rounded-lg border transition-colors duration-300 ${
                job.status === "completed"
                  ? "bg-green-50 border-green-200"
                  : job.status === "processing"
                    ? "bg-yellow-50 border-yellow-200"
                    : job.status === "failed"
                      ? "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full mr-3 transition-colors duration-300 ${
                      job.status === "completed"
                        ? "bg-green-500"
                        : job.status === "failed"
                          ? "bg-red-500"
                          : job.status === "processing"
                            ? "bg-yellow-500"
                            : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="grid">
                    <span className="font-medium capitalize">
                      {job.type.replace("-", " ")}
                    </span>
                    {job.error && (
                      <p className="text-xs text-red-600">
                        {job.error.length > 50
                          ? `${job.error.substring(0, 50)}...`
                          : job.error.length}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {job.status === "processing" && (
                    <div className="flex items-center">
                      <Circle className="text-yellow-500 mr-2" />
                      <span className="text-sm text-yellow-600">
                        {job.progress}%
                      </span>
                    </div>
                  )}
                  {job.status === "completed" && (
                    <CheckIcon className="text-green-600" />
                  )}
                  {job.status === "failed" && (
                    <XCircleIcon className="text-red-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {isComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center animate-in fade-in duration-500">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-green-800">
              Analysis complete! Redirecting…
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisProgress;

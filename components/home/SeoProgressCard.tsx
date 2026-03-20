"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { gsap } from "gsap";

export type SeoStageStatus = "done" | "in-progress" | "pending";

export type SeoStage = {
  label: string;
  status: SeoStageStatus;
  progress?: number;
};

type SeoProgressCardProps = {
  title?: string;
  subtitle?: string;
  url?: string;
  progress?: number; // 0 - 100
  stages?: SeoStage[];
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  animateOnMount?: boolean;
};

const DEFAULT_STAGES: SeoStage[] = [
  { label: "On Page", status: "done", progress: 100 },
  { label: "Content", status: "in-progress", progress: 70 },
  { label: "Technical", status: "pending", progress: 0 },
];

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value));

const getStatusStyles = (status: SeoStageStatus) => {
  if (status === "done") {
    return {
      card: "bg-emerald-50 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-300",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      ring: "#10b981",
      ringTrack: "#d1fae5",
    };
  }

  if (status === "in-progress") {
    return {
      card: "bg-amber-50 border-amber-100 hover:bg-amber-100 hover:border-amber-300",
      dot: "bg-amber-400",
      text: "text-amber-700",
      ring: "#f59e0b",
      ringTrack: "#fde68a",
    };
  }

  return {
    card: "bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-300",
    dot: "bg-slate-400",
    text: "text-slate-600",
    ring: "#94a3b8",
    ringTrack: "#e2e8f0",
  };
};

const ProgressMiniRing = ({
  progress,
  color,
  trackColor,
}: {
  progress: number;
  color: string;
  trackColor: string;
}) => {
  const miniRadius = 8;
  const miniCircumference = 2 * Math.PI * miniRadius;
  const miniOffset =
    miniCircumference - (clamp(progress) / 100) * miniCircumference;

  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" aria-hidden="true">
      <circle
        cx="10"
        cy="10"
        r={miniRadius}
        fill="none"
        stroke={trackColor}
        strokeWidth="2.5"
      />
      <circle
        cx="10"
        cy="10"
        r={miniRadius}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={miniCircumference}
        strokeDashoffset={miniOffset}
        className="-rotate-90 origin-center"
      />
    </svg>
  );
};

const SeoProgressCard = ({
  title = "SEO Analysis Progress",
  subtitle = "Your SEO analysis is in progress",
  url = "https://ma...m/afl",
  progress = 70,
  stages = DEFAULT_STAGES,
  className = "",
  showCloseButton = true,
  onClose,
  animateOnMount = true,
}: SeoProgressCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(true);

  const safeProgress = clamp(progress);
  const progressOffset = CIRCUMFERENCE - (safeProgress / 100) * CIRCUMFERENCE;

  const normalizedStages = useMemo(
    () =>
      stages.map((stage) => ({
        ...stage,
        progress:
          stage.progress ??
          (stage.status === "done"
            ? 100
            : stage.status === "in-progress"
              ? Math.max(1, Math.round(safeProgress * 0.4))
              : 0),
      })),
    [stages, safeProgress],
  );

  useEffect(() => {
    if (!mounted) return;

    if (!animateOnMount) {
      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDashoffset =
          String(progressOffset);
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${safeProgress}%`;
      }
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(cardRef.current, { opacity: 0, y: 34, scale: 0.975 });
    gsap.set(progressCircleRef.current, { strokeDashoffset: CIRCUMFERENCE });
    gsap.set(rowsRef.current.filter(Boolean), { opacity: 0, x: -18 });

    tl.to(cardRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
    })
      .to(
        progressCircleRef.current,
        {
          strokeDashoffset: progressOffset,
          duration: 1.35,
          ease: "power2.inOut",
        },
        "-=0.25",
      )
      .to(
        { value: 0 },
        {
          value: safeProgress,
          duration: 1.35,
          ease: "power2.inOut",
          onUpdate() {
            const value = (this.targets()[0] as { value: number }).value;
            if (percentRef.current) {
              percentRef.current.textContent = `${Math.round(value)}%`;
            }
          },
        },
        "<",
      )
      .to(
        rowsRef.current.filter(Boolean),
        {
          opacity: 1,
          x: 0,
          duration: 0.42,
          stagger: 0.12,
        },
        "-=0.55",
      );
  }, [animateOnMount, mounted, progressOffset, safeProgress]);

  if (!mounted) return null;

  const handleClose = () => {
    if (onClose) onClose();
    setMounted(false);
  };

  return (
    <div
      ref={cardRef}
      className={[
        "relative mx-auto w-full max-w-sm sm:max-w-md select-none rounded-2xl border-2 border-gray-200 bg-white px-5 py-6 sm:px-8 sm:py-8",
        "shadow-[0_8px_40px_#eee] transition-all duration-300",
        "hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_16px_56px_#ccc]",
        className,
      ].join(" ")}
    >
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
          {title}
        </h3>

        {showCloseButton && (
          <button
            aria-label="Close"
            onClick={handleClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800 active:scale-90"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <p className="mb-3 mt-2 text-center text-sm text-gray-400">{subtitle}</p>

      <div className="mb-5 flex justify-center">
        <div className="max-w-full truncate rounded-full bg-gray-100 px-5 py-1.5 font-mono text-sm tracking-tight text-gray-500 shadow-inner">
          {url}
        </div>
      </div>

      <div className="mb-7 flex justify-center">
        <div className="relative h-28 w-28 sm:h-32 sm:w-32">
          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 128 128"
            aria-hidden="true"
          >
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            <circle
              ref={progressCircleRef}
              cx="64"
              cy="64"
              r={RADIUS}
              fill="none"
              stroke="url(#seoProgressBlueGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
            />
            <defs>
              <linearGradient
                id="seoProgressBlueGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span
              ref={percentRef}
              className="text-2xl font-bold text-gray-800 sm:text-3xl"
            >
              0%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {normalizedStages.map((stage, idx) => {
          const styles = getStatusStyles(stage.status);
          const stageProgress = clamp(stage.progress ?? 0);

          return (
            <div
              key={`${stage.label}-${idx}`}
              ref={(el) => {
                rowsRef.current[idx] = el;
              }}
              className={[
                "flex cursor-default items-center justify-between rounded-xl border px-4 py-3 transition-all duration-200 hover:shadow-sm",
                styles.card,
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-3.5 w-3.5 shrink-0 rounded-full shadow-sm ${styles.dot}`}
                />
                <span className="text-sm font-semibold text-gray-800 sm:text-base">
                  {stage.label}
                </span>
              </div>

              {stage.status === "done" ? (
                <Check
                  size={18}
                  strokeWidth={2.5}
                  className="shrink-0 text-emerald-500"
                />
              ) : (
                <div className="flex shrink-0 items-center gap-1.5">
                  <ProgressMiniRing
                    progress={stageProgress}
                    color={styles.ring}
                    trackColor={styles.ringTrack}
                  />
                  <span className={`text-sm font-semibold ${styles.text}`}>
                    {stageProgress}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeoProgressCard;

"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Analysis } from "../analysis/AllUserAnalysis";
import {
  AlertTriangle,
  Code,
  Eye,
  FileText,
  X,
} from "lucide-react";
import Image from "next/image";
import { formatUrl } from "@/utils/general";

const getRingColor = (score: number) =>
  score >= 70 ? "#22c55e"
  : score >= 40 ? "#f59e0b"
  : "#ef4444";

const getTagBg = (score: number) =>
  score >= 70 ? "bg-green-50 text-green-700"
  : score >= 40 ? "bg-amber-50 text-amber-700"
  : "bg-red-50 text-red-700";

const getBarWidth = (score: number) => `${Math.min(Math.max(score, 0), 100)}%`;

/* ─── mini radial-progress via SVG ────────────────────── */
const RadialScore = ({
  score,
  size = 64,
}: {
  score: number;
  size?: number;
}) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = getRingColor(score);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={6}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
};

/* ─── score row ────────────────────────────────────────── */
const ScoreRow = ({ label, score }: { label: string; score: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500 font-medium">{label}</span>
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getTagBg(score)}`}
      >
        {score}
      </span>
    </div>
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: getBarWidth(score),
          backgroundColor: getRingColor(score),
        }}
      />
    </div>
  </div>
);

/* ─── card ─────────────────────────────────────────────── */
const Card = ({
  icon,
  title,
  score,
  scoreLabel,
  children,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  score: number;
  scoreLabel?: string;
  children: React.ReactNode;
  accent?: string;
}) => (
  <div className="bg-white rounded-2xl border p-5 duration-200 flex flex-col gap-4">
    {/* header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent ?? "bg-blue-50 text-blue-600"}`}
        >
          {icon}
        </div>
        <span className="font-semibold text-gray-800 ">{title}</span>
      </div>
      <div className="relative flex items-center justify-center">
        <RadialScore score={score} size={52} />
        <span className="absolute text-xs font-bold text-gray-700">
          {scoreLabel ?? score}
        </span>
      </div>
    </div>
    {/* rows */}
    <div className="space-y-3">{children}</div>
  </div>
);

/* ─── main component ───────────────────────────────────── */
const ScoreBreakdownDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: Analysis | null;
}> = ({ open, onOpenChange, analysis }) => {
  if (!analysis) return null;

  const onPageScore = Math.round(
    ((analysis.on_page?.title?.score || 0) +
      (analysis.on_page?.headings?.score || 0) +
      (analysis.on_page?.links?.score || 0) +
      (analysis.on_page?.images?.score || 0)) /
      4,
  );

  const totalIssues =
    (analysis.technical?.issues?.length || 0) +
    (analysis.content?.issues?.length || 0);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="overflow-hidden h-[500px] bg-gray-50 rounded-3xl max-w-2xl p-0 border border-gray-200 shadow-2xl ">
        {/* ── top bar ── */}
        <AlertDialogHeader className="fixed z-20 top-0 left-0 right-0 px-6 pt-5 pb-4 bg-white border-b border-gray-100">
          <AlertDialogTitle className=" bg-white z-10 flex items-center justify-between m-0">
            <div className="flex items-center gap-3">
              <Image
                src={analysis.on_page.favicon.url}
                alt="Favicon"
                width={32}
                height={32}
              />
              <div>
                <p className="font-bold text-gray-900 text-base leading-tight">
                  {analysis.on_page.title ? analysis.on_page.title.text.length > 30
                    ? analysis.on_page.title.text.slice(0, 27) + "..."
                    : analysis.on_page.title.text : "Untitled"}
                </p>
                <p className="text-xs text-gray-400 font-normal">
                  {formatUrl(analysis.url)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </AlertDialogTitle>
        </AlertDialogHeader>

        {/* ── body ── */}
        <div className="h-auto overflow-hidden overflow-y-scroll px-6 pt-24 pb-10 grid grid-cols-1 sm:grid-cols-1 gap-4">
          {/* Technical SEO */}
          <Card
            icon={<Code className="w-4 h-4" />}
            title="Technical SEO"
            score={analysis.technical?.score || 0}
            accent="bg-gray-50 text-gray-600"
          >
            <ScoreRow
              label="Page Speed"
              score={analysis.technical?.pageSpeed?.score || 0}
            />
            <ScoreRow label="Mobile" score={analysis.technical?.mobile?.score || 0} />
            <ScoreRow label="SSL" score={analysis.technical?.ssl?.score || 0} />
          </Card>

          {/* On-Page SEO */}
          <Card
            icon={<Eye className="w-4 h-4" />}
            title="On-Page SEO"
            score={onPageScore}
            accent="bg-gray-50 text-gray-600"
          >
            <ScoreRow label="Title" score={analysis.on_page?.title?.score || 0} />
            <ScoreRow
              label="Headings"
              score={analysis.on_page?.headings?.score || 0}
            />
            <ScoreRow label="Images" score={analysis.on_page?.images?.score || 0} />
          </Card>

          {/* Content Quality */}
          <Card
            icon={<FileText className="w-4 h-4" />}
            title="Content Quality"
            score={analysis.content?.score || 0}
            accent="bg-gray-50 text-gray-600"
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Word Count</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-50 text-gray-700">
                {analysis.content?.wordCount || 0}
              </span>
            </div>
            <ScoreRow
              label="Quality"
              score={analysis.content?.contentQuality?.score || 0}
            />
            <ScoreRow
              label="Readability"
              score={analysis.content?.readabilityScore || 0}
            />
          </Card>

          {/* Issues Found */}
          <Card
            icon={<AlertTriangle className="w-4 h-4" />}
            title="Issues Found"
            score={totalIssues > 0 ? Math.max(0, 100 - totalIssues * 8) : 100}
            scoreLabel={String(totalIssues)}
            accent="bg-orange-50 text-orange-500"
          >
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Technical</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full  ${
                    analysis.technical?.issues?.length ?
                      "bg-orange-50 text-orange-600 "
                    : "bg-green-50 text-green-600"
                  }`}
                >
                  {analysis.technical?.issues?.length || 0}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-400"
                  style={{
                    width: `${Math.min((analysis.technical?.issues?.length || 0) * 10, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Content</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full  ${
                    analysis.content?.issues?.length ?
                      "bg-orange-50 text-orange-600"
                    : "bg-green-50 text-green-600 "
                  }`}
                >
                  {analysis.content?.issues?.length || 0}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-400"
                  style={{
                    width: `${Math.min((analysis.content?.issues?.length || 0) * 10, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Broken Links</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    analysis.on_page?.links?.broken ?
                      "bg-red-50 text-red-600 "
                    : "bg-green-50 text-green-600 "
                  }`}
                >
                  {analysis.on_page?.links?.broken || 0}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-400"
                  style={{
                    width: `${Math.min((analysis.on_page?.links?.broken || 0) * 10, 100)}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ScoreBreakdownDialog;

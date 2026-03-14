"use client";

import Twitter from "@/components/icons/Twitter";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Facebook,
  XIcon,
  Globe,
  Sparkles,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_TESTIMONIAL =
  "Hey guys👋 \n\nHave u heard of Scanzie? OMG It's a really cool product. \nI love using Scanzie because it helps me analyse my website SEO and gives me improvement recommendations! \n\nGo try out Scanzie today - https://scanzie.vercel.app";

const ShareScanzie: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<"compose" | "platforms">("compose");
  const [testimonial, setTestimonial] = useState(DEFAULT_TESTIMONIAL);

  const handleShare = () => {
    if (!testimonial.trim()) return;
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Check out Scanzie!",
          text: testimonial,
          url: window.location.origin,
        })
        .catch(console.error);
    } else {
      const text = `${testimonial} ${window.location.origin}`;
      navigator.clipboard.writeText(text).then(() => {
        toast.info("Copied to clipboard! You can now paste and share.");
      });
    }
    onOpenChange(false);
  };

  const handleFacebookShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(testimonial).catch(() => {});
    }
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.origin,
    )}&quote=${encodeURIComponent(testimonial || "Check out Scanzie!")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      testimonial || "Check out Scanzie!",
    )}\n\n@fisayocoder`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => setStep("compose"), 300);
  };

  const charCount = testimonial.length;
  const maxChars = 280;
  const isOverLimit = charCount > maxChars;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white rounded-3xl max-w-lg w-full p-0 border border-gray-100 shadow-2xl overflow-hidden">
        {/* Decorative li bar at top */}
        <div className="h-1.5 w-full bg-li-to-r from-green-400 via-emerald-400 to-teal-400" />

        <div className="p-6 space-y-5">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border ">
                  <Share2 className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-base font-semibold text-gray-900">
                  Share Scanzie
                </span>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </AlertDialogTitle>
          </AlertDialogHeader>

          {step === "compose" ?
            <div className="space-y-5">
              {/* Prompt */}
              <div className="rounded-2xl bg-linear-to-br from-blue-50 to-gray-50 border border-blue-100 p-4 flex gap-3 items-start">
                <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Enjoying Scanzie?
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tell your network what you love about it. Your review helps
                    others discover better SEO tools.
                  </p>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <Textarea
                  placeholder="I love using Scanzie because..."
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  className="w-full h-40 overflow-x-hidden overflow-y-scroll resize-none rounded-2xl border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-100 p-4 pr-4 pb-8 transition"
                />
                {/* Char counter */}
                <span
                  className={`absolute bottom-3 right-4 text-xs font-medium transition ${
                    isOverLimit ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  {charCount}/{maxChars}
                </span>
              </div>

              {/* CTA */}
              <Button
                onClick={() => setStep("platforms")}
                disabled={!testimonial.trim() || isOverLimit}
                className="w-full h-11 rounded-2xl text-white font-semibold shadow-md transition"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Continue to Share
              </Button>
            </div>
          : <div className="space-y-4">
              {/* Back */}
              <button
                onClick={() => setStep("compose")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition rounded-xl px-2 py-1 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Edit message</span>
              </button>

              {/* Preview pill */}
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-3 max-h-24 overflow-y-auto">
                <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">
                  {testimonial}
                </p>
              </div>

              {/* Platform buttons */}
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Choose a platform
              </p>

              <div className="space-y-2">
                {/* Facebook */}
                <button
                  onClick={handleFacebookShare}
                  className="cursor-pointer group w-full flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 text-left transition hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                    <Facebook className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">
                      Share on Facebook
                    </p>
                    <p className="text-xs text-gray-400">
                      Post to your timeline or story
                    </p>
                  </div>
                  <ArrowLeft className="ml-auto h-4 w-4 rotate-180 text-gray-300 group-hover:text-blue-400 transition" />
                </button>

                {/* X / Twitter */}
                <button
                  onClick={handleTwitterShare}
                  className="cursor-pointer group w-full flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 text-left transition hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black shadow-sm">
                    <Twitter />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">
                      Share on X (Twitter)
                    </p>
                    <p className="text-xs text-gray-400">
                      Tweet to your followers
                    </p>
                  </div>
                  <ArrowLeft className="ml-auto h-4 w-4 rotate-180 text-gray-300 group-hover:text-gray-500 transition" />
                </button>

                {/* Other */}
                <button
                  onClick={handleShare}
                  className="cursor-pointer group w-full flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 text-left transition hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm"
                >
                  <div className="border flex h-9 w-9 items-center justify-center rounded-xl bg-li-to-br from-green-400 to-emerald-500 shadow-sm">
                    <Globe className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700">
                      Other platforms
                    </p>
                    <p className="text-xs text-gray-400">
                      Copy link or use system share
                    </p>
                  </div>
                  <ArrowLeft className="ml-auto h-4 w-4 rotate-180 text-gray-300 group-hover:text-emerald-400 transition" />
                </button>
              </div>
            </div>
          }
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ShareScanzie;

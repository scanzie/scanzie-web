import { cn } from "@/lib/utils";

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
  className?: string;
}

export function BillingToggle({
  isYearly,
  onToggle,
  className,
}: BillingToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center p-1 bg-gray-100/80 rounded-full border border-gray-200/50 shadow-inner",
        className,
      )}
    >
      <button
        onClick={() => onToggle(false)}
        className={cn(
          "relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ease-in-out cursor-pointer",
          !isYearly
            ? "text-gray-900 bg-white shadow-sm ring-1 ring-black/5"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50",
        )}
      >
        Monthly
      </button>

      <button
        onClick={() => onToggle(true)}
        className={cn(
          "relative flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ease-in-out cursor-pointer",
          isYearly
            ? "text-gray-900 bg-white shadow-sm ring-1 ring-black/5"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50",
        )}
      >
        Yearly
        <span
          className={cn(
            "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full",
            isYearly ? "bg-blue-100 text-blue-700" : "bg-blue-50 text-blue-600",
          )}
        >
          20% Free
        </span>
      </button>
    </div>
  );
}

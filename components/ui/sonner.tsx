"use client";

import type { CSSProperties } from "react";
import { useTheme } from "next-themes";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { Toaster as Sonner, ToasterProps } from "sonner";

const DEFAULT_TOAST_DURATION_MS = 4000;

const Toaster = ({
  className,
  toastOptions,
  style,
  duration,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme();

  const mergedToastOptions: ToasterProps["toastOptions"] = {
    ...toastOptions,
    duration: toastOptions?.duration ?? DEFAULT_TOAST_DURATION_MS,
    style: {
      fontFamily: "inherit",
      ...toastOptions?.style,
    },
    classNames: {
      title: "font-medium",
      description: "text-muted-foreground",
      success: "border-l-4 border-l-blue-600 dark:border-l-blue-400",
      error: "border-l-4 border-l-red-600 dark:border-l-red-400",
      ...toastOptions?.classNames,
    },
  };

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={["toaster group", className].filter(Boolean).join(" ")}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "fontFamily": "Geom",
          ...style,
        } as CSSProperties
      }
      duration={duration ?? DEFAULT_TOAST_DURATION_MS}
      toastOptions={mergedToastOptions}
      icons={{
        success: (
          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        ),
        error: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
        info: <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />,
      }}
      {...props}
    />
  );
};

export { Toaster };

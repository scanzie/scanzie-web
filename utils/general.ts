

export type FormatDateStyle = "relative" | "long";

export const formatDate = (
  date: Date | string | null | undefined,
  options?: { style?: FormatDateStyle },
): string => {
  if (!date) return "—";

  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "—";

  const style = options?.style ?? "relative";
  if (style === "long") {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();

  // If date is in the future, fall back to a stable absolute format.
  if (diffMs < 0) {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (years < 5) return `${years} year${years > 1 ? "s" : ""} ago`;

  return "a long time ago";
};

export const formatUrl = (url: string): string => {
  if (url.length <= 28) return url;

  const start = url.slice(0, 10); 
  const end = url.slice(-5); 

  return `${start}...${end}`;
};

export const formatAmount = (amountKobo: number | null | undefined) => {
  if (typeof amountKobo !== "number") return "—";
  return `₦${(amountKobo / 100).toLocaleString()}`;
};

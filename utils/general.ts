export const getInitials = (name: string | undefined) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  const firstTwo = words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase());
  return firstTwo.join("");
};

export const formatDate = (date: Date | string): string => {
  const now = new Date();
  const dateObj = new Date(date);
  const diffMs = now.getTime() - dateObj.getTime();

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

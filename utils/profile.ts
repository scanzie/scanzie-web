export const getProviderName = (provider: string) => {
  switch (provider?.toLowerCase()) {
    case "github":
      return "GitHub";
    case "google":
      return "Google";
    default:
      return provider || "Unknown";
  }
};

export const getInitials = (name: string | undefined) => {
  if (!name) return "";
  const words = name.trim().split(" ");
  const firstTwo = words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase());
  return firstTwo.join("");
};
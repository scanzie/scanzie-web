import "server-only";

type NotifyOptions = {
  path: string;
  body: unknown;
};

export async function notifyAnalyzerApi({ path, body }: NotifyOptions) {
  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
  const key = (process.env.INTERNAL_API_KEY || "").trim();

  if (!base || !key) return;

  try {
    await fetch(`${base}/api/notifications${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": key,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Failed to notify analyzer API:", err);
  }
}


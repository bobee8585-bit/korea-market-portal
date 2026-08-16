export const dynamic = "force-dynamic";

export function GET() {
  const lines: string[] = [];
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
  const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  if (adsenseEnabled && /^ca-pub-\d+$/.test(adsenseClient)) {
    lines.push(`google.com, ${adsenseClient.replace("ca-", "")}, DIRECT, f08c47fec0942fa0`);
  }

  if (!lines.length) lines.push("# No programmatic advertising inventory is active.");
  return new Response(lines.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}

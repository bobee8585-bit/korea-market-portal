import { directCampaigns, type SponsorPlacement } from "@/lib/monetization";

export const dynamic = "force-dynamic";

const placements = new Set<SponsorPlacement>(["home-inline", "site-footer", "industry-inline", "newsletter"]);
const events = new Set(["impression", "click"] as const);

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!payload || typeof payload !== "object") return Response.json({ error: "invalid_event" }, { status: 400 });

  const value = payload as Record<string, unknown>;
  const campaignId = typeof value.campaignId === "string" ? value.campaignId : "";
  const placement = typeof value.placement === "string" ? value.placement as SponsorPlacement : null;
  const event = value.event === "impression" || value.event === "click" ? value.event : null;
  const page = typeof value.page === "string" && /^\/[a-zA-Z0-9/_-]*$/.test(value.page) ? value.page.slice(0, 180) : null;
  const campaign = directCampaigns().find((item) => item.id === campaignId);

  if (!campaign || !placement || !placements.has(placement) || !campaign.placements.includes(placement) || !event || !events.has(event) || !page) {
    return Response.json({ error: "invalid_event" }, { status: 400 });
  }

  console.info("sponsor_event", JSON.stringify({ campaignId, placement, event, page, recordedAt: new Date().toISOString() }));
  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
}

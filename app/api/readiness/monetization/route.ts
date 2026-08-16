import { enabledProviders, revenueStages } from "@/lib/monetization";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    status: "ok",
    currentStage: 1,
    activeProviders: enabledProviders(),
    externalAdvertisingActive: enabledProviders().some((provider) => provider !== "direct"),
    stages: revenueStages,
    safeguards: {
      policyPages: true,
      editorialSeparation: true,
      adsTxt: true,
      privacySafeDirectMeasurement: true,
      protectedSponsorReporting: true,
      consentRequiredBeforePersonalisedAds: true,
    },
    checkedAt: new Date().toISOString(),
  });
}

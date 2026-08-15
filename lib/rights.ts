export type RightsType =
  | "OFFICIAL_OPEN_DATA"
  | "LICENSED"
  | "METADATA_ONLY"
  | "LINK_ONLY"
  | "BLOCKED";

export type RightsAction =
  | "DISPLAY_TITLE"
  | "DISPLAY_EXCERPT"
  | "STORE"
  | "TRANSLATE"
  | "AI_ANALYZE"
  | "CACHE"
  | "DISPLAY_IMAGE";

export type RightsPolicy = {
  rightsType: RightsType;
  active: boolean;
  canShowTitle: boolean;
  canShowExcerpt: boolean;
  canStore: boolean;
  canTranslate: boolean;
  canAnalyze: boolean;
  canCache: boolean;
  canShowImage: boolean;
  licenseEnd?: Date | null;
};

export function canProcessContent(policy: RightsPolicy, action: RightsAction, now = new Date()): boolean {
  if (!policy.active || policy.rightsType === "BLOCKED") return false;
  if (policy.licenseEnd && policy.licenseEnd.getTime() < now.getTime()) return false;

  switch (action) {
    case "DISPLAY_TITLE": return policy.canShowTitle;
    case "DISPLAY_EXCERPT": return policy.canShowExcerpt;
    case "STORE": return policy.canStore;
    case "TRANSLATE": return policy.canTranslate;
    case "AI_ANALYZE": return policy.canAnalyze;
    case "CACHE": return policy.canCache;
    case "DISPLAY_IMAGE": return policy.canShowImage;
    default: return false;
  }
}

export function assertContentPermission(policy: RightsPolicy, action: RightsAction): void {
  if (!canProcessContent(policy, action)) {
    throw new Error(`RIGHTS_DENIED:${action}`);
  }
}

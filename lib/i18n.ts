/**
 * MVP language contract.
 *
 * English is the only published locale. Korean is reserved in the type and
 * route plan so it can be added later without changing stored identifiers,
 * API field names, or canonical English URLs.
 */
export const defaultLocale = "en" as const;
export const publishedLocales = [defaultLocale] as const;
export const plannedLocales = [defaultLocale, "ko"] as const;

export type PublishedLocale = (typeof publishedLocales)[number];
export type PlannedLocale = (typeof plannedLocales)[number];

export const localePlan: Readonly<Record<PlannedLocale, { published: boolean; pathPrefix: string }>> = {
  en: { published: true, pathPrefix: "" },
  ko: { published: false, pathPrefix: "/ko" },
};

export function isPublishedLocale(value: string): value is PublishedLocale {
  return publishedLocales.includes(value as PublishedLocale);
}

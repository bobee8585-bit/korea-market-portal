import { NextRequest, NextResponse } from "next/server";
import {
  DealStatus,
  EvidenceStatus,
  ExternalContentType,
  GlobalEventType,
  RightsType,
} from "@prisma/client";
import { db } from "@/lib/db";
import { isAuthorizedInternalRequest } from "@/lib/internal-auth";
import { assertSafeForPublication } from "@/lib/ai-safety";

function parseDate(value: unknown, field: string) {
  if (typeof value !== "string") throw new Error(`INVALID_${field.toUpperCase()}`);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`INVALID_${field.toUpperCase()}`);
  return date;
}

function requireHttpUrl(value: unknown, field: string) {
  if (typeof value !== "string") throw new Error(`INVALID_${field.toUpperCase()}`);
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error(`INVALID_${field.toUpperCase()}`);
  return parsed.toString();
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const kind = body.kind as string;

    if (kind === "external-link") {
      const title = String(body.title ?? "").trim();
      if (!title) throw new Error("TITLE_REQUIRED");
      assertSafeForPublication(title);

      const rightsType = (body.rightsType ?? RightsType.LINK_ONLY) as RightsType;
      const translationAllowed = Boolean(body.translationAllowed);
      const analysisAllowed = Boolean(body.analysisAllowed);
      if (rightsType === RightsType.LINK_ONLY && (translationAllowed || analysisAllowed)) {
        throw new Error("LINK_ONLY_CANNOT_TRANSLATE_OR_ANALYZE");
      }

      const translatedTitle = body.translatedTitle ? String(body.translatedTitle).trim() : null;
      if (translatedTitle) {
        if (!translationAllowed) throw new Error("TRANSLATION_NOT_ALLOWED");
        assertSafeForPublication(translatedTitle);
      }

      const record = await db.externalContentLink.upsert({
        where: { originalUrl: requireHttpUrl(body.originalUrl, "originalUrl") },
        update: {
          contentType: body.contentType as ExternalContentType,
          sourceName: String(body.sourceName),
          sourceCountry: body.sourceCountry ? String(body.sourceCountry).toUpperCase() : null,
          title,
          translatedTitle,
          language: String(body.language ?? "en"),
          targetLanguage: body.targetLanguage ? String(body.targetLanguage) : null,
          publishedAt: body.publishedAt ? parseDate(body.publishedAt, "publishedAt") : null,
          companyIdentifier: body.companyIdentifier ? String(body.companyIdentifier) : null,
          ecosystemSlug: body.ecosystemSlug ? String(body.ecosystemSlug) : null,
          rightsType,
          translationAllowed,
          analysisAllowed,
          evidenceStatus: body.evidenceStatus as EvidenceStatus,
        },
        create: {
          contentType: body.contentType as ExternalContentType,
          sourceName: String(body.sourceName),
          sourceCountry: body.sourceCountry ? String(body.sourceCountry).toUpperCase() : null,
          title,
          translatedTitle,
          language: String(body.language ?? "en"),
          targetLanguage: body.targetLanguage ? String(body.targetLanguage) : null,
          originalUrl: requireHttpUrl(body.originalUrl, "originalUrl"),
          publishedAt: body.publishedAt ? parseDate(body.publishedAt, "publishedAt") : null,
          companyIdentifier: body.companyIdentifier ? String(body.companyIdentifier) : null,
          ecosystemSlug: body.ecosystemSlug ? String(body.ecosystemSlug) : null,
          rightsType,
          translationAllowed,
          analysisAllowed,
          evidenceStatus: body.evidenceStatus as EvidenceStatus,
        },
      });
      return NextResponse.json({ kind, id: record.id });
    }

    if (kind === "institutional-disclosure") {
      const record = await db.institutionalDisclosure.create({
        data: {
          managerName: String(body.managerName),
          managerCountry: body.managerCountry ? String(body.managerCountry).toUpperCase() : null,
          targetCompanyName: String(body.targetCompanyName),
          targetIdentifier: body.targetIdentifier ? String(body.targetIdentifier) : null,
          targetCountry: body.targetCountry ? String(body.targetCountry).toUpperCase() : null,
          positionType: String(body.positionType ?? "DISCLOSED_POSITION"),
          shares: body.shares != null ? String(body.shares) : null,
          reportedValueUsd: body.reportedValueUsd != null ? String(body.reportedValueUsd) : null,
          periodEnd: parseDate(body.periodEnd, "periodEnd"),
          reportedAt: parseDate(body.reportedAt, "reportedAt"),
          sourceUrl: requireHttpUrl(body.sourceUrl, "sourceUrl"),
          evidenceStatus: body.evidenceStatus as EvidenceStatus,
        },
      });
      return NextResponse.json({ kind, id: record.id });
    }

    if (kind === "mna") {
      const record = await db.mnaEvent.create({
        data: {
          acquirerName: String(body.acquirerName),
          acquirerCountry: body.acquirerCountry ? String(body.acquirerCountry).toUpperCase() : null,
          targetName: String(body.targetName),
          targetCountry: body.targetCountry ? String(body.targetCountry).toUpperCase() : null,
          dealValueUsd: body.dealValueUsd != null ? String(body.dealValueUsd) : null,
          status: (body.status ?? DealStatus.UNKNOWN) as DealStatus,
          announcedAt: parseDate(body.announcedAt, "announcedAt"),
          completedAt: body.completedAt ? parseDate(body.completedAt, "completedAt") : null,
          ecosystemSlug: body.ecosystemSlug ? String(body.ecosystemSlug) : null,
          sourceUrl: requireHttpUrl(body.sourceUrl, "sourceUrl"),
          evidenceStatus: body.evidenceStatus as EvidenceStatus,
        },
      });
      return NextResponse.json({ kind, id: record.id });
    }

    if (kind === "market-event") {
      const title = String(body.title ?? "").trim();
      const relevanceNote = body.relevanceNote ? String(body.relevanceNote).trim() : null;
      if (!title) throw new Error("TITLE_REQUIRED");
      assertSafeForPublication([title, relevanceNote].filter(Boolean).join("\n"));

      const record = await db.marketImpactEvent.create({
        data: {
          eventType: body.eventType as GlobalEventType,
          title,
          country: body.country ? String(body.country).toUpperCase() : null,
          occurredAt: parseDate(body.occurredAt, "occurredAt"),
          companyIdentifier: body.companyIdentifier ? String(body.companyIdentifier) : null,
          ecosystemSlug: body.ecosystemSlug ? String(body.ecosystemSlug) : null,
          relevanceNote,
          sourceUrl: requireHttpUrl(body.sourceUrl, "sourceUrl"),
          evidenceStatus: body.evidenceStatus as EvidenceStatus,
        },
      });
      return NextResponse.json({ kind, id: record.id });
    }

    return NextResponse.json({ error: "UNSUPPORTED_KIND" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "INVALID_REQUEST";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

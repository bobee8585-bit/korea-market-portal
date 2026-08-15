CREATE TYPE "Market" AS ENUM ('KOSPI', 'KOSDAQ', 'KONEX', 'OTHER');
CREATE TYPE "RightsType" AS ENUM ('OFFICIAL_OPEN_DATA', 'LICENSED', 'METADATA_ONLY', 'LINK_ONLY', 'BLOCKED');
CREATE TYPE "SourceType" AS ENUM ('REGULATOR', 'EXCHANGE', 'GOVERNMENT', 'COMPANY_IR', 'MEDIA', 'BROKER', 'FUND', 'CENTRAL_BANK', 'PUBLIC_DATA', 'INTERNATIONAL_ORG');
CREATE TYPE "EvidenceStatus" AS ENUM ('REGULATOR_CONFIRMED', 'GOVERNMENT_CONFIRMED', 'COMPANY_CONFIRMED', 'LICENSED_SOURCE', 'INFERRED', 'UNVERIFIED');
CREATE TYPE "RelationshipType" AS ENUM ('SUPPLIER_TO', 'CUSTOMER_OF', 'PEER_OF', 'JOINT_VENTURE_WITH', 'STRATEGIC_PARTNER_OF', 'SUBSIDIARY_OF', 'PARENT_OF', 'LICENSE_PARTNER_OF');
CREATE TYPE "EcosystemRoleType" AS ENUM ('MANUFACTURER', 'MATERIAL_SUPPLIER', 'EQUIPMENT_PROVIDER', 'DESIGNER', 'ASSEMBLY', 'PACKAGING', 'TESTING', 'CUSTOMER', 'INFRASTRUCTURE', 'LOGISTICS', 'OTHER');
CREATE TYPE "FactoryType" AS ENUM ('FAB', 'ASSEMBLY_PLANT', 'PACKAGING_SITE', 'TEST_SITE', 'MATERIALS_PLANT', 'BATTERY_PLANT', 'AUTO_PLANT', 'SHIPYARD', 'RND_CENTER', 'INDUSTRIAL_CLUSTER', 'OTHER');
CREATE TYPE "FactoryStatus" AS ENUM ('PLANNED', 'UNDER_CONSTRUCTION', 'OPERATING', 'EXPANDING', 'SUSPENDED', 'CLOSED', 'UNKNOWN');
CREATE TYPE "DisclosureEventType" AS ENUM ('EARNINGS', 'DIVIDEND', 'SHARE_BUYBACK', 'SHARE_CANCELLATION', 'CAPITAL_INCREASE', 'BOND', 'MERGER', 'SPINOFF', 'ACQUISITION', 'MAJOR_CONTRACT', 'OWNERSHIP_CHANGE', 'INVESTMENT', 'LITIGATION', 'TRADING_STATUS', 'COMPANY_IR', 'POLICY', 'REGULATION', 'OTHER');
CREATE TYPE "ExternalContentType" AS ENUM ('NEWS', 'BROKER_RESEARCH', 'COMPANY_IR', 'POLICY', 'REGULATORY_NOTICE', 'INDUSTRY_REPORT');
CREATE TYPE "GlobalEventType" AS ENUM ('POLICY', 'REGULATION', 'SANCTION', 'TRADE', 'SUPPLY_CHAIN', 'FACTORY', 'TECHNOLOGY', 'EARNINGS', 'OWNERSHIP', 'MNA', 'OTHER');
CREATE TYPE "DealStatus" AS ENUM ('ANNOUNCED', 'PENDING', 'COMPLETED', 'WITHDRAWN', 'BLOCKED', 'UNKNOWN');

CREATE TABLE "Company" (
  "id" TEXT PRIMARY KEY,
  "corpCode" TEXT UNIQUE,
  "ticker" TEXT UNIQUE,
  "slug" TEXT UNIQUE,
  "nameKo" TEXT NOT NULL,
  "nameEn" TEXT,
  "country" TEXT NOT NULL DEFAULT 'KR',
  "market" "Market",
  "websiteUrl" TEXT,
  "irUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Company_nameKo_idx" ON "Company"("nameKo");
CREATE INDEX "Company_nameEn_idx" ON "Company"("nameEn");
CREATE INDEX "Company_country_idx" ON "Company"("country");

CREATE TABLE "CompanyAlias" (
  "id" TEXT PRIMARY KEY,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "alias" TEXT NOT NULL,
  "language" TEXT
);
CREATE INDEX "CompanyAlias_alias_idx" ON "CompanyAlias"("alias");

CREATE TABLE "Source" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "country" TEXT,
  "sourceType" "SourceType" NOT NULL,
  "homepageUrl" TEXT,
  "apiUrl" TEXT,
  "termsUrl" TEXT,
  "official" BOOLEAN NOT NULL DEFAULT false,
  "rightsType" "RightsType" NOT NULL DEFAULT 'BLOCKED',
  "canStore" BOOLEAN NOT NULL DEFAULT false,
  "canTranslate" BOOLEAN NOT NULL DEFAULT false,
  "canAnalyze" BOOLEAN NOT NULL DEFAULT false,
  "canCache" BOOLEAN NOT NULL DEFAULT false,
  "canShowTitle" BOOLEAN NOT NULL DEFAULT false,
  "canShowExcerpt" BOOLEAN NOT NULL DEFAULT false,
  "canShowImage" BOOLEAN NOT NULL DEFAULT false,
  "verifiedAt" TIMESTAMP(3),
  "licenseStart" TIMESTAMP(3),
  "licenseEnd" TIMESTAMP(3),
  "active" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Disclosure" (
  "id" TEXT PRIMARY KEY,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "sourceId" TEXT NOT NULL REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "receiptNo" TEXT NOT NULL UNIQUE,
  "reportName" TEXT NOT NULL,
  "filerName" TEXT,
  "corpClass" TEXT,
  "filedAt" TIMESTAMP(3) NOT NULL,
  "remarks" TEXT,
  "originalUrl" TEXT NOT NULL,
  "eventType" "DisclosureEventType" NOT NULL DEFAULT 'OTHER',
  "language" TEXT NOT NULL DEFAULT 'ko',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Disclosure_companyId_filedAt_idx" ON "Disclosure"("companyId", "filedAt");
CREATE INDEX "Disclosure_filedAt_idx" ON "Disclosure"("filedAt");
CREATE INDEX "Disclosure_eventType_idx" ON "Disclosure"("eventType");

CREATE TABLE "Ecosystem" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "EcosystemStage" (
  "id" TEXT PRIMARY KEY,
  "ecosystemId" TEXT NOT NULL REFERENCES "Ecosystem"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "parentStageId" TEXT REFERENCES "EcosystemStage"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "name" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  CONSTRAINT "EcosystemStage_ecosystemId_sequence_key" UNIQUE ("ecosystemId", "sequence")
);

CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY,
  "ecosystemId" TEXT NOT NULL REFERENCES "Ecosystem"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "stageId" TEXT REFERENCES "EcosystemStage"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "name" TEXT NOT NULL,
  "technologyGroup" TEXT
);
CREATE INDEX "Product_name_idx" ON "Product"("name");

CREATE TABLE "CompanyEcosystemRole" (
  "id" TEXT PRIMARY KEY,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "ecosystemId" TEXT NOT NULL REFERENCES "Ecosystem"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "stageId" TEXT REFERENCES "EcosystemStage"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "productId" TEXT REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "roleType" "EcosystemRoleType" NOT NULL,
  "evidenceStatus" "EvidenceStatus" NOT NULL,
  "sourceId" TEXT,
  "sourceUrl" TEXT,
  "verifiedAt" TIMESTAMP(3)
);
CREATE INDEX "CompanyEcosystemRole_ecosystemId_stageId_idx" ON "CompanyEcosystemRole"("ecosystemId", "stageId");
CREATE INDEX "CompanyEcosystemRole_companyId_idx" ON "CompanyEcosystemRole"("companyId");

CREATE TABLE "CompanyRelationship" (
  "id" TEXT PRIMARY KEY,
  "fromCompanyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "toCompanyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "ecosystemId" TEXT,
  "productId" TEXT REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  "relationshipType" "RelationshipType" NOT NULL,
  "evidenceStatus" "EvidenceStatus" NOT NULL,
  "sourceId" TEXT,
  "sourceUrl" TEXT,
  "validFrom" TIMESTAMP(3),
  "validTo" TIMESTAMP(3),
  "verifiedAt" TIMESTAMP(3)
);
CREATE INDEX "CompanyRelationship_fromCompanyId_relationshipType_idx" ON "CompanyRelationship"("fromCompanyId", "relationshipType");
CREATE INDEX "CompanyRelationship_toCompanyId_relationshipType_idx" ON "CompanyRelationship"("toCompanyId", "relationshipType");

CREATE TABLE "Factory" (
  "id" TEXT PRIMARY KEY,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "region" TEXT,
  "city" TEXT,
  "latitude" DECIMAL(9,6),
  "longitude" DECIMAL(9,6),
  "locationPrecision" TEXT NOT NULL DEFAULT 'CITY',
  "factoryType" "FactoryType" NOT NULL DEFAULT 'OTHER',
  "status" "FactoryStatus" NOT NULL DEFAULT 'UNKNOWN',
  "openedAt" TIMESTAMP(3),
  "sourceId" TEXT,
  "sourceUrl" TEXT,
  "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Factory_country_city_idx" ON "Factory"("country", "city");
CREATE INDEX "Factory_companyId_status_idx" ON "Factory"("companyId", "status");

CREATE TABLE "FactoryProduct" (
  "id" TEXT PRIMARY KEY,
  "factoryId" TEXT NOT NULL REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "productionRole" TEXT,
  "capacityValue" DECIMAL(20,4),
  "capacityUnit" TEXT,
  "capacityYear" INTEGER,
  "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "sourceUrl" TEXT,
  "verifiedAt" TIMESTAMP(3),
  CONSTRAINT "FactoryProduct_factoryId_productId_key" UNIQUE ("factoryId", "productId")
);
CREATE INDEX "FactoryProduct_productId_idx" ON "FactoryProduct"("productId");

CREATE TABLE "IndustryCluster" (
  "id" TEXT PRIMARY KEY,
  "ecosystemId" TEXT NOT NULL REFERENCES "Ecosystem"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "country" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "city" TEXT,
  "latitude" DECIMAL(9,6),
  "longitude" DECIMAL(9,6),
  "locationPrecision" TEXT NOT NULL DEFAULT 'REGION',
  "description" TEXT,
  "sourceUrl" TEXT,
  "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "IndustryCluster_country_region_idx" ON "IndustryCluster"("country", "region");
CREATE INDEX "IndustryCluster_ecosystemId_country_idx" ON "IndustryCluster"("ecosystemId", "country");

CREATE TABLE "ClusterCompany" (
  "id" TEXT PRIMARY KEY,
  "clusterId" TEXT NOT NULL REFERENCES "IndustryCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "companyId" TEXT NOT NULL REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "roleLabel" TEXT,
  "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "sourceUrl" TEXT,
  "verifiedAt" TIMESTAMP(3),
  CONSTRAINT "ClusterCompany_clusterId_companyId_key" UNIQUE ("clusterId", "companyId")
);
CREATE INDEX "ClusterCompany_companyId_idx" ON "ClusterCompany"("companyId");

CREATE TABLE "ClusterFactory" (
  "id" TEXT PRIMARY KEY,
  "clusterId" TEXT NOT NULL REFERENCES "IndustryCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "factoryId" TEXT NOT NULL REFERENCES "Factory"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "sourceUrl" TEXT,
  "verifiedAt" TIMESTAMP(3),
  CONSTRAINT "ClusterFactory_clusterId_factoryId_key" UNIQUE ("clusterId", "factoryId")
);
CREATE INDEX "ClusterFactory_factoryId_idx" ON "ClusterFactory"("factoryId");

CREATE TABLE "InstitutionalDisclosure" (
  "id" TEXT PRIMARY KEY,
  "managerName" TEXT NOT NULL,
  "managerCountry" TEXT,
  "targetCompanyName" TEXT NOT NULL,
  "targetIdentifier" TEXT,
  "targetCountry" TEXT,
  "positionType" TEXT NOT NULL,
  "shares" DECIMAL(30,4),
  "reportedValueUsd" DECIMAL(30,2),
  "periodEnd" TIMESTAMP(3) NOT NULL,
  "reportedAt" TIMESTAMP(3) NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "InstitutionalDisclosure_managerName_periodEnd_idx" ON "InstitutionalDisclosure"("managerName", "periodEnd");
CREATE INDEX "InstitutionalDisclosure_targetIdentifier_periodEnd_idx" ON "InstitutionalDisclosure"("targetIdentifier", "periodEnd");
CREATE INDEX "InstitutionalDisclosure_reportedAt_idx" ON "InstitutionalDisclosure"("reportedAt");

CREATE TABLE "MnaEvent" (
  "id" TEXT PRIMARY KEY,
  "acquirerName" TEXT NOT NULL,
  "acquirerCountry" TEXT,
  "targetName" TEXT NOT NULL,
  "targetCountry" TEXT,
  "dealValueUsd" DECIMAL(30,2),
  "status" "DealStatus" NOT NULL DEFAULT 'UNKNOWN',
  "announcedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "ecosystemSlug" TEXT,
  "sourceUrl" TEXT NOT NULL,
  "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "MnaEvent_announcedAt_idx" ON "MnaEvent"("announcedAt");
CREATE INDEX "MnaEvent_status_announcedAt_idx" ON "MnaEvent"("status", "announcedAt");
CREATE INDEX "MnaEvent_ecosystemSlug_idx" ON "MnaEvent"("ecosystemSlug");

CREATE TABLE "ExternalContentLink" (
  "id" TEXT PRIMARY KEY,
  "contentType" "ExternalContentType" NOT NULL,
  "sourceName" TEXT NOT NULL,
  "sourceCountry" TEXT,
  "title" TEXT NOT NULL,
  "translatedTitle" TEXT,
  "language" TEXT NOT NULL DEFAULT 'ko',
  "targetLanguage" TEXT,
  "originalUrl" TEXT NOT NULL UNIQUE,
  "publishedAt" TIMESTAMP(3),
  "companyIdentifier" TEXT,
  "ecosystemSlug" TEXT,
  "rightsType" "RightsType" NOT NULL DEFAULT 'LINK_ONLY',
  "translationAllowed" BOOLEAN NOT NULL DEFAULT false,
  "analysisAllowed" BOOLEAN NOT NULL DEFAULT false,
  "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "ExternalContentLink_contentType_publishedAt_idx" ON "ExternalContentLink"("contentType", "publishedAt");
CREATE INDEX "ExternalContentLink_companyIdentifier_publishedAt_idx" ON "ExternalContentLink"("companyIdentifier", "publishedAt");
CREATE INDEX "ExternalContentLink_ecosystemSlug_publishedAt_idx" ON "ExternalContentLink"("ecosystemSlug", "publishedAt");

CREATE TABLE "MarketImpactEvent" (
  "id" TEXT PRIMARY KEY,
  "eventType" "GlobalEventType" NOT NULL,
  "title" TEXT NOT NULL,
  "country" TEXT,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "companyIdentifier" TEXT,
  "ecosystemSlug" TEXT,
  "relevanceNote" TEXT,
  "sourceUrl" TEXT NOT NULL,
  "evidenceStatus" "EvidenceStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "MarketImpactEvent_occurredAt_idx" ON "MarketImpactEvent"("occurredAt");
CREATE INDEX "MarketImpactEvent_eventType_occurredAt_idx" ON "MarketImpactEvent"("eventType", "occurredAt");
CREATE INDEX "MarketImpactEvent_companyIdentifier_occurredAt_idx" ON "MarketImpactEvent"("companyIdentifier", "occurredAt");
CREATE INDEX "MarketImpactEvent_ecosystemSlug_occurredAt_idx" ON "MarketImpactEvent"("ecosystemSlug", "occurredAt");

-- The application reads through its server-side Prisma connection. Enabling
-- RLS without anon/authenticated policies prevents direct PostgREST access.
ALTER TABLE "Company" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompanyAlias" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Source" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Disclosure" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Ecosystem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EcosystemStage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompanyEcosystemRole" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CompanyRelationship" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Factory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FactoryProduct" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IndustryCluster" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClusterCompany" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClusterFactory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InstitutionalDisclosure" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MnaEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExternalContentLink" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MarketImpactEvent" ENABLE ROW LEVEL SECURITY;

CREATE INDEX "CompanyAlias_companyId_idx" ON "CompanyAlias"("companyId");
CREATE INDEX "Disclosure_sourceId_idx" ON "Disclosure"("sourceId");
CREATE INDEX "EcosystemStage_parentStageId_idx" ON "EcosystemStage"("parentStageId");
CREATE INDEX "Product_ecosystemId_idx" ON "Product"("ecosystemId");
CREATE INDEX "Product_stageId_idx" ON "Product"("stageId");
CREATE INDEX "CompanyEcosystemRole_stageId_idx" ON "CompanyEcosystemRole"("stageId");
CREATE INDEX "CompanyEcosystemRole_productId_idx" ON "CompanyEcosystemRole"("productId");
CREATE INDEX "CompanyRelationship_productId_idx" ON "CompanyRelationship"("productId");

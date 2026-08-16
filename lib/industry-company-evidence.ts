export type IndustryCompanyEvidence = {
  industrySlug: string;
  stageSlug: string;
  companyNameKo: string;
  companyNameEn: string;
  evidenceLabel: "COMPANY_CONFIRMED";
  sourceTitle: string;
  sourceUrl: string;
  sourceLanguage: "en" | "ko";
  checkedAt: string;
  productFamilies: readonly string[];
  publicationNote: string;
};

export const industryCompanyEvidence: readonly IndustryCompanyEvidence[] = [
  {
    industrySlug: "food-manufacturing",
    stageSlug: "ingredients",
    companyNameKo: "CJ제일제당",
    companyNameEn: "CJ CheilJedang",
    evidenceLabel: "COMPANY_CONFIRMED",
    sourceTitle: "CJ FNT official launch and ingredient portfolio",
    sourceUrl: "https://www.cj.co.kr/en/newsroom/pressreleases/news-detail/1564",
    sourceLanguage: "en",
    checkedAt: "2026-08-17",
    productFamilies: ["Fermented seasoning blends", "Flavour ingredients", "Amino acids for human nutrition"],
    publicationNote: "The product relationship is attributed to CJ CheilJedang's own publication. It is not an independent market-rank or performance finding.",
  },
  {
    industrySlug: "food-manufacturing",
    stageSlug: "ingredients",
    companyNameKo: "삼양사",
    companyNameEn: "Samyang Corporation",
    evidenceLabel: "COMPANY_CONFIRMED",
    sourceTitle: "Samyang Corporation — Food Ingredients",
    sourceUrl: "https://www.samyangcorp.com/en/food-business/food-ingredients",
    sourceLanguage: "en",
    checkedAt: "2026-08-17",
    productFamilies: ["Sugar", "Starch and starch sweeteners", "Wheat flour and premix", "Oils and fats"],
    publicationNote: "The categories reproduce the company's official business description; production scale and market position are not inferred.",
  },
  {
    industrySlug: "food-manufacturing",
    stageSlug: "ingredients",
    companyNameKo: "대상",
    companyNameEn: "Daesang Corporation",
    evidenceLabel: "COMPANY_CONFIRMED",
    sourceTitle: "Daesang Ingredient — Anhydrous crystalline glucose",
    sourceUrl: "https://ingredient.daesang.com/s/channelproduct/a0W5i000000GWU3EAO/%EB%AC%B4%EC%88%98%EA%B2%B0%EC%A0%95%ED%8F%AC%EB%8F%84%EB%8B%B9?language=ko",
    sourceLanguage: "ko",
    checkedAt: "2026-08-17",
    productFamilies: ["Anhydrous crystalline glucose"],
    publicationNote: "Product properties and certifications remain company-published information unless separately confirmed by the named certifying body.",
  },
  {
    industrySlug: "chemicals",
    stageSlug: "polymers",
    companyNameKo: "LG화학",
    companyNameEn: "LG Chem",
    evidenceLabel: "COMPANY_CONFIRMED",
    sourceTitle: "LG Chem — Petrochemicals product list",
    sourceUrl: "https://www.lgchem.com/product/petrochemicals",
    sourceLanguage: "en",
    checkedAt: "2026-08-17",
    productFamilies: ["ABS", "ASA", "PVC", "Synthetic rubber", "Superabsorbent polymer"],
    publicationNote: "Only product categories shown in LG Chem's official catalogue are mapped. Comparative quality and market-rank language is not republished as fact.",
  },
  {
    industrySlug: "chemicals",
    stageSlug: "basic-chemicals",
    companyNameKo: "롯데케미칼",
    companyNameEn: "LOTTE Chemical",
    evidenceLabel: "COMPANY_CONFIRMED",
    sourceTitle: "LOTTE Chemical — Basic Petrochemicals",
    sourceUrl: "https://product.lottechem.com/en/basic_materials/tl.do",
    sourceLanguage: "en",
    checkedAt: "2026-08-17",
    productFamilies: ["Benzene", "Toluene", "Mixed xylene", "Para-xylene", "Butadiene", "Styrene monomer"],
    publicationNote: "The record reflects the company's official product catalogue. Production volume, competitiveness and downstream customer relationships are not inferred.",
  },
  {
    industrySlug: "chemicals",
    stageSlug: "polymers",
    companyNameKo: "롯데케미칼",
    companyNameEn: "LOTTE Chemical",
    evidenceLabel: "COMPANY_CONFIRMED",
    sourceTitle: "LOTTE Chemical — Polymer products",
    sourceUrl: "https://product.lottechem.com/en/basic_materials/injection.do",
    sourceLanguage: "en",
    checkedAt: "2026-08-17",
    productFamilies: ["Polyethylene", "Polypropylene", "PET"],
    publicationNote: "Only named polymer families are mapped. Performance descriptions and market-position language remain attributed to the company and are not independently endorsed.",
  },
];

export function getIndustryCompanyEvidence(industrySlug: string, stageSlug: string) {
  return industryCompanyEvidence.filter((record) => record.industrySlug === industrySlug && record.stageSlug === stageSlug);
}

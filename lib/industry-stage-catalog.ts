import { industryCatalog } from "@/lib/industry-catalog";

export function industryStageSlug(stage: string) {
  return stage.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type StageGuide = { scope: string; productFamilies: readonly string[]; verification: readonly string[] };

const foodGuides: Record<string, StageGuide> = {
  "agricultural-and-marine-inputs": { scope: "Primary agricultural, livestock and marine inputs entering Korean food manufacturing. Origin, seasonality and sanitary controls remain separate from commercial claims.", productFamilies: ["Grains and starch crops", "Fruit and vegetables", "Livestock and dairy inputs", "Fish and marine products", "Imported agricultural inputs"], verification: ["Country and region of origin", "Applicable quarantine or sanitary requirement", "Observation year and physical unit", "Primary producer, importer and processor roles"] },
  ingredients: { scope: "Functional and conventional ingredients used in processed food. An ingredient's technical function, regulatory permission and marketing claim are treated as different facts.", productFamilies: ["Starches, sugars and sweeteners", "Edible oils and fats", "Proteins and concentrates", "Fermentation cultures and enzymes", "Flavours, colours and food additives", "Seasonings and premixes"], verification: ["MFDS permitted use and scope", "Food category and technical function", "Company manufacturing or distribution role", "Source date, market and product identity"] },
  processing: { scope: "Conversion of ingredients into consumer or business food products through controlled manufacturing processes.", productFamilies: ["Ready meals", "Noodles and grain products", "Confectionery and snacks", "Beverages", "Frozen and refrigerated foods", "Fermented foods and sauces"], verification: ["Factory and product identity", "Food safety system and certifying body", "Process claim versus verified capacity", "Export destination and observation period"] },
  packaging: { scope: "Primary, secondary and transport packaging used to protect food, communicate mandatory information and support distribution.", productFamilies: ["Food-contact containers", "Flexible films and barriers", "Paper and fibre packaging", "Closures and dispensing systems", "Labels and traceability", "Transport packaging"], verification: ["Food-contact compliance", "Material and barrier function", "Recyclability claim and jurisdiction", "Packager, converter and food-company roles"] },
  "cold-chain": { scope: "Temperature-controlled storage and movement between production, wholesale, retail and export nodes.", productFamilies: ["Refrigerated warehouses", "Frozen storage", "Temperature-controlled transport", "Monitoring and traceability", "Port and airport cold facilities"], verification: ["Temperature range and product class", "Facility location and operator", "Storage versus transport responsibility", "Dated capacity and unit"] },
  "export-distribution": { scope: "Official export support, customs-facing distribution and overseas market access for Korean manufactured food.", productFamilies: ["Export consolidation", "Wholesale distribution", "Retail and food-service channels", "Customs and certification support", "Overseas logistics"], verification: ["Destination market and period", "Customs code and product scope", "Exporter versus brand owner", "Official trade value and currency"] },
};

const chemicalGuides: Record<string, StageGuide> = {
  feedstocks: { scope: "Hydrocarbon, mineral and bio-based inputs entering the chemical value chain.", productFamilies: ["Naphtha and gas feedstocks", "Industrial minerals", "Bio-based feedstocks", "Recovered materials"], verification: ["Input definition and grade", "Supplier and converter roles", "Origin and observation period", "Physical unit"] },
  "basic-chemicals": { scope: "High-volume base chemicals used as inputs for downstream manufacturing.", productFamilies: ["Olefins", "Aromatics", "Industrial gases", "Inorganic chemicals"], verification: ["Product grade", "Plant and operator", "Nameplate versus actual output", "Observation date"] },
  intermediates: { scope: "Chemical intermediates converted into polymers, formulations and specialty materials.", productFamilies: ["Monomers", "Solvents", "Resins and precursors", "Process chemicals"], verification: ["Chemical identity", "Upstream and downstream use", "Manufacturer role", "Regulatory classification"] },
  polymers: { scope: "Polymer production and compounding for industrial and consumer applications.", productFamilies: ["Polyolefins", "Engineering plastics", "Synthetic rubber", "Composite compounds"], verification: ["Resin family and grade", "Producer versus compounder", "Capacity year and unit", "End-use claim"] },
  "specialty-materials": { scope: "Higher-specification materials differentiated by formulation, purity or performance requirements.", productFamilies: ["Electronic materials", "Coatings and adhesives", "Battery materials", "High-performance compounds"], verification: ["Specified application", "Qualification status", "Company-attributed performance claim", "Independent or regulatory evidence"] },
  "industrial-customers": { scope: "Documented downstream uses in electronics, mobility, construction, energy and other industries.", productFamilies: ["Electronics", "Automotive and mobility", "Construction", "Energy", "Consumer and healthcare manufacturing"], verification: ["Customer relationship evidence", "Product and application match", "Announcement date", "Confidential or inferred relationship exclusion"] },
};

export function getIndustry(slug: string) {
  return industryCatalog.find((industry) => industry.slug === slug);
}

export function getStageGuide(industrySlug: string, stage: string): StageGuide {
  const slug = industryStageSlug(stage);
  const specific = industrySlug === "food-manufacturing" ? foodGuides[slug] : industrySlug === "chemicals" ? chemicalGuides[slug] : undefined;
  return specific ?? {
    scope: `${stage} is mapped as one part of the ${getIndustry(industrySlug)?.name ?? "industry"} value chain. Publication requires a dated original source and a clearly defined company, product, facility or market role.`,
    productFamilies: [`${stage} products and services`, "Production and facility evidence", "Companies with a documented role", "Downstream applications"],
    verification: ["Original source and publication date", "Company, product or facility identity", "Geographic and market scope", "Capacity, rank or share only with a comparable dated dataset"],
  };
}

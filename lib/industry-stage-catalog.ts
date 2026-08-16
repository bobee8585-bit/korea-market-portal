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

const expandedFamilies: Record<string, Record<string, readonly string[]>> = {
  refining: {
    "crude-supply": ["Crude grades and blends", "Marine terminals and import logistics", "Feedstock procurement and inventory"],
    refining: ["Atmospheric and vacuum distillation", "Conversion and upgrading units", "Desulfurisation and treatment", "Refinery utilities"],
    "fuel-products": ["Gasoline and blending components", "Diesel and marine fuels", "Jet fuel", "LPG and heating fuels"],
    "petrochemical-feedstocks": ["Naphtha", "Propylene and refinery gases", "Aromatics feedstocks", "Sulfur and other co-products"],
    storage: ["Crude tanks", "Product terminals", "Strategic and commercial stocks", "Pipeline and loading facilities"],
    "export-and-distribution": ["Domestic wholesale supply", "Service-station channels", "Bunkering", "Product exports"],
  },
  steel: {
    "raw-materials": ["Iron ore", "Coking coal and coke", "Scrap metal", "Alloying inputs"],
    ironmaking: ["Sinter and pellet preparation", "Blast-furnace iron", "Direct-reduction inputs", "Slag and process gases"],
    steelmaking: ["Basic-oxygen steel", "Electric-arc steel", "Continuous casting", "Secondary metallurgy"],
    rolling: ["Hot-rolled products", "Cold-rolled products", "Plate", "Bars, rods and sections"],
    "specialty-products": ["Electrical steel", "Stainless steel", "Coated steel", "High-strength and alloy grades"],
    "mobility-and-infrastructure": ["Automotive steel", "Shipbuilding plate", "Construction products", "Energy and machinery applications"],
  },
  biohealth: {
    research: ["Drug discovery", "Biomarker and diagnostic research", "Medical-device engineering", "Platform technologies"],
    "clinical-development": ["Preclinical studies", "Clinical trial phases", "Trial operations", "Safety monitoring"],
    materials: ["Active pharmaceutical ingredients", "Biologics inputs", "Excipients", "Medical-grade materials"],
    manufacturing: ["Small-molecule production", "Biologics production", "Fill and finish", "Medical-device assembly"],
    "quality-and-regulation": ["GMP quality systems", "Product approval review", "Batch testing and release", "Post-market surveillance"],
    "global-distribution": ["Licensed export", "Cold-chain distribution", "Local market authorization", "Pharmacovigilance support"],
  },
  machinery: {
    engineering: ["Mechanical design", "Controls engineering", "Simulation and prototyping", "Systems engineering"],
    "materials-and-components": ["Bearings and gears", "Motors and drives", "Hydraulics and pneumatics", "Castings and precision parts"],
    "machine-tools": ["Turning and milling systems", "Grinding and finishing", "Cutting tools", "Additive manufacturing equipment"],
    "production-equipment": ["Semiconductor and display equipment", "Battery production equipment", "Packaging machinery", "Process equipment"],
    "factory-automation": ["Industrial robots", "Sensors and machine vision", "PLC and motion control", "Manufacturing software"],
    "maintenance-and-export": ["Installation and commissioning", "Parts and maintenance", "Retrofit services", "Export distribution"],
  },
  "defense-aerospace": {
    "public-requirements": ["Published capability requirements", "Budget and acquisition plans", "Public tenders", "Industrial participation rules"],
    "research-and-development": ["Publicly disclosed research programmes", "Prototypes and demonstrators", "Qualification programmes", "Civil aerospace research"],
    components: ["Structures and airframes", "Propulsion components", "Avionics and electronics", "Approved materials and subsystems"],
    "systems-integration": ["Aircraft integration", "Land and maritime systems", "Space systems", "Command systems disclosed publicly"],
    "testing-and-quality": ["Environmental and structural testing", "Airworthiness and certification", "Quality assurance", "Public acceptance milestones"],
    "approved-procurement-and-export": ["Government procurement", "Licensed exports", "Public delivery milestones", "Sustainment contracts"],
  },
  cosmetics: {
    ingredients: ["Emollients and surfactants", "Humectants", "Colour and fragrance materials", "Functional cosmetic ingredients"],
    formulation: ["Skin care", "Colour cosmetics", "Hair and body care", "Sun-care formulations"],
    testing: ["Safety assessment", "Stability and compatibility", "Microbiological testing", "Claim substantiation"],
    manufacturing: ["Bulk compounding", "Filling and assembly", "ODM and OEM production", "Quality control"],
    packaging: ["Primary containers", "Pumps and closures", "Labels and mandatory information", "Secondary packaging"],
    "brand-and-export-distribution": ["Brand ownership", "Responsible cosmetic distributor", "Retail and e-commerce", "Export notification and distribution"],
  },
  display: {
    materials: ["Substrates and glass", "Organic emitting materials", "Photoresists and process chemicals", "Polarizers and optical films"],
    components: ["Driver ICs", "Flexible circuits", "Backlight components", "Touch and sensing components"],
    "production-equipment": ["Deposition equipment", "Lithography and patterning", "Etching and cleaning", "Inspection and repair"],
    panels: ["LCD panels", "OLED panels", "Microdisplay panels", "Special-purpose panels"],
    modules: ["Display modules", "Touch-integrated modules", "Automotive modules", "Industrial display assemblies"],
    "devices-and-applications": ["Televisions and monitors", "Mobile devices", "Automotive displays", "XR and industrial applications"],
  },
  "battery-materials": {
    "critical-minerals": ["Lithium resources and chemicals", "Nickel and cobalt inputs", "Manganese and graphite", "Recovered mineral feedstocks"],
    "active-materials": ["Cathode active materials", "Anode active materials", "Conductive additives", "Binders"],
    components: ["Separators", "Electrolytes and additives", "Current collectors", "Cases and safety components"],
    cells: ["Cylindrical cells", "Prismatic cells", "Pouch cells", "Special-purpose rechargeable cells"],
    "packs-and-systems": ["Battery modules", "Battery packs", "Battery-management systems", "Stationary storage systems"],
    "reuse-and-recycling": ["Collection and diagnosis", "Second-life systems", "Black mass processing", "Material recovery"],
  },
};

const expandedVerification: Record<string, readonly string[]> = {
  refining: ["Facility, operator and process identity", "Product specification and observation period", "Capacity versus actual throughput", "Trade value, volume and destination"],
  steel: ["Product grade and standard", "Plant and producer identity", "Capacity versus production", "End-use or customer relationship source"],
  biohealth: ["Regulatory jurisdiction and exact status", "Product, sponsor and indication identity", "Trial phase versus marketing authorization", "Safety and efficacy claims from the responsible authority"],
  machinery: ["Equipment model and technical scope", "Manufacturer, distributor and user roles", "Installed base versus order or shipment", "Certification and observation date"],
  "defense-aerospace": ["Public source and disclosure authority", "Programme status and contract date", "Procurement, delivery and export-license status kept separate", "No classified, tactical or inferred operational detail"],
  cosmetics: ["Ingredient and product identity", "MFDS regulatory category and claim scope", "Manufacturer, responsible distributor and brand roles", "Testing claim, method and observation date"],
  display: ["Technology generation and product definition", "Material, equipment, panel and module roles", "Capacity versus shipment or market share", "Period, geography and comparable denominator"],
  "battery-materials": ["Chemistry and product specification", "Mine, refiner, material producer and cell-maker roles", "Nameplate capacity versus qualified output", "Recycling yield, recovery basis and observation date"],
};

function getIndustryName(slug: string) {
  return industryCatalog.find((industry) => industry.slug === slug)?.name ?? "Industry";
}

const expandedGuides: Record<string, Record<string, StageGuide>> = Object.fromEntries(
  Object.entries(expandedFamilies).map(([industrySlug, stages]) => [
    industrySlug,
    Object.fromEntries(Object.entries(stages).map(([stageSlug, productFamilies]) => [
      stageSlug,
      {
        scope: getIndustryName(industrySlug) + ": " + stageSlug.replace(/-/g, " ") + ". Product, company, facility and market statements are published only when their roles and dates are independently identifiable.",
        productFamilies,
        verification: expandedVerification[industrySlug],
      },
    ])),
  ]),
);

export function getIndustry(slug: string) {
  return industryCatalog.find((industry) => industry.slug === slug);
}

export function getStageGuide(industrySlug: string, stage: string): StageGuide {
  const slug = industryStageSlug(stage);
  const specific = industrySlug === "food-manufacturing" ? foodGuides[slug] : industrySlug === "chemicals" ? chemicalGuides[slug] : expandedGuides[industrySlug]?.[slug];
  return specific ?? {
    scope: `${stage} is mapped as one part of the ${getIndustry(industrySlug)?.name ?? "industry"} value chain. Publication requires a dated original source and a clearly defined company, product, facility or market role.`,
    productFamilies: [`${stage} products and services`, "Production and facility evidence", "Companies with a documented role", "Downstream applications"],
    verification: ["Original source and publication date", "Company, product or facility identity", "Geographic and market scope", "Capacity, rank or share only with a comparable dated dataset"],
  };
}

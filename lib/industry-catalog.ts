export const industryCatalog = [
  {
    slug: "food-manufacturing", name: "Food manufacturing", koreanName: "식품 제조",
    chain: ["Agricultural and marine inputs", "Ingredients", "Processing", "Packaging", "Cold chain", "Export distribution"],
    summary: "A source map for processed foods, ingredients, safety systems, packaging and export distribution—not a claim about market rank.",
    sources: [
      { name: "Korea Agro-Fisheries & Food Trade Corporation (aT)", url: "https://www.at.or.kr/english/main.do", type: "PUBLIC AGENCY" },
      { name: "Korea Food Industry Association", url: "https://www.kfia.or.kr/kfia/sub.php?menukey=1265", type: "INDUSTRY ASSOCIATION" },
      { name: "Ministry of Food and Drug Safety", url: "https://www.mfds.go.kr/eng/index.do", type: "REGULATOR" },
    ],
  },
  {
    slug: "chemicals", name: "Chemicals and materials", koreanName: "화학·소재",
    chain: ["Feedstocks", "Basic chemicals", "Intermediates", "Polymers", "Specialty materials", "Industrial customers"],
    summary: "Coverage follows the material chain from basic chemical inputs to polymers and higher-value industrial applications.",
    sources: [{ name: "Korea Chemical Industry Association", url: "https://kcia.kr/en/main", type: "INDUSTRY ASSOCIATION" }],
  },
  {
    slug: "refining", name: "Oil refining", koreanName: "정유",
    chain: ["Crude supply", "Refining", "Fuel products", "Petrochemical feedstocks", "Storage", "Export and distribution"],
    summary: "Refining is presented as physical infrastructure and a supply chain. Capacity or rank claims require a dated, comparable dataset.",
    sources: [{ name: "Korea Petroleum Association", url: "https://engn.petroleum.or.kr/", type: "INDUSTRY ASSOCIATION" }],
  },
  {
    slug: "steel", name: "Steel and metals", koreanName: "철강·금속",
    chain: ["Raw materials", "Ironmaking", "Steelmaking", "Rolling", "Specialty products", "Mobility and infrastructure"],
    summary: "The map connects production stages with downstream uses while keeping company claims separate from industry statistics.",
    sources: [{ name: "Korea Iron & Steel Association", url: "https://www.kosa.or.kr/", type: "INDUSTRY ASSOCIATION" }],
  },
  {
    slug: "biohealth", name: "Biohealth manufacturing", koreanName: "바이오헬스 제조",
    chain: ["Research", "Clinical development", "Materials", "Manufacturing", "Quality and regulation", "Global distribution"],
    summary: "Pharmaceuticals, biopharmaceuticals and medical devices are covered with regulatory status kept distinct from commercial claims.",
    sources: [{ name: "Korea Health Industry Development Institute", url: "https://www.khidi.or.kr/eps", type: "PUBLIC INSTITUTE" }],
  },
] as const;

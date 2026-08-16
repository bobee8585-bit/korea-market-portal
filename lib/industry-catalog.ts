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
  {
    slug: "machinery", name: "Machinery and industrial equipment", koreanName: "기계·산업장비",
    chain: ["Engineering", "Materials and components", "Machine tools", "Production equipment", "Factory automation", "Maintenance and export"],
    summary: "Coverage connects the machines that make other products, from components and tooling to automation, service and international distribution.",
    sources: [{ name: "Korea Association of Machinery Industry", url: "https://www.koami.or.kr/english/main/main.do", type: "INDUSTRY ASSOCIATION" }],
  },
  {
    slug: "defense-aerospace", name: "Defense and aerospace manufacturing", koreanName: "방산·항공우주 제조",
    chain: ["Public requirements", "Research and development", "Components", "Systems integration", "Testing and quality", "Approved procurement and export"],
    summary: "Only public acquisition, industrial and export information is mapped. Security-sensitive details, operational speculation and unsupported performance comparisons are excluded.",
    sources: [
      { name: "Defense Acquisition Program Administration", url: "https://www.dapa.go.kr/dapaen/index.do", type: "GOVERNMENT AGENCY" },
      { name: "Defense Acquisition Program Act", url: "https://elaw.klri.re.kr/eng_service/lawView.do?hseq=54104&lang=ENG", type: "OFFICIAL LAW TRANSLATION" },
    ],
  },
  {
    slug: "cosmetics", name: "Cosmetics manufacturing", koreanName: "화장품 제조",
    chain: ["Ingredients", "Formulation", "Testing", "Manufacturing", "Packaging", "Brand and export distribution"],
    summary: "The sector is mapped as a manufacturing ecosystem—ingredients, formulation, production, packaging and brands—with safety and regulatory claims kept separate from marketing.",
    sources: [
      { name: "Ministry of Food and Drug Safety — Bio & Cosmetics", url: "https://www.mfds.go.kr/eng/wpge/m_38/de011025l001.do", type: "REGULATOR" },
      { name: "Korea Cosmetic Association", url: "https://kcia.or.kr/home/main/", type: "INDUSTRY ASSOCIATION" },
    ],
  },
  {
    slug: "display", name: "Display manufacturing", koreanName: "디스플레이 제조",
    chain: ["Materials", "Components", "Production equipment", "Panels", "Modules", "Devices and applications"],
    summary: "Display coverage separates materials, equipment, panel production and end applications. Technology or market-share claims require a dated scope and source.",
    sources: [
      { name: "Korea Display Industry Association", url: "https://www.kdia.org/index.jsp?lng=en", type: "INDUSTRY ASSOCIATION" },
      { name: "Ministry of Trade, Industry and Resources", url: "https://english.motir.go.kr/eng/12/topics/1", type: "GOVERNMENT" },
    ],
  },
  {
    slug: "battery-materials", name: "Batteries and battery materials", koreanName: "배터리·소재",
    chain: ["Critical minerals", "Active materials", "Components", "Cells", "Packs and systems", "Reuse and recycling"],
    summary: "The map covers critical minerals, cathode and anode materials, separators, cells, packs and circular use without treating forecasts as established outcomes.",
    sources: [
      { name: "Korea Battery Industry Association", url: "https://www.k-bia.or.kr/", type: "INDUSTRY ASSOCIATION" },
      { name: "Ministry of Trade, Industry and Resources — Circular Battery Ecosystem", url: "https://english.motir.go.kr/eng/article/EATCLdfa319ada/2621/view", type: "GOVERNMENT" },
    ],
  },
] as const;

export const ecosystemEvidenceCatalog: Record<string, readonly {
  stage: string;
  organisation: string;
  title: string;
  url: string;
  sourceType: string;
}[]> = {
  battery: [
    { stage: "Cell / Module / Pack", organisation: "LG Energy Solution", title: "Cylindrical battery products and module-to-pack supply", url: "https://www.lgensol.com/mobile/en/business/factor-cylindrical-21-18", sourceType: "OFFICIAL COMPANY SOURCE" },
    { stage: "Reuse / Recycling", organisation: "LG Energy Solution", title: "Circular battery ecosystem and end-of-life battery use", url: "https://www.lgensol.com/en/esg/environment-resources", sourceType: "OFFICIAL COMPANY SOURCE" },
    { stage: "Industry overview", organisation: "Korea Battery Industry Association", title: "Korea battery industry association", url: "https://www.k-bia.or.kr/", sourceType: "INDUSTRY ASSOCIATION" },
  ],
  "automotive-ev": [
    { stage: "EV platform", organisation: "Hyundai Motor", title: "Electric Global Modular Platform (E-GMP)", url: "https://www.hyundai.com/worldwide/en/brand-journal/ioniq/e-gmp-revolution", sourceType: "OFFICIAL COMPANY SOURCE" },
    { stage: "Electrification / Manufacturing", organisation: "Hyundai Motor", title: "Electrification strategy and manufacturing capabilities", url: "https://www.hyundai.com/worldwide/en/company/innovation/electrification", sourceType: "OFFICIAL COMPANY SOURCE" },
    { stage: "Battery supply chain", organisation: "Hyundai Motor Group / SK On", title: "Official disclosure of an EV battery-cell joint venture", url: "https://www.hyundai.com/worldwide/en/newsroom/detail/0000000237", sourceType: "OFFICIAL COMPANY DISCLOSURE" },
  ],
  shipbuilding: [
    { stage: "Shipyard / Vessel construction", organisation: "HD Hyundai Heavy Industries", title: "Shipbuilding business and vessel categories", url: "https://hd-hhi.com/en/business/shipbuilding", sourceType: "OFFICIAL COMPANY SOURCE" },
    { stage: "Engine / Machinery", organisation: "HD Hyundai Heavy Industries", title: "Marine engine and machinery business", url: "https://hd-hhi.com/en/business/engine-machinery", sourceType: "OFFICIAL COMPANY SOURCE" },
    { stage: "Commercial vessels", organisation: "Hanwha Ocean", title: "Commercial vessel portfolio", url: "https://www.hanwhaocean.com/en/whatwedo/cv/", sourceType: "OFFICIAL COMPANY SOURCE" },
  ],
};

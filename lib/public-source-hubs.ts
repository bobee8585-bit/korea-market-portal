export const publicSourceHubs = {
  news: [
    { type: "KOREAN GOVERNMENT", name: "Ministry of Trade, Industry and Resources", description: "Official English press releases on industry, trade, investment and energy.", url: "https://english.motir.go.kr/eng/article/EATCLdfa319ada" },
    { type: "CENTRAL BANK", name: "Bank of Korea — News & Publications", description: "Official releases, monetary-policy decisions, minutes and research.", url: "https://www.bok.or.kr/eng/singl/newsDataEng/list.do?menuNo=400007" },
    { type: "EXCHANGE", name: "Korea Exchange — Global KRX", description: "Official market, disclosure and exchange information.", url: "https://global.krx.co.kr/main/main.jsp" },
  ],
  marketEvents: [
    { type: "CENTRAL BANK", name: "Bank of Korea — Releases & Publications", description: "Primary-source monetary, financial and macroeconomic releases.", url: "https://www.bok.or.kr/eng/main/contents.do?menuNo=400259" },
    { type: "KOREAN GOVERNMENT", name: "MOTIR Press Center", description: "Official policy and real-economy announcements.", url: "https://english.motir.go.kr/eng/article/EATCLdfa319ada" },
    { type: "EXCHANGE", name: "Korea Exchange — Global KRX", description: "Official exchange notices and market information.", url: "https://global.krx.co.kr/main/main.jsp" },
  ],
  globalMoney: [
    { type: "US REGULATOR", name: "SEC Form 13F Data Sets", description: "As-filed institutional holdings data. Filing period and submission date must not be treated as real-time positions.", url: "https://www.sec.gov/data-research/sec-markets-data/form-13f-data-sets" },
    { type: "PUBLIC PENSION", name: "National Pension Service Investment Management", description: "Official fund status, asset allocation and portfolio overview.", url: "https://fund.nps.or.kr/eng/main.do" },
    { type: "PUBLIC PENSION", name: "NPS Portfolio Breakdown", description: "Official allocation by domestic and global equities, fixed income and alternatives.", url: "https://fund.nps.or.kr/eng/orinsm/ovvw/getOHFD0013M0.do" },
  ],
  mna: [
    { type: "KOREAN REGULATOR", name: "DART — Integrated Disclosure Search", description: "Search official Korean corporate filings for merger, acquisition and ownership disclosures.", url: "https://englishdart.fss.or.kr/dsbb007/main.do?option=corp" },
    { type: "KOREAN REGULATOR", name: "DART — Latest KOSPI Disclosures", description: "Latest English disclosure listings. English submissions are not a substitute for the legally authoritative Korean filing.", url: "https://englishdart.fss.or.kr/dsba001/mainAll.do" },
    { type: "EXCHANGE", name: "Korea Exchange — Global KRX", description: "Official exchange and listed-company disclosure information.", url: "https://global.krx.co.kr/main/main.jsp" },
  ],
} as const;

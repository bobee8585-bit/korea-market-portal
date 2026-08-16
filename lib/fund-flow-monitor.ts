export const fundFlowSignals = [
  { name: "Foreign cash equities", inputs: "Investor net trading · stock concentration", purpose: "Separate broad foreign flows from selling concentrated in index heavyweights.", source: "KRX", status: "OFFICIAL DATA" },
  { name: "Index futures & program trading", inputs: "Futures net positions · basis · arbitrage / non-arbitrage", purpose: "Identify derivatives-led and mechanical transmission into cash equities.", source: "KRX", status: "OFFICIAL DATA" },
  { name: "Short activity", inputs: "Short-sale value · short balance · securities lending", purpose: "Test whether bearish positioning rose before or during the move.", source: "KRX", status: "OFFICIAL DATA" },
  { name: "Leveraged products", inputs: "ETF / ETN turnover · premium-discount · portfolio file", purpose: "Estimate rebalancing and forced-deleveraging pressure without identifying an undisclosed manager.", source: "KRX / FSC", status: "METHODOLOGY" },
  { name: "Cross-market confirmation", inputs: "USD/KRW · implied volatility · put/call ratio", purpose: "Check whether equity stress is confirmed by currency and options markets.", source: "KRX / BOK", status: "OFFICIAL DATA" },
  { name: "Index concentration", inputs: "Constituent return · index weight · contribution", purpose: "Separate a market-wide move from an index move dominated by a few companies.", source: "KRX", status: "CALCULATED" },
] as const;

export const fundFlowEvidenceLevels = [
  { level: "CONFIRMED", rule: "A directly observed figure or measure published by KRX, FSC, BOK or another competent authority." },
  { level: "STRONG INDICATION", rule: "Multiple independent market indicators move consistently, but the beneficial owner or trading motive is not public." },
  { level: "ESTIMATE", rule: "A reproducible calculation whose assumptions and observation window are disclosed." },
  { level: "MEDIA REPORT", rule: "Attributed reporting, displayed separately and never upgraded to an official finding." },
  { level: "NOT VERIFIABLE", rule: "A manager, order or motive cannot be identified from public aggregate data." },
] as const;

export const currentKospiAssessment = {
  asOf: "2026-08-16",
  title: "Recent KOSPI volatility: public-evidence assessment",
  conclusion: "Public evidence supports the assessment that leverage unwinding, concentrated index exposure and foreign positioning amplified the move. Public aggregate data does not prove that a particular hedge fund caused the KOSPI move.",
  observations: [
    { level: "CONFIRMED", text: "The Financial Services Commission strengthened controls on single-stock leveraged products, including a temporary halt to new listings and tighter premium-discount management.", sourceName: "Financial Services Commission", sourceUrl: "https://www.fsc.go.kr/no010101/87353" },
    { level: "MEDIA REPORT", text: "Reuters reported analyst estimates that hedge-fund deleveraging in Korean equities was largely advanced and that forced selling had aggravated the decline.", sourceName: "Reuters · 3 Aug 2026", sourceUrl: "https://www.reuters.com/world/asia-pacific/big-investors-think-it-might-be-time-buy-south-korea-2026-08-03/" },
    { level: "STRONG INDICATION", text: "The reported combination of leverage unwinding, foreign positioning and heavy index concentration is consistent with a flow-driven volatility amplifier; it is not proof of a single cause.", sourceName: "Assessment methodology", sourceUrl: "#methodology" },
    { level: "NOT VERIFIABLE", text: "Daily public investor categories do not reveal the beneficial owner behind every order, so an individual hedge fund's exact contribution cannot be calculated from public data alone.", sourceName: "Public-data limitation", sourceUrl: "#limitations" },
  ],
} as const;

export const fundFlowOfficialSources = [
  { type: "EXCHANGE", name: "KRX Data Marketplace", description: "Investor trading, program trading, ETF portfolio files, short-sale statistics and derivatives data.", url: "https://data.krx.co.kr/" },
  { type: "REGULATOR", name: "Financial Services Commission", description: "Official market-stability measures and rules for leveraged ETF and ETN products.", url: "https://www.fsc.go.kr/no010101/87353" },
  { type: "CENTRAL BANK", name: "Bank of Korea ECOS", description: "Official exchange-rate, monetary and financial time series for cross-market checks.", url: "https://ecos.bok.or.kr/" },
] as const;

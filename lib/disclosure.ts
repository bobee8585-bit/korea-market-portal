import { DisclosureEventType } from "@prisma/client";

const rules: Array<[RegExp, DisclosureEventType]> = [
  [/배당|현금배당|주식배당|dividend/i, "DIVIDEND"],
  [/자기주식.*소각|자사주.*소각|cancel(?:lation)? of (?:treasury )?shares/i, "SHARE_CANCELLATION"],
  [/자기주식.*취득|자사주.*취득|acquisition of (?:treasury|own) shares|share buyback/i, "SHARE_BUYBACK"],
  [/유상증자|capital increase with consideration|rights offering/i, "CAPITAL_INCREASE"],
  [/전환사채|신주인수권부사채|교환사채|사채권|convertible bond|bond with warrant|exchangeable bond/i, "BOND"],
  [/합병|merger/i, "MERGER"],
  [/분할|spin-?off|company split|corporate division/i, "SPINOFF"],
  [/타법인.*주식.*취득|영업양수|자산양수|acquisition of (?:shares|business|assets)/i, "ACQUISITION"],
  [/단일판매|공급계약|수주계약|single sales contract|supply contract|major contract/i, "MAJOR_CONTRACT"],
  [/최대주주.*변경|주요주주.*변동|change in largest shareholder|executives? and major shareholders?|ownership of specific securities/i, "OWNERSHIP_CHANGE"],
  [/시설투자|신규시설|투자결정|facility investment|investment decision/i, "INVESTMENT"],
  [/소송|중재|분쟁|lawsuit|litigation|arbitration|legal dispute/i, "LITIGATION"],
  [/거래정지|상장폐지|관리종목|trading suspension|delisting|administrative issue/i, "TRADING_STATUS"],
  [/잠정실적|영업.*실적|매출액.*손익|사업보고서|분기보고서|반기보고서|provisional earnings|business report|quarterly report|semi-annual report|annual report/i, "EARNINGS"],
  [/기업설명회|investor relations|corporate presentation|IR event/i, "COMPANY_IR"],
];

export function classifyDisclosure(reportName: string): DisclosureEventType {
  for (const [pattern, eventType] of rules) {
    if (pattern.test(reportName)) return eventType;
  }
  return "OTHER";
}

export function parseDartDate(value: string) {
  if (!/^\d{8}$/.test(value)) throw new Error(`Invalid DART date: ${value}`);
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  return new Date(Date.UTC(year, month - 1, day));
}

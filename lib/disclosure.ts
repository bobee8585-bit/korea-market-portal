import { DisclosureEventType } from "@prisma/client";

const rules: Array<[RegExp, DisclosureEventType]> = [
  [/배당|현금배당|주식배당/i, "DIVIDEND"],
  [/자기주식.*취득|자사주.*취득/i, "SHARE_BUYBACK"],
  [/자기주식.*소각|자사주.*소각/i, "SHARE_CANCELLATION"],
  [/유상증자/i, "CAPITAL_INCREASE"],
  [/전환사채|신주인수권부사채|교환사채|사채권/i, "BOND"],
  [/합병/i, "MERGER"],
  [/분할/i, "SPINOFF"],
  [/타법인.*주식.*취득|영업양수|자산양수/i, "ACQUISITION"],
  [/단일판매|공급계약|수주계약/i, "MAJOR_CONTRACT"],
  [/최대주주.*변경|주요주주.*변동/i, "OWNERSHIP_CHANGE"],
  [/시설투자|신규시설|투자결정/i, "INVESTMENT"],
  [/소송|중재|분쟁/i, "LITIGATION"],
  [/거래정지|상장폐지|관리종목/i, "TRADING_STATUS"],
  [/잠정실적|영업.*실적|매출액.*손익|사업보고서|분기보고서|반기보고서/i, "EARNINGS"],
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

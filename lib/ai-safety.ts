const BLOCKED_KO = [
  /사라/,
  /팔아라/,
  /매수(하|해|를 권| 추천)/,
  /매도(하|해|를 권| 추천)/,
  /손절(하|해)/,
  /목표가[^\n]{0,20}(제시|추천)/,
];

const BLOCKED_EN = [
  /\bbuy\s+(this|now|shares?)\b/i,
  /\bsell\s+(this|now|shares?)\b/i,
  /\bstrong\s+buy\b/i,
  /\bstrong\s+sell\b/i,
  /\bentry\s+price\b/i,
  /\bexit\s+price\b/i,
];

export type SafetyCheck = {
  ok: boolean;
  reasons: string[];
};

export function checkInvestmentAdviceSafety(text: string): SafetyCheck {
  const reasons: string[] = [];
  for (const pattern of [...BLOCKED_KO, ...BLOCKED_EN]) {
    if (pattern.test(text)) reasons.push(`blocked-pattern:${pattern.source}`);
  }
  return { ok: reasons.length === 0, reasons };
}

export function assertSafeForPublication(text: string): void {
  const result = checkInvestmentAdviceSafety(text);
  if (!result.ok) throw new Error(`AI_OUTPUT_BLOCKED:${result.reasons.join(",")}`);
}

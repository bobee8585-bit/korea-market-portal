const DART_BASE_URL = "https://opendart.fss.or.kr/api";
const DART_VIEWER_URL = "https://dart.fss.or.kr/dsaf001/main.do";

export type DartDisclosureItem = {
  corp_code: string;
  corp_name: string;
  stock_code?: string;
  corp_cls?: string;
  report_nm: string;
  rcept_no: string;
  flr_nm?: string;
  rcept_dt: string;
  rm?: string;
};

export type DartListResponse = {
  status: string;
  message: string;
  page_no?: number;
  page_count?: number;
  total_count?: number;
  total_page?: number;
  list?: DartDisclosureItem[];
};

function getApiKey() {
  const apiKey = process.env.OPENDART_API_KEY;
  if (!apiKey) throw new Error("OPENDART_API_KEY is not configured");
  return apiKey;
}

function assertDartOk(status: string, message: string) {
  if (status === "000" || status === "013") return;
  throw new Error(`OpenDART ${status}: ${message}`);
}

export function dartDisclosureUrl(receiptNo: string) {
  return `${DART_VIEWER_URL}?rcpNo=${encodeURIComponent(receiptNo)}`;
}

export async function fetchDartDisclosures(params: {
  corpCode?: string;
  beginDate?: string;
  endDate?: string;
  pageNo?: number;
  pageCount?: number;
}) {
  const search = new URLSearchParams({
    crtfc_key: getApiKey(),
    page_no: String(params.pageNo ?? 1),
    page_count: String(params.pageCount ?? 100),
  });

  if (params.corpCode) search.set("corp_code", params.corpCode);
  if (params.beginDate) search.set("bgn_de", params.beginDate);
  if (params.endDate) search.set("end_de", params.endDate);

  const response = await fetch(`${DART_BASE_URL}/list.json?${search}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "unknown";
  const raw = await response.text();
  if (!response.ok) throw new Error(`OpenDART HTTP ${response.status} (${contentType})`);
  let data: DartListResponse;
  try {
    data = JSON.parse(raw) as DartListResponse;
  } catch {
    const title = raw.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "HTML response";
    throw new Error(`OpenDART non-JSON response (${contentType}): ${title}`);
  }
  assertDartOk(data.status, data.message);
  return data;
}

export async function fetchDartCompany(corpCode: string) {
  const search = new URLSearchParams({
    crtfc_key: getApiKey(),
    corp_code: corpCode,
  });

  const response = await fetch(`${DART_BASE_URL}/company.json?${search}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`OpenDART HTTP ${response.status}`);

  const data = await response.json();
  assertDartOk(data.status, data.message);
  return data;
}

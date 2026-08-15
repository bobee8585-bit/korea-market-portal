import { unzipSync, strFromU8 } from "fflate";

const CORP_CODE_URL = "https://opendart.fss.or.kr/api/corpCode.xml";

export type DartCorpMasterItem = {
  corpCode: string;
  corpName: string;
  stockCode: string | null;
  modifyDate: string;
};

function getApiKey() {
  const apiKey = process.env.OPENDART_API_KEY;
  if (!apiKey) throw new Error("OPENDART_API_KEY is not configured");
  return apiKey;
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

export async function fetchDartCorpMaster(): Promise<DartCorpMasterItem[]> {
  const url = `${CORP_CODE_URL}?crtfc_key=${encodeURIComponent(getApiKey())}`;
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/zip, application/octet-stream;q=0.9, */*;q=0.8",
      Referer: "https://opendart.fss.or.kr/",
      "User-Agent": "KoreaMarketPortal/1.0 (+https://korea-market-portal.vercel.app)",
    },
  });
  if (!response.ok) throw new Error(`OpenDART corpCode HTTP ${response.status}`);

  const zipped = new Uint8Array(await response.arrayBuffer());
  let files: ReturnType<typeof unzipSync>;
  try {
    files = unzipSync(zipped);
  } catch {
    const preview = new TextDecoder().decode(zipped.slice(0, 300)).replace(/\s+/g, " ");
    throw new Error(`OpenDART corpCode returned a non-ZIP response: ${preview}`);
  }
  const xmlFile = Object.entries(files).find(([name]) => name.toLowerCase().endsWith(".xml"));
  if (!xmlFile) throw new Error("OpenDART corpCode archive did not contain XML");

  const xml = strFromU8(xmlFile[1]);
  const blocks = xml.match(/<list>[\s\S]*?<\/list>/gi) ?? [];

  return blocks
    .map((block) => ({
      corpCode: tag(block, "corp_code"),
      corpName: tag(block, "corp_name"),
      stockCode: tag(block, "stock_code") || null,
      modifyDate: tag(block, "modify_date"),
    }))
    .filter((item) => item.corpCode && item.corpName);
}

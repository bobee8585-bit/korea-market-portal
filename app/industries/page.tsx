import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { industryCatalog } from "@/lib/industry-catalog";

export const metadata: Metadata = { title: "Korea Industry Map" };

export default function Page() {
  return <InfoPage eyebrow="KOREA INDUSTRY MAP" title="Korea's industrial strength extends across connected manufacturing systems." intro="This first expansion maps food, chemicals, refining, steel and biohealth through public institutions, regulators and industry associations. It does not publish unsupported global rankings.">
    <div className="evidenceNotice"><strong>Publication rule</strong><p>A sector can be important without being labelled “world number one.” Rank, capacity, export and market-share claims appear only with a dated definition and a comparable source.</p></div>
    <div className="industryCatalog">{industryCatalog.map((industry) => <section id={industry.slug} key={industry.slug}>
      <span>{industry.koreanName}</span><h2>{industry.name}</h2><p>{industry.summary}</p>
      <ol className="industryChain">{industry.chain.map((stage) => <li key={stage}>{stage}</li>)}</ol>
      <div className="sourceList">{industry.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><small>{source.type}</small><strong>{source.name}</strong><span>Open original source ↗</span></a>)}</div>
    </section>)}</div>
    <h2>Expansion method</h2><p>Each sector will be expanded from source map to products, facilities, companies and international comparisons only after the relevant evidence has been checked. Company statements remain attributed to the company; regulatory status remains attributed to the regulator.</p>
  </InfoPage>;
}

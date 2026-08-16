import { publicSourceHubs } from "@/lib/public-source-hubs";

export function OfficialSourceHub({ section }: { section: keyof typeof publicSourceHubs }) {
  return <section className="panel officialSourceHub">
    <div className="panelHeader"><div><span className="eyebrow">OFFICIAL SOURCE DIRECTORY</span><h2>Continue with primary sources</h2></div></div>
    <p className="sourceMethodNote">These are direct links to official source portals, not locally ingested records. KorPulse does not present them as a live feed or translate their contents without an applicable rights basis.</p>
    <div className="sourceList">{publicSourceHubs[section].map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><small>{source.type}</small><strong>{source.name}</strong><span>{source.description} ↗</span></a>)}</div>
  </section>;
}

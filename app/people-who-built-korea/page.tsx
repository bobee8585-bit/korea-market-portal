import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The People Who Built Korea",
  description: "A source-led history of Korea's industrial rise and the people whose work made it possible.",
  alternates: { canonical: "/people-who-built-korea" },
};

const chapters = [
  {
    years: "1950s",
    title: "From war damage to reconstruction",
    text: "The Korean War devastated lives and industrial capacity. Reconstruction depended on workers, engineers, entrepreneurs, public institutions and international assistance—not on a single hero or a simple miracle.",
    media: "DOCUMENTS + PHOTOGRAPHS",
    source: "National Archives of Korea",
    href: "https://theme.archives.go.kr/next/economicDevelopment/viewMain.do",
  },
  {
    years: "1960s",
    title: "Factories, exports and new industrial cities",
    text: "Export-oriented production expanded and industrial complexes began to reshape the country. Behind the plans were long shifts on assembly lines, construction sites, docks and mines.",
    media: "PHOTOGRAPH ARCHIVE",
    source: "1960s industrial complexes — National Archives",
    href: "https://theme.archives.go.kr/next/industry/special1960.do",
  },
  {
    years: "1970",
    title: "Jeon Tae-il and the dignity of work",
    text: "Jeon Tae-il drew national attention to dangerous conditions and the failure to protect garment workers under existing labor law. His life remains inseparable from any honest account of Korea's industrial development.",
    media: "MEMORIAL + MEDIA ARCHIVE",
    source: "Jeon Tae-il Foundation",
    href: "https://chuntaeil.org/",
  },
  {
    years: "1970s",
    title: "Steel, shipbuilding and heavy industry",
    text: "Investment in steel, machinery, chemicals and shipbuilding widened Korea's manufacturing base. The achievement came with high human, social and environmental costs that must remain visible alongside production milestones.",
    media: "OFFICIAL RECORDS",
    source: "Heavy and chemical industry — National Archives",
    href: "https://www.archives.go.kr/next/newsearch/listSubjectDescription.do?id=002471&sitePage=1-2-1",
  },
  {
    years: "1980s–1990s",
    title: "Workers claimed a stronger voice",
    text: "Industrial growth continued as organized labor and democratization changed workplaces and public life. Guro Industrial Complex shows both sides of this history: export production and worker resistance.",
    media: "HISTORY + IMAGES",
    source: "Guro workers — National Institute of Korean History",
    href: "https://contents.history.go.kr/mobile/kc/view.do?code=kc_age_50&levelId=kc_r500100",
  },
  {
    years: "2000s–TODAY",
    title: "Advanced manufacturing, built on accumulated skill",
    text: "Semiconductors, displays, vehicles, batteries and advanced ships grew from decades of accumulated production knowledge. KorPulse will connect today's companies to that human and industrial history with verifiable evidence.",
    media: "ARCHIVE COLLECTION",
    source: "Korea's exports — National Archives",
    href: "https://theme.archives.go.kr/next/koreaOfRecord/export.do",
  },
] as const;

export default function PeopleWhoBuiltKoreaPage() {
  return (
    <main className="shell historyPage">
      <header className="topbar">
        <a className="brandBlock" href="/">
          <div className="brand">KorPulse</div>
          <div className="subtitle">Korea Industry Intelligence</div>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="/companies">Companies</a>
          <a href="/#ecosystems">Ecosystems</a>
          <a className="active" href="/people-who-built-korea">Industrial Journey</a>
          <a href="/korea-inside">Korea Inside</a>
          <a href="/news">News & Research</a>
        </nav>
      </header>

      <section className="historyHero">
        <span className="eyebrow">THE PEOPLE WHO BUILT KOREA</span>
        <h1>Built by people.<br />Proven by industry.</h1>
        <p className="historyLead">
          Korea&apos;s industrial rise is extraordinary. Its full history belongs not only to companies and policy,
          but to the people who worked in factories, mines, shipyards, laboratories and offices—and to those who
          demanded safer, fairer work.
        </p>
        <div className="historyPromise">
          <strong>No mythmaking. No erased sacrifice.</strong>
          <span>Official and scholarly sources first</span>
          <span>Achievement and human cost shown together</span>
          <span>Images and video used only with clear rights or by linking to the original archive</span>
        </div>
      </section>

      <section className="historySection">
        <div className="historySectionIntro">
          <span className="eyebrow">A LIVING INDUSTRIAL HISTORY</span>
          <h2>From reconstruction to advanced manufacturing</h2>
          <p>Each chapter opens the original public archive in a new tab so readers can inspect the record themselves.</p>
        </div>
        <div className="historyTimeline">
          {chapters.map((chapter) => (
            <article className="historyChapter" key={`${chapter.years}-${chapter.title}`}>
              <div className="historyYear">{chapter.years}</div>
              <div className="historyCopy">
                <h3>{chapter.title}</h3>
                <p>{chapter.text}</p>
              </div>
              <a className="archiveCard" href={chapter.href} target="_blank" rel="noreferrer">
                <span className="archiveVisual" aria-hidden="true"><i>↗</i></span>
                <span className="archiveType">{chapter.media}</span>
                <strong>{chapter.source}</strong>
                <small>Open official source ↗</small>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="historySection visualArchive">
        <div className="historySectionIntro">
          <span className="eyebrow">PHOTOGRAPHS WITH TRACEABLE RIGHTS</span>
          <h2>Damage, steel and shipbuilding</h2>
          <p>Historical records and present-day industrial landscapes are dated separately so a modern photograph is never presented as an image from the 1970s.</p>
        </div>
        <div className="industrialPhotoGrid">
          <a href="https://commons.wikimedia.org/wiki/File:Central_Government_Building_Korean_War.jpg" target="_blank" rel="noreferrer" className="industrialPhoto industrialPhotoWide">
            <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Central%20Government%20Building%20Korean%20War.jpg?width=1280" alt="Central Government Building in Seoul during the Korean War" />
            <span><b>WAR AND DESTRUCTION · 1950</b><strong>Seoul during the Korean War</strong><small>SFC Cecil L. Riley · U.S. Government work · Public domain</small></span>
          </a>
          <a href="https://commons.wikimedia.org/wiki/File:%ED%8F%AC%EC%8A%A4%EC%BD%94_%ED%8F%AC%ED%95%AD.jpg" target="_blank" rel="noreferrer" className="industrialPhoto">
            <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/%ED%8F%AC%EC%8A%A4%EC%BD%94%20%ED%8F%AC%ED%95%AD.jpg?width=1280" alt="Panoramic view of the POSCO steel mill in Pohang" />
            <span><b>INDUSTRIAL LEGACY · 2020</b><strong>Pohang steel mill</strong><small>Aatu Dorochenko · CC BY-SA 4.0</small></span>
          </a>
          <a href="https://commons.wikimedia.org/wiki/File:Hyundai_Heavy_Industries_Ulsan_Shipyard_from_Jujeon_Beacon_Mound_-_2023-07-24.jpg" target="_blank" rel="noreferrer" className="industrialPhoto">
            <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Hyundai%20Heavy%20Industries%20Ulsan%20Shipyard%20from%20Jujeon%20Beacon%20Mound%20-%202023-07-24.jpg?width=1280" alt="Ulsan shipyard seen from Jujeon Beacon Mound" />
            <span><b>INDUSTRIAL LEGACY · 2023</b><strong>Ulsan shipyard</strong><small>Wvdp · CC0 1.0</small></span>
          </a>
        </div>
      </section>

      <section className="historySection videoRecords">
        <div className="historySectionIntro">
          <span className="eyebrow">WATCH THE ORIGINAL RECORD</span>
          <h2>History in motion</h2>
          <p>Videos play on the institution that published them. KorPulse does not copy or re-upload protected footage.</p>
        </div>
        <div className="videoRecordGrid">
          <a className="videoRecordCard" href="https://www.ktv.go.kr/program/home/PG2150034D/content/515542" target="_blank" rel="noreferrer">
            <span className="videoRecordPoster tradeFilm"><i aria-hidden="true">▶</i><b>KTV · ARCHIVAL NEWS</b></span>
            <span className="videoRecordCopy"><small>OFFICIAL VIDEO · KOREAN</small><strong>From early exports to a major trading nation</strong><p>KTV traces changes in Korea&apos;s exports through historical Daehan News footage.</p><em>Watch on KTV ↗</em></span>
          </a>
          <a className="videoRecordCard" href="https://chuntaeil.org/" target="_blank" rel="noreferrer">
            <span className="videoRecordPoster laborFilm"><i aria-hidden="true">▶</i><b>JEON TAE-IL FOUNDATION</b></span>
            <span className="videoRecordCopy"><small>OFFICIAL VIDEO ARCHIVE · KOREAN</small><strong>Memory, labor and solidarity</strong><p>Continue to the foundation&apos;s official films and records about Jeon Tae-il and Korea&apos;s labor movement.</p><em>Open the foundation archive ↗</em></span>
          </a>
        </div>
      </section>

      <section className="personFeature">
        <figure className="personMedia">
          <div className="personPhotoGrid">
            <img
              src="https://commons.wikimedia.org/wiki/Special:Redirect/file/%EC%A0%84%ED%83%9C%EC%9D%BC%20%ED%9D%89%EC%83%81.jpg?width=960"
              alt="Bust of Jeon Tae-il on Jeon Tae-il Bridge in Seoul"
            />
            <img
              src="https://commons.wikimedia.org/wiki/Special:Redirect/file/%EC%A0%84%ED%83%9C%EC%9D%BC%EB%B0%95%EB%AC%BC%EA%B4%80.jpg?width=960"
              alt="Exterior of the Jeon Tae-il Memorial Museum in Seoul"
            />
          </div>
          <figcaption>
            Jeon Tae-il bust: Dalgial, CC BY-SA 3.0 · Memorial museum: Onnew, CC BY-SA 4.0 · via Wikimedia Commons
          </figcaption>
        </figure>
        <div>
          <span className="eyebrow">A PERSON WE MUST REMEMBER</span>
          <h2>Jeon Tae-il</h2>
          <p className="personQuote">Industrial progress has meaning only when the dignity of the worker progresses with it.</p>
          <p>
            A garment worker in Seoul&apos;s Peace Market, Jeon Tae-il studied the Labor Standards Act and sought
            protection for workers facing long hours and unsafe conditions. His death in 1970 became a decisive
            moment in Korea&apos;s labor history. KorPulse presents him not as a decorative symbol, but as a standard
            against which industrial progress must be examined.
          </p>
          <a className="primaryLink" href="https://chuntaeil.org/" target="_blank" rel="noreferrer">
            Visit the Jeon Tae-il Foundation archive ↗
          </a>
        </div>
      </section>

      <section className="historySection futureVoices">
        <span className="eyebrow">NEXT COLLECTION</span>
        <h2>Voices from the factory floor</h2>
        <p>
          Future oral histories will be published only with informed consent, clear attribution and protection for
          personal safety. Engineers, technicians, line workers, migrant workers and retired craftspeople will be
          treated as historical witnesses—not as background scenery.
        </p>
      </section>

      <footer className="historyFooter">
        <strong>Editorial standard</strong>
        <p>KorPulse separates verified fact, testimony and editorial interpretation. Corrections will be dated and visible.</p>
        <a href="/">Return to KorPulse →</a>
      </footer>
    </main>
  );
}

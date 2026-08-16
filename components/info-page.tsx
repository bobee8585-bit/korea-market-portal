import type { ReactNode } from "react";

export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <main className="shell infoPage">
      <header className="topbar">
        <a href="/" className="brandBlock"><div className="brand">KorPulse</div><div className="subtitle">Korea Industry Intelligence</div></a>
        <nav className="nav"><a href="/">Home</a><a href="/advertise">Advertise</a><a href="/contact">Contact</a></nav>
      </header>
      <section className="infoHero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></section>
      <article className="panel infoContent">{children}</article>
    </main>
  );
}

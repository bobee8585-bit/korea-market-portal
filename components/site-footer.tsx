const footerLinks = [
  ["/about", "About"],
  ["/advertise", "Advertise"],
  ["/editorial-policy", "Editorial Policy"],
  ["/disclaimer", "Disclaimer"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/contact", "Contact"],
] as const;

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div>
        <strong>KorPulse</strong>
        <p>Independent Korea industry intelligence built from official and rights-cleared sources.</p>
      </div>
      <nav aria-label="Legal and company information">
        {footerLinks.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
      </nav>
      <small>Information only. No investment recommendation or trading instruction.</small>
    </footer>
  );
}

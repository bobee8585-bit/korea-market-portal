export default function NotFound() {
  return (
    <main className="shell statusPage">
      <section className="panel emptyState">
        <span className="eyebrow">404</span>
        <h1>Page not found.</h1>
        <p>The requested company, ecosystem, or page is not available in the verified public dataset.</p>
        <div className="statusActions"><a href="/">Return home</a></div>
      </section>
    </main>
  );
}

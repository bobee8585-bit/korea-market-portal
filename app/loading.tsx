export default function Loading() {
  return (
    <main className="shell statusPage" aria-busy="true" aria-live="polite">
      <section className="panel emptyState">
        <span className="eyebrow">LOADING VERIFIED DATA</span>
        <h1>Preparing the public evidence view…</h1>
      </section>
    </main>
  );
}

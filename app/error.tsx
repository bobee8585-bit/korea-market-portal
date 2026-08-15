"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page rendering failed", error);
  }, [error]);

  return (
    <main className="shell statusPage">
      <section className="panel emptyState" role="alert">
        <span className="eyebrow">SERVICE STATUS</span>
        <h1>This page is temporarily unavailable.</h1>
        <p>The public data service could not complete the request. No information has been inferred or substituted.</p>
        <div className="statusActions">
          <button type="button" onClick={reset}>Try again</button>
          <a href="/">Return home</a>
        </div>
      </section>
    </main>
  );
}

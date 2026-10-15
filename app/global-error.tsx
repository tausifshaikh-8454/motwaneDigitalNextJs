"use client";

/**
 * Last-resort error page (used if the root layout itself fails).
 * Generic message only; no internal details are exposed. Inline styles are used
 * because global CSS isn't loaded here.
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", color: "#1a1a1a", textAlign: "center", padding: "120px 16px" }}>
        <title>Something went wrong | Motwane Digital</title>
        <h1 style={{ color: "#0d6cb3" }}>Something went wrong</h1>
        <p>We couldn&apos;t load this page. Please try again in a moment.</p>
        {error.digest && <p style={{ fontSize: 14, opacity: 0.7 }}>Reference: {error.digest}</p>}
        <button
          type="button"
          onClick={() => retry()}
          style={{ marginTop: 24, padding: "12px 24px", border: 0, background: "#0d6cb3", color: "#fff", cursor: "pointer" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

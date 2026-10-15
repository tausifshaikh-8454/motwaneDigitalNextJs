"use client";

/**
 * Shown when a page fails to render (e.g. WordPress is temporarily unreachable).
 * Deliberately generic: no error message or stack trace is shown to visitors.
 * The `digest` lets you find the full error in the server logs.
 */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="container-site py-32 text-center">
      <h1 className="text-h1 font-bold text-primary">Something went wrong</h1>
      <p className="mt-4 text-lg text-body">We couldn&apos;t load this page. Please try again in a moment.</p>
      {error.digest && <p className="mt-2 text-sm text-body">Reference: {error.digest}</p>}
      <button
        type="button"
        onClick={() => retry()}
        className="mt-8 inline-block bg-primary-bright px-6 py-3 font-medium text-white transition-colors hover:bg-primary"
      >
        Try again
      </button>
    </section>
  );
}

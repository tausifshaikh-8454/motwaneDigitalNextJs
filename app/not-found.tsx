import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-site py-32 text-center">
      <h1 className="text-h1 font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-body">The page you are looking for could not be found.</p>
      <Link
        href="/"
        className="mt-8 inline-block bg-primary-bright px-6 py-3 font-medium text-white transition-colors hover:bg-primary"
      >
        Back to Home
      </Link>
    </section>
  );
}

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer id="contact" className="mt-auto px-4 pb-8 pt-8 sm:px-6">
      <div className="glass-panel mx-auto max-w-6xl overflow-hidden rounded-[2rem] p-8 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_0.9fr]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight text-[var(--foreground)] sm:text-4xl">
              Let&apos;s build your
              <br />
              language future
            </h2>
            <Link
              href="/register"
              className="btn-glass-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
            >
              Get started
            </Link>
          </div>

          <div className="glass-panel-strong rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li>hello@lingora.learn</li>
              <li>Language courses online</li>
              <li>
                <Link href="/verify" className="text-sky-700 hover:underline">
                  Verify a certificate
                </Link>
              </li>
            </ul>
            <div className="mt-6 flex gap-4 text-sm font-medium text-[var(--foreground)]">
              <Link href="/courses" className="hover:text-sky-700">
                Courses
              </Link>
              <Link href="/language-tests" className="hover:text-sky-700">
                Tests
              </Link>
              <Link href="/cart" className="hover:text-sky-700">
                Cart
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold">
                Learn. Listen. Certify.
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Text lessons with voice narration and verifiable certificates.
              </p>
            </div>
            <p className="mt-8 text-xs text-[var(--muted)]">
              © {new Date().getFullYear()} Lingora · Designing tomorrow. Today.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

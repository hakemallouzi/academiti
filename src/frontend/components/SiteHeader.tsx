import Link from "next/link";
import { auth } from "@/backend/auth/auth";
import { getCartCount } from "@/backend/services/cart";
import { logoutAction } from "@/backend/actions";

export async function SiteHeader() {
  const session = await auth();
  const cartCount = session?.user?.id
    ? await getCartCount(session.user.id)
    : 0;

  const links = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/language-tests", label: "Tests" },
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="glass-panel pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2.5 shadow-lg shadow-sky-900/5 sm:px-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--foreground)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8ad4ff] to-[#3aa8f0] text-sm text-white shadow-md shadow-sky-400/40">
            L
          </span>
          Lingora
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition hover:text-[var(--foreground)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/cart"
            className="rounded-full border border-white/80 bg-glass px-3 py-1.5 text-[var(--foreground)] backdrop-blur hover:bg-white/40"
          >
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/account"
                className="hidden rounded-full px-3 py-1.5 text-[var(--muted)] hover:text-[var(--foreground)] sm:inline"
              >
                Account
              </Link>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="hidden rounded-full px-3 py-1.5 text-sky-700 sm:inline"
                >
                  Admin
                </Link>
              )}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-full px-3 py-1.5 text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-3 py-1.5 text-[var(--muted)] hover:text-[var(--foreground)] sm:inline"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="btn-glass-primary rounded-full px-4 py-1.5 text-sm font-semibold"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

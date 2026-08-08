import Link from "next/link";
import { requireAdmin } from "@/backend/auth/session";
import { prisma } from "@/backend/db/prisma";

export const metadata = { title: "Admin" };

export default async function AdminHomePage() {
  await requireAdmin();
  const [courses, tests, orders, users] = await Promise.all([
    prisma.course.count(),
    prisma.languageTest.count(),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.user.count(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-teal-950">
        Admin
      </h1>
      <p className="mt-2 text-stone-600">
        Upload and manage courses, lessons, and language tests.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Courses", value: courses },
          { label: "Tests", value: tests },
          { label: "Paid orders", value: orders },
          { label: "Users", value: users },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/80 bg-glass p-5"
          >
            <p className="text-sm text-stone-500">{s.label}</p>
            <p className="mt-1 text-3xl font-semibold text-teal-950">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/admin/courses"
          className="rounded-xl bg-teal-900 px-5 py-3 text-sm font-semibold text-[#f7f3eb]"
        >
          Manage courses
        </Link>
        <Link
          href="/admin/tests"
          className="rounded-xl border border-teal-900/20 px-5 py-3 text-sm font-semibold text-teal-950"
        >
          Manage language tests
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-xl border border-teal-900/20 px-5 py-3 text-sm font-semibold text-teal-950"
        >
          Orders
        </Link>
      </div>
    </div>
  );
}

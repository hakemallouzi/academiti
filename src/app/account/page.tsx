import Link from "next/link";
import { requireUser } from "@/backend/auth/session";
import { getUserEnrollments } from "@/backend/services/orders";
import { prisma } from "@/backend/db/prisma";

export const metadata = { title: "Account" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const user = await requireUser();
  const { checkout } = await searchParams;
  const enrollments = await getUserEnrollments(user.id);
  const certificates = await prisma.certificate.findMany({
    where: { userId: user.id },
    include: { course: true },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-teal-950">
        Hello, {user.name}
      </h1>
      <p className="mt-2 text-stone-600">{user.email}</p>

      {checkout === "success" && (
        <p className="mt-6 rounded-xl border border-teal-700/30 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          Purchase complete — your courses are ready below.
        </p>
      )}

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-teal-950">
          My courses
        </h2>
        {enrollments.length === 0 ? (
          <p className="mt-4 text-stone-500">
            No enrollments yet.{" "}
            <Link href="/courses" className="text-teal-800 hover:underline">
              Browse courses
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {enrollments.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between rounded-xl border border-white/80 bg-glass px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-teal-950">{e.course.title}</p>
                  <p className="text-sm text-stone-500">
                    {e.course.language} · {e.course._count.lessons} lessons
                  </p>
                </div>
                <Link
                  href={`/learn/${e.courseId}`}
                  className="rounded-lg bg-teal-900 px-3 py-1.5 text-sm text-[#f7f3eb]"
                >
                  Learn
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-teal-950">
          Certificates
        </h2>
        {certificates.length === 0 ? (
          <p className="mt-4 text-stone-500">
            Complete all lessons in a course to earn a certificate.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {certificates.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-white/80 bg-glass px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{c.course.title}</p>
                  <p className="text-sm text-stone-500">Code: {c.code}</p>
                </div>
                <Link
                  href={`/certificates/${c.id}`}
                  className="text-sm text-teal-800 hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

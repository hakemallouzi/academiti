import Link from "next/link";
import { requireAdmin } from "@/backend/auth/session";
import { prisma } from "@/backend/db/prisma";
import { deleteTestAction } from "@/backend/actions";

export default async function AdminTestsPage() {
  await requireAdmin();
  const tests = await prisma.languageTest.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { questions: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
          Language tests
        </h1>
        <Link
          href="/admin/tests/new"
          className="rounded-xl bg-teal-900 px-4 py-2 text-sm font-semibold text-[#f7f3eb]"
        >
          New test
        </Link>
      </div>
      <ul className="mt-8 space-y-3">
        {tests.map((t) => (
          <li
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/80 bg-glass px-4 py-3"
          >
            <div>
              <p className="font-semibold">{t.title}</p>
              <p className="text-sm text-stone-500">
                {t.language} · {t._count.questions} questions
                {!t.published ? " · draft" : ""}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/admin/tests/${t.id}`} className="text-teal-800 hover:underline">
                Edit / questions
              </Link>
              <form action={deleteTestAction.bind(null, t.id)}>
                <button type="submit" className="text-red-700">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

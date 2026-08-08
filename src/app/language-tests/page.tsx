import Link from "next/link";
import { listPublishedTests } from "@/backend/services/tests";

export const metadata = { title: "Language tests" };

export default async function LanguageTestsPage() {
  const tests = await listPublishedTests();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-teal-950">
        Language tests
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Free placement-style quizzes uploaded by our team. Get a band estimate and course recommendations.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {tests.map((test) => (
          <Link
            key={test.id}
            href={`/language-tests/${test.slug}`}
            className="rounded-2xl border border-white/80 bg-glass p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              {test.language}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-teal-950">
              {test.title}
            </h2>
            <p className="mt-2 text-sm text-stone-600">{test.description}</p>
            <p className="mt-4 text-sm text-stone-500">
              {test._count.questions} questions
              {test.priceCents === 0 ? " · Free" : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

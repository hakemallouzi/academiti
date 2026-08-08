import { notFound } from "next/navigation";
import { requireAdmin } from "@/backend/auth/session";
import { prisma } from "@/backend/db/prisma";
import {
  deleteQuestionAction,
  upsertQuestionAction,
  upsertTestAction,
} from "@/backend/actions";

export default async function AdminTestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const test = await prisma.languageTest.findUnique({
    where: { id },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!test) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
        Edit test
      </h1>
      <form action={upsertTestAction} className="mt-8 space-y-4">
        <input type="hidden" name="id" value={test.id} />
        <input name="title" defaultValue={test.title} required className="w-full rounded-xl border border-stone-300 px-3 py-2" />
        <input name="slug" defaultValue={test.slug} className="w-full rounded-xl border border-stone-300 px-3 py-2" />
        <input name="language" defaultValue={test.language} required className="w-full rounded-xl border border-stone-300 px-3 py-2" />
        <textarea name="description" defaultValue={test.description} required rows={3} className="w-full rounded-xl border border-stone-300 px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked={test.published} />
          Published
        </label>
        <button type="submit" className="rounded-xl bg-teal-900 px-4 py-2 text-sm font-semibold text-[#f7f3eb]">
          Save test
        </button>
      </form>

      <h2 className="mt-14 font-[family-name:var(--font-display)] text-2xl">Questions</h2>
      <ul className="mt-4 space-y-4">
        {test.questions.map((q) => {
          const options = JSON.parse(q.optionsJson) as string[];
          return (
            <li key={q.id} className="rounded-xl border border-white/80 bg-glass p-4">
              <p className="font-medium">
                {q.order}. {q.prompt}
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Correct: {options[q.correctIndex]}
              </p>
              <form action={deleteQuestionAction.bind(null, q.id, test.id)} className="mt-2">
                <button type="submit" className="text-sm text-red-700">
                  Delete
                </button>
              </form>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-10 text-lg font-semibold">Add question</h3>
      <form action={upsertQuestionAction} className="mt-4 space-y-3">
        <input type="hidden" name="testId" value={test.id} />
        <input
          name="order"
          type="number"
          defaultValue={test.questions.length + 1}
          className="w-full rounded-xl border border-stone-300 px-3 py-2"
        />
        <textarea
          name="prompt"
          required
          placeholder="Question prompt"
          className="w-full rounded-xl border border-stone-300 px-3 py-2"
        />
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            name={`option${i}`}
            required
            placeholder={`Option ${i + 1}`}
            className="w-full rounded-xl border border-stone-300 px-3 py-2"
          />
        ))}
        <label className="block text-sm">
          Correct option index (0–3)
          <input
            name="correctIndex"
            type="number"
            min={0}
            max={3}
            defaultValue={0}
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded-xl bg-teal-900 px-4 py-2 text-sm font-semibold text-[#f7f3eb]">
          Add question
        </button>
      </form>
    </div>
  );
}

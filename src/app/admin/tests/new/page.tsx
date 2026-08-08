import { requireAdmin } from "@/backend/auth/session";
import { upsertTestAction } from "@/backend/actions";

export default async function NewTestPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
        New language test
      </h1>
      <form action={upsertTestAction} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="text-stone-600">Title</span>
          <input name="title" required className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Slug (optional)</span>
          <input name="slug" className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Language</span>
          <input name="language" required className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Description</span>
          <textarea name="description" required rows={3} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2" />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked />
          Published
        </label>
        <button type="submit" className="rounded-xl bg-teal-900 px-5 py-2.5 text-sm font-semibold text-[#f7f3eb]">
          Save test
        </button>
      </form>
    </div>
  );
}

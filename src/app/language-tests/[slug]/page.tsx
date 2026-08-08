import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/backend/auth/session";
import { getTestBySlug } from "@/backend/services/tests";
import { TestTaker } from "@/frontend/components/TestTaker";

export default async function TakeTestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getSessionUser();
  if (!user) {
    const { slug } = await params;
    redirect(`/login?callbackUrl=/language-tests/${slug}`);
  }

  const { slug } = await params;
  const test = await getTestBySlug(slug);
  if (!test) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-teal-950">
        {test.title}
      </h1>
      <p className="mt-2 text-stone-600">{test.description}</p>
      <div className="mt-10">
        <TestTaker testId={test.id} questions={test.questions} />
      </div>
    </div>
  );
}

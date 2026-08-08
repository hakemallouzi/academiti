import { verifyCertificate } from "@/backend/services/certificates";

export const metadata = { title: "Verify certificate" };

export default async function VerifyCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cert = await verifyCertificate(code);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
        Certificate verification
      </h1>
      {cert ? (
        <div className="mt-8 rounded-2xl border border-teal-700/30 bg-teal-50 p-6">
          <p className="font-semibold text-teal-900">Valid certificate</p>
          <dl className="mt-4 space-y-2 text-sm text-stone-700">
            <div>
              <dt className="text-stone-500">Learner</dt>
              <dd>{cert.user.name}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Course</dt>
              <dd>
                {cert.course.title} ({cert.course.language} · {cert.course.level})
              </dd>
            </div>
            <div>
              <dt className="text-stone-500">Issued</dt>
              <dd>{cert.issuedAt.toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Code</dt>
              <dd className="font-mono">{cert.code}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          No certificate found for code “{code}”.
        </p>
      )}
    </div>
  );
}

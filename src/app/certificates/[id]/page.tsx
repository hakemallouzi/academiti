import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/backend/auth/session";
import { getCertificateForUser } from "@/backend/services/certificates";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const cert = await getCertificateForUser(user.id, id);
  if (!cert) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border-2 border-teal-900/20 bg-white p-10 text-center shadow-sm">
        <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-teal-800">
          LINGORA
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-teal-950">
          Certificate of Completion
        </h1>
        <p className="mt-8 text-stone-600">This certifies that</p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-teal-950">
          {cert.user.name}
        </p>
        <p className="mt-4 text-stone-600">has successfully completed</p>
        <p className="mt-2 text-xl font-semibold text-teal-900">
          {cert.course.title}
        </p>
        <p className="mt-2 text-sm text-stone-500">
          {cert.course.language} · Level {cert.course.level}
        </p>
        <p className="mt-8 text-sm text-stone-500">
          Issued {cert.issuedAt.toLocaleDateString()} · Code {cert.code}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <a
          href={`/api/certificates/${cert.id}/pdf`}
          className="rounded-xl bg-teal-900 px-5 py-3 text-sm font-semibold text-[#f7f3eb]"
        >
          Download PDF
        </a>
        <Link href={`/verify/${cert.code}`} className="rounded-xl border border-stone-300 px-5 py-3 text-sm">
          Public verify link
        </Link>
      </div>
    </div>
  );
}

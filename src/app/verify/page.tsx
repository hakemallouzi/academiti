import { redirect } from "next/navigation";

export const metadata = { title: "Verify certificate" };

export default async function VerifyIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (code) {
    redirect(`/verify/${code.toUpperCase()}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
        Verify a certificate
      </h1>
      <p className="mt-2 text-stone-600">
        Enter the verification code printed on a Lingora certificate.
      </p>
      <form className="mt-8 space-y-4" action="/verify" method="get">
        <input
          name="code"
          placeholder="e.g. ABCD123456"
          required
          className="w-full rounded-xl border border-stone-300 px-3 py-2 uppercase"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-teal-900 py-2.5 text-sm font-semibold text-[#f7f3eb]"
        >
          Verify
        </button>
      </form>
    </div>
  );
}

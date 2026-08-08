import Link from "next/link";
import { LoginForm } from "@/frontend/components/AuthForms";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Log in to buy courses, take tests, and access your lessons.
      </p>
      <div className="mt-8 rounded-2xl border border-white/80 bg-glass p-6 shadow-lg">
        <LoginForm callbackUrl={callbackUrl} />
      </div>
      <p className="mt-4 text-center text-sm text-stone-600">
        No account?{" "}
        <Link href="/register" className="text-teal-800 hover:underline">
          Sign up
        </Link>
      </p>
      <p className="mt-6 text-center text-xs text-stone-400">
        Demo: student@lingora.test / password123
      </p>
    </div>
  );
}

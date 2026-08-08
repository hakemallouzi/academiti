import Link from "next/link";
import { RegisterForm } from "@/frontend/components/AuthForms";

export const metadata = { title: "Sign up" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Join Lingora to purchase courses and earn certificates.
      </p>
      <div className="mt-8 rounded-2xl border border-white/80 bg-glass p-6 shadow-lg">
        <RegisterForm />
      </div>
      <p className="mt-4 text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link href="/login" className="text-teal-800 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

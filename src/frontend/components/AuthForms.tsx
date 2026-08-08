"use client";

import { useState, useTransition } from "react";
import { loginAction, registerAction } from "@/backend/actions";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      action={(fd) => {
        startTransition(async () => {
          const res = await loginAction(fd);
          if (res?.error) setError(res.error);
        });
      }}
    >
      <input type="hidden" name="callbackUrl" value={callbackUrl || "/"} />
      <label className="block text-sm">
        <span className="text-stone-600">Email</span>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-teal-700"
        />
      </label>
      <label className="block text-sm">
        <span className="text-stone-600">Password</span>
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-teal-700"
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-teal-900 py-2.5 text-sm font-semibold text-[#f7f3eb] hover:bg-teal-800 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
}

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      action={(fd) => {
        startTransition(async () => {
          const res = await registerAction(fd);
          if (res?.error) setError(res.error);
        });
      }}
    >
      <label className="block text-sm">
        <span className="text-stone-600">Name</span>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-teal-700"
        />
      </label>
      <label className="block text-sm">
        <span className="text-stone-600">Email</span>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-teal-700"
        />
      </label>
      <label className="block text-sm">
        <span className="text-stone-600">Password</span>
        <input
          name="password"
          type="password"
          minLength={6}
          required
          className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-teal-700"
        />
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-teal-900 py-2.5 text-sm font-semibold text-[#f7f3eb] hover:bg-teal-800 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}

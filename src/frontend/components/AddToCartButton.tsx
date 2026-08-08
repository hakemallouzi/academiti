"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCartAction } from "@/backend/actions";

export function AddToCartButton({
  courseId,
  enrolled,
  className = "",
}: {
  courseId: string;
  enrolled?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const base =
    "btn-glass-primary inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold uppercase tracking-wide disabled:opacity-60";

  if (enrolled) {
    return (
      <button
        type="button"
        onClick={() => router.push(`/learn/${courseId}`)}
        className={`${base} ${className}`}
      >
        Continue learning
        <span aria-hidden>→</span>
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const res = await addToCartAction(courseId);
            if (res?.error) {
              setMessage(res.error);
              return;
            }
            setMessage("Added to cart");
            router.refresh();
          });
        }}
        className={`${base} ${className}`}
      >
        {pending ? "Adding…" : "Enroll now"}
        <span aria-hidden>→</span>
      </button>
      {message && <p className="text-center text-sm text-[var(--muted)]">{message}</p>}
    </div>
  );
}

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeLessonAction } from "@/backend/actions";

export function CompleteLessonButton({
  lessonId,
  courseId,
  completed,
}: {
  lessonId: string;
  courseId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (completed) {
    return (
      <div className="rounded-2xl border border-sky-300/40 bg-sky-500/10 px-4 py-3 text-center text-sm font-semibold text-sky-800">
        Lesson completed
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const res = await completeLessonAction(lessonId, courseId);
          router.refresh();
          if (res.certificateId) {
            router.push(`/certificates/${res.certificateId}`);
          }
        });
      }}
      className="btn-glass-primary w-full rounded-full px-4 py-3 text-sm font-semibold disabled:opacity-60"
    >
      {pending ? "Saving…" : "Mark complete"}
    </button>
  );
}

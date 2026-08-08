"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitTestAction } from "@/backend/actions";

type Question = {
  id: string;
  prompt: string;
  optionsJson: string;
  order: number;
};

export function TestTaker({
  testId,
  questions,
}: {
  testId: string;
  questions: Question[];
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    score: number;
    total: number;
    band: string | null;
    recommended: { id: string; title: string; slug: string }[];
  } | null>(null);
  const [pending, startTransition] = useTransition();

  if (result) {
    return (
      <div className="space-y-6 rounded-2xl border border-white/80 bg-glass p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-teal-950">
          Your result
        </h2>
        <p className="text-stone-700">
          Score: <strong>{result.score}</strong> / {result.total}
          {result.band ? (
            <>
              {" "}
              · Estimated band: <strong>{result.band}</strong>
            </>
          ) : null}
        </p>
        {result.recommended.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-stone-600">
              Recommended courses
            </p>
            <ul className="space-y-2">
              {result.recommended.map((c) => (
                <li key={c.id}>
                  <Link href={`/courses/${c.slug}`} className="text-teal-800 hover:underline">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await submitTestAction(testId, answers);
          setResult({
            score: res.attempt.score,
            total: res.attempt.total,
            band: res.band,
            recommended: res.recommended,
          });
        });
      }}
    >
      {questions.map((q, idx) => {
        const options = JSON.parse(q.optionsJson) as string[];
        return (
          <fieldset key={q.id} className="rounded-2xl border border-white/80 bg-glass p-5">
            <legend className="px-1 text-sm font-semibold text-teal-900">
              Question {idx + 1}
            </legend>
            <p className="mb-4 text-stone-800">{q.prompt}</p>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-teal-950/5"
                >
                  <input
                    type="radio"
                    name={q.id}
                    required
                    checked={answers[q.id] === i}
                    onChange={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: i }))
                    }
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </fieldset>
        );
      })}
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-teal-900 px-5 py-3 text-sm font-semibold text-[#f7f3eb] hover:bg-teal-800 disabled:opacity-60"
      >
        {pending ? "Scoring…" : "Submit test"}
      </button>
    </form>
  );
}

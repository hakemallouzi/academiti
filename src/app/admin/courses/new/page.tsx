import { requireAdmin } from "@/backend/auth/session";
import { CourseForm } from "@/frontend/components/admin/CourseForm";

export default async function NewCoursePage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
        New course
      </h1>
      <CourseForm />
    </div>
  );
}

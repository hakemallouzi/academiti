import { upsertCourseAction } from "@/backend/actions";
import { COURSE_CATEGORIES } from "@/backend/constants/categories";

type CourseValues = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  language?: string;
  level?: string;
  category?: string;
  priceCents?: number;
  thumbnail?: string | null;
  featured?: boolean;
  published?: boolean;
};

export function CourseForm({ course }: { course?: CourseValues }) {
  return (
    <form action={upsertCourseAction} className="mt-8 space-y-4">
      {course?.id && <input type="hidden" name="id" value={course.id} />}
      <Field name="title" label="Title" defaultValue={course?.title} required />
      <Field name="slug" label="Slug (optional)" defaultValue={course?.slug} />
      <label className="block text-sm">
        <span className="text-stone-600">Description</span>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={course?.description}
          className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          name="language"
          label="Language"
          defaultValue={course?.language}
          required
        />
        <Field
          name="level"
          label="Level"
          defaultValue={course?.level ?? "A1"}
          required
        />
        <label className="block text-sm">
          <span className="text-stone-600">Category</span>
          <select
            name="category"
            defaultValue={course?.category ?? "Skills"}
            className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
          >
            {COURSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Field
        name="price"
        label="Price (USD)"
        type="number"
        step="0.01"
        defaultValue={
          course?.priceCents != null ? String(course.priceCents / 100) : "49"
        }
        required
      />
      <Field
        name="thumbnail"
        label="Thumbnail URL"
        defaultValue={course?.thumbnail ?? ""}
      />
      <label className="flex items-center gap-2 text-sm">
        <input name="featured" type="checkbox" defaultChecked={course?.featured} />
        Featured on home
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          name="published"
          type="checkbox"
          defaultChecked={course?.published ?? true}
        />
        Published
      </label>
      <button
        type="submit"
        className="rounded-xl bg-teal-900 px-5 py-2.5 text-sm font-semibold text-[#f7f3eb]"
      >
        Save course
      </button>
    </form>
  );
}

function Field(props: {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  step?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-stone-600">{props.label}</span>
      <input
        name={props.name}
        type={props.type || "text"}
        step={props.step}
        required={props.required}
        defaultValue={props.defaultValue}
        className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2"
      />
    </label>
  );
}

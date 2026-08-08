import Link from "next/link";
import { formatPrice } from "@/lib/format";

type CourseCardProps = {
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    language: string;
    level: string;
    category?: string;
    priceCents: number;
    thumbnail: string | null;
    _count?: { lessons: number };
  };
  index?: number;
};

export function CourseCard({ course, index }: CourseCardProps) {
  const number = index != null ? String(index + 1).padStart(2, "0") : null;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/80 bg-glass shadow-[0_8px_28px_rgba(90,120,150,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(90,120,150,0.16)]"
    >
      <div className="relative overflow-hidden rounded-t-[1.5rem]">
        {number && (
          <span className="absolute left-4 top-4 z-10 font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
            {number}
          </span>
        )}
        <div
          className="aspect-[16/11] bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
          style={{
            backgroundImage: course.thumbnail
              ? `url(${course.thumbnail})`
              : "linear-gradient(135deg,#8ad4ff,#3aa8f0)",
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-[#1f2d3d] group-hover:text-sky-700">
          {course.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-[#7a8b9c]">
          {course.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {course.category && (
            <span className="rounded-full border border-[#d8e0e8] bg-[#f4f7fa] px-3 py-1 text-[11px] font-medium text-[#5a6b7c]">
              {course.category}
            </span>
          )}
          <span className="rounded-full border border-[#d8e0e8] bg-[#f4f7fa] px-3 py-1 text-[11px] font-medium text-[#5a6b7c]">
            {course.language}
          </span>
          <span className="rounded-full border border-[#d8e0e8] bg-[#f4f7fa] px-3 py-1 text-[11px] font-medium text-[#5a6b7c]">
            {course.level}
          </span>
          <span className="ml-auto text-xs font-semibold text-[#1f2d3d]">
            {formatPrice(course.priceCents)}
          </span>
        </div>
      </div>
    </Link>
  );
}

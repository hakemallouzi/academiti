import { prisma } from "@/backend/db/prisma";
import { Prisma } from "@prisma/client";
import { COURSE_CATEGORIES } from "@/backend/constants/categories";

export type CourseFilters = {
  q?: string;
  language?: string;
  level?: string;
  category?: string;
};

export async function listPublishedCourses(filters: CourseFilters = {}) {
  const where: Prisma.CourseWhereInput = {
    published: true,
  };

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q } },
      { description: { contains: filters.q } },
      { language: { contains: filters.q } },
      { category: { contains: filters.q } },
    ];
  }
  if (filters.language) where.language = filters.language;
  if (filters.level) where.level = filters.level;
  if (filters.category && filters.category !== "All") {
    where.category = filters.category;
  }

  return prisma.course.findMany({
    where,
    orderBy: [{ featured: "desc" }, { title: "asc" }],
    include: { _count: { select: { lessons: true } } },
  });
}

export async function getFeaturedCourses() {
  return prisma.course.findMany({
    where: { published: true, featured: true },
    take: 3,
    orderBy: { title: "asc" },
    include: { _count: { select: { lessons: true } } },
  });
}

export async function getCourseBySlug(slug: string) {
  return prisma.course.findFirst({
    where: { slug, published: true },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          order: true,
          durationMin: true,
          body: true,
        },
      },
    },
  });
}

export async function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });
}

export async function getCourseFilterOptions() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    select: { language: true, level: true, category: true },
  });
  const languages = [...new Set(courses.map((c) => c.language))].sort();
  const levels = [...new Set(courses.map((c) => c.level))].sort();
  // Always show the full tab list the user requested
  return {
    languages,
    levels,
    categories: ["All", ...COURSE_CATEGORIES],
  };
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

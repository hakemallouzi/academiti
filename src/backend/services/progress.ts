import { prisma } from "@/backend/db/prisma";
import { issueCertificateIfEligible } from "./certificates";

export async function getLessonForLearner(
  userId: string,
  courseId: string,
  lessonId?: string,
) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) return null;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });
  if (!course) return null;

  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: course.lessons.map((l) => l.id) },
    },
  });

  const current =
    course.lessons.find((l) => l.id === lessonId) ?? course.lessons[0] ?? null;

  return { course, current, progress };
}

export async function markLessonComplete(
  userId: string,
  lessonId: string,
) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });
  if (!lesson) throw new Error("Lesson not found");

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId: lesson.courseId },
    },
  });
  if (!enrollment) throw new Error("Not enrolled");

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: true, completedAt: new Date() },
    create: {
      userId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    },
  });

  return issueCertificateIfEligible(userId, lesson.courseId);
}

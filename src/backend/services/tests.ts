import { prisma } from "@/backend/db/prisma";

function scoreToBand(score: number, total: number) {
  const pct = total === 0 ? 0 : score / total;
  if (pct >= 0.9) return "C1";
  if (pct >= 0.75) return "B2";
  if (pct >= 0.6) return "B1";
  if (pct >= 0.4) return "A2";
  return "A1";
}

export async function listPublishedTests() {
  return prisma.languageTest.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
    include: { _count: { select: { questions: true } } },
  });
}

export async function getTestBySlug(slug: string) {
  return prisma.languageTest.findFirst({
    where: { slug, published: true },
    include: {
      questions: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          prompt: true,
          optionsJson: true,
          order: true,
        },
      },
    },
  });
}

export async function submitTestAttempt(
  userId: string,
  testId: string,
  answers: Record<string, number>,
) {
  const test = await prisma.languageTest.findUnique({
    where: { id: testId },
    include: { questions: true },
  });
  if (!test || !test.published) throw new Error("Test not found");

  let score = 0;
  for (const q of test.questions) {
    if (answers[q.id] === q.correctIndex) score += 1;
  }
  const total = test.questions.length;
  const band = scoreToBand(score, total);

  const attempt = await prisma.testAttempt.create({
    data: {
      userId,
      testId,
      score,
      total,
      band,
      answersJson: JSON.stringify(answers),
    },
  });

  const recommended = await prisma.course.findMany({
    where: {
      published: true,
      language: test.language,
      level: band === "C1" ? "A2" : band.startsWith("B") ? "A2" : "A1",
    },
    take: 3,
  });

  return { attempt, recommended, band };
}

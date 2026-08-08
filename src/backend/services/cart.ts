import { prisma } from "@/backend/db/prisma";

export async function getCart(userId: string) {
  return prisma.cartItem.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function addToCart(userId: string, courseId: string) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, published: true },
  });
  if (!course) throw new Error("Course not found");

  const enrolled = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (enrolled) throw new Error("Already enrolled");

  return prisma.cartItem.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId },
  });
}

export async function removeFromCart(userId: string, courseId: string) {
  return prisma.cartItem.deleteMany({ where: { userId, courseId } });
}

export async function clearCart(userId: string) {
  return prisma.cartItem.deleteMany({ where: { userId } });
}

export async function getCartCount(userId: string) {
  return prisma.cartItem.count({ where: { userId } });
}

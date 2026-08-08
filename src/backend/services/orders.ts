import { prisma } from "@/backend/db/prisma";
import { clearCart } from "./cart";

export async function isEnrolled(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  return !!enrollment;
}

export async function getUserEnrollments(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: { _count: { select: { lessons: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function fulfillPaidOrder(stripeSessionId: string) {
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId },
    include: { items: true },
  });

  if (!existing) return null;
  if (existing.status === "PAID") return existing;

  const order = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: existing.id },
      data: { status: "PAID" },
      include: { items: true },
    });

    for (const item of updated.items) {
      await tx.enrollment.upsert({
        where: {
          userId_courseId: { userId: updated.userId, courseId: item.courseId },
        },
        update: {},
        create: { userId: updated.userId, courseId: item.courseId },
      });
    }

    return updated;
  });

  await clearCart(order.userId);
  return order;
}

/** Local/dev checkout without Stripe when DEV_BYPASS_PAYMENTS=true */
export async function fulfillDevCheckout(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { course: true },
  });
  if (items.length === 0) throw new Error("Cart is empty");

  const totalCents = items.reduce((sum, i) => sum + i.course.priceCents, 0);
  const sessionId = `dev_${userId}_${Date.now()}`;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        status: "PAID",
        totalCents,
        stripeSessionId: sessionId,
        items: {
          create: items.map((i) => ({
            courseId: i.courseId,
            priceCents: i.course.priceCents,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of created.items) {
      await tx.enrollment.upsert({
        where: {
          userId_courseId: { userId, courseId: item.courseId },
        },
        update: {},
        create: { userId, courseId: item.courseId },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });
    return created;
  });

  return order;
}

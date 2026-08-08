import Stripe from "stripe";
import { prisma } from "@/backend/db/prisma";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function paymentsBypassed() {
  return (
    process.env.DEV_BYPASS_PAYMENTS === "true" || !process.env.STRIPE_SECRET_KEY
  );
}

export async function createCheckoutSession(userId: string, email: string) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured");

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { course: true },
  });
  if (items.length === 0) throw new Error("Cart is empty");

  const totalCents = items.reduce((sum, i) => sum + i.course.priceCents, 0);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const order = await prisma.order.create({
    data: {
      userId,
      status: "PENDING",
      totalCents,
      items: {
        create: items.map((i) => ({
          courseId: i.courseId,
          priceCents: i.course.priceCents,
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: items.map((i) => ({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: i.course.priceCents,
        product_data: {
          name: i.course.title,
          description: `${i.course.language} · ${i.course.level}`,
        },
      },
    })),
    success_url: `${appUrl}/account?checkout=success`,
    cancel_url: `${appUrl}/cart?checkout=cancelled`,
    metadata: {
      orderId: order.id,
      userId,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return session;
}

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/backend/services/stripe";
import { fulfillPaidOrder } from "@/backend/services/orders";
import { prisma } from "@/backend/db/prisma";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 400 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.order.updateMany({
        where: { id: orderId },
        data: { stripeSessionId: sessionId },
      });
    }

    await fulfillPaidOrder(sessionId);
  }

  return NextResponse.json({ received: true });
}

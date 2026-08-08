import { NextResponse } from "next/server";
import { requireUser } from "@/backend/auth/session";
import { createCheckoutSession, paymentsBypassed } from "@/backend/services/stripe";
import { fulfillDevCheckout } from "@/backend/services/orders";

export async function POST() {
  const user = await requireUser();

  if (paymentsBypassed()) {
    await fulfillDevCheckout(user.id);
    return NextResponse.json({ url: "/account?checkout=success" });
  }

  const session = await createCheckoutSession(user.id, user.email || "");
  return NextResponse.json({ url: session.url });
}

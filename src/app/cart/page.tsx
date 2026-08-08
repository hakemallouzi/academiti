import Link from "next/link";
import { requireUser } from "@/backend/auth/session";
import { getCart } from "@/backend/services/cart";
import { formatPrice } from "@/backend/services/courses";
import { checkoutAction, removeFromCartAction } from "@/backend/actions";
import { paymentsBypassed } from "@/backend/services/stripe";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const user = await requireUser();
  const items = await getCart(user.id);
  const total = items.reduce((sum, i) => sum + i.course.priceCents, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-teal-950">
        Your cart
      </h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 p-8 text-center">
          <p className="text-stone-600">Your cart is empty.</p>
          <Link href="/courses" className="mt-4 inline-block text-teal-800 hover:underline">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-glass p-4"
            >
              <div>
                <Link
                  href={`/courses/${item.course.slug}`}
                  className="font-semibold text-teal-950 hover:underline"
                >
                  {item.course.title}
                </Link>
                <p className="text-sm text-stone-500">
                  {item.course.language} · {item.course.level}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">{formatPrice(item.course.priceCents)}</span>
                <form action={removeFromCartAction.bind(null, item.courseId)}>
                  <button type="submit" className="text-sm text-red-700 hover:underline">
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-teal-900/10 pt-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">{formatPrice(total)}</span>
          </div>

          <form action={checkoutAction}>
            <button
              type="submit"
              className="w-full rounded-xl bg-amber-700 py-3 text-sm font-semibold text-white hover:bg-amber-600"
            >
              {paymentsBypassed() ? "Complete purchase (dev mode)" : "Checkout with Stripe"}
            </button>
          </form>
          {paymentsBypassed() && (
            <p className="text-center text-xs text-stone-500">
              Stripe keys not set — purchases unlock instantly in development.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

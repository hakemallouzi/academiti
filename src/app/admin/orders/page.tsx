import { requireAdmin } from "@/backend/auth/session";
import { prisma } from "@/backend/db/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { course: { select: { title: true } } } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
        Orders
      </h1>
      <ul className="mt-8 space-y-3">
        {orders.map((o) => (
          <li
            key={o.id}
            className="rounded-xl border border-white/80 bg-glass px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">
                {o.user.name} · {o.user.email}
              </p>
              <p className="text-sm">
                {o.status} · {formatPrice(o.totalCents)}
              </p>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              {o.items.map((i) => i.course.title).join(", ")} ·{" "}
              {o.createdAt.toLocaleString()}
            </p>
          </li>
        ))}
        {orders.length === 0 && (
          <p className="text-stone-500">No orders yet.</p>
        )}
      </ul>
    </div>
  );
}

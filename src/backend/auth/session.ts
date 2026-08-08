import { auth } from "@/backend/auth/auth";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    redirect("/");
  }
  return user;
}

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

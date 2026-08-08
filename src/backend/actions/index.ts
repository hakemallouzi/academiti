"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn, signOut } from "@/backend/auth/auth";
import { requireAdmin, requireUser } from "@/backend/auth/session";
import { prisma } from "@/backend/db/prisma";
import { addToCart, removeFromCart } from "@/backend/services/cart";
import { createCheckoutSession, paymentsBypassed } from "@/backend/services/stripe";
import { fulfillDevCheckout } from "@/backend/services/orders";
import { markLessonComplete } from "@/backend/services/progress";
import { submitTestAttempt } from "@/backend/services/tests";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Please provide a valid name, email, and password (6+ chars)." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with this email already exists." };

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash: await hash(parsed.data.password, 10),
    },
  });

  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirectTo: "/",
  });
}

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      redirectTo: String(formData.get("callbackUrl") || "/"),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function addToCartAction(courseId: string) {
  const user = await requireUser();
  try {
    await addToCart(user.id, courseId);
    revalidatePath("/cart");
    revalidatePath(`/courses`);
    return { ok: true as const };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not add to cart" };
  }
}

export async function removeFromCartAction(courseId: string) {
  const user = await requireUser();
  await removeFromCart(user.id, courseId);
  revalidatePath("/cart");
}

export async function checkoutAction() {
  const user = await requireUser();

  if (paymentsBypassed()) {
    await fulfillDevCheckout(user.id);
    redirect("/account?checkout=success");
  }

  const session = await createCheckoutSession(user.id, user.email || "");
  if (!session.url) throw new Error("Could not start checkout");
  redirect(session.url);
}

export async function completeLessonAction(lessonId: string, courseId: string) {
  const user = await requireUser();
  const cert = await markLessonComplete(user.id, lessonId);
  revalidatePath(`/learn/${courseId}`);
  return { certificateId: cert?.id ?? null };
}

export async function submitTestAction(testId: string, answers: Record<string, number>) {
  const user = await requireUser();
  return submitTestAttempt(user.id, testId, answers);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function upsertCourseAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const language = String(formData.get("language") || "");
  const level = String(formData.get("level") || "");
  const category = String(formData.get("category") || "Skills");
  const priceCents = Math.round(Number(formData.get("price") || 0) * 100);
  const thumbnail = String(formData.get("thumbnail") || "") || null;
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const slug = slugify(String(formData.get("slug") || title));

  if (!title || !description || !language || !level || !slug) {
    throw new Error("Missing required fields");
  }

  if (id) {
    await prisma.course.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        language,
        level,
        category,
        priceCents,
        thumbnail,
        featured,
        published,
      },
    });
  } else {
    await prisma.course.create({
      data: {
        title,
        slug,
        description,
        language,
        level,
        category,
        priceCents,
        thumbnail,
        featured,
        published,
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/courses");
  redirect("/admin/courses");
}

export async function deleteCourseAction(courseId: string) {
  await requireAdmin();
  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath("/admin/courses");
}

export async function upsertLessonAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const courseId = String(formData.get("courseId") || "");
  const title = String(formData.get("title") || "");
  const body = String(formData.get("body") || "");
  const order = Number(formData.get("order") || 1);
  const durationMin = Number(formData.get("durationMin") || 10);

  if (!courseId || !title || !body) {
    throw new Error("Missing fields");
  }

  if (id) {
    await prisma.lesson.update({
      where: { id },
      data: { title, body, order, durationMin },
    });
  } else {
    await prisma.lesson.create({
      data: { courseId, title, body, order, durationMin },
    });
  }

  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

export async function deleteLessonAction(lessonId: string, courseId: string) {
  await requireAdmin();
  await prisma.lesson.delete({ where: { id: lessonId } });
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function upsertTestAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const language = String(formData.get("language") || "");
  const published = formData.get("published") === "on";
  const slug = slugify(String(formData.get("slug") || title));

  if (!title || !description || !language || !slug) {
    throw new Error("Missing fields");
  }

  if (id) {
    await prisma.languageTest.update({
      where: { id },
      data: { title, slug, description, language, published },
    });
  } else {
    await prisma.languageTest.create({
      data: { title, slug, description, language, published },
    });
  }

  revalidatePath("/admin/tests");
  redirect("/admin/tests");
}

export async function upsertQuestionAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const testId = String(formData.get("testId") || "");
  const prompt = String(formData.get("prompt") || "");
  const order = Number(formData.get("order") || 1);
  const correctIndex = Number(formData.get("correctIndex") || 0);
  const options = [
    String(formData.get("option0") || ""),
    String(formData.get("option1") || ""),
    String(formData.get("option2") || ""),
    String(formData.get("option3") || ""),
  ];

  if (!testId || !prompt || options.some((o) => !o)) {
    throw new Error("Missing fields");
  }

  const optionsJson = JSON.stringify(options);

  if (id) {
    await prisma.testQuestion.update({
      where: { id },
      data: { prompt, order, correctIndex, optionsJson },
    });
  } else {
    await prisma.testQuestion.create({
      data: { testId, prompt, order, correctIndex, optionsJson },
    });
  }

  revalidatePath(`/admin/tests/${testId}`);
  redirect(`/admin/tests/${testId}`);
}

export async function deleteQuestionAction(questionId: string, testId: string) {
  await requireAdmin();
  await prisma.testQuestion.delete({ where: { id: questionId } });
  revalidatePath(`/admin/tests/${testId}`);
}

export async function deleteTestAction(testId: string) {
  await requireAdmin();
  await prisma.languageTest.delete({ where: { id: testId } });
  revalidatePath("/admin/tests");
}

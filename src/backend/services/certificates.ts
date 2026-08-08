import { customAlphabet } from "nanoid";
import PDFDocument from "pdfkit";
import { prisma } from "@/backend/db/prisma";

const codeGen = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 10);

export async function issueCertificateIfEligible(
  userId: string,
  courseId: string,
) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: true },
  });
  if (!course || course.lessons.length === 0) return null;

  const completed = await prisma.lessonProgress.count({
    where: {
      userId,
      completed: true,
      lessonId: { in: course.lessons.map((l) => l.id) },
    },
  });

  if (completed < course.lessons.length) return null;

  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return existing;

  return prisma.certificate.create({
    data: {
      userId,
      courseId,
      code: codeGen(),
    },
  });
}

export async function getCertificateForUser(userId: string, certificateId: string) {
  return prisma.certificate.findFirst({
    where: { id: certificateId, userId },
    include: {
      course: true,
      user: { select: { name: true, email: true } },
    },
  });
}

export async function verifyCertificate(code: string) {
  return prisma.certificate.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      course: { select: { title: true, language: true, level: true } },
      user: { select: { name: true } },
    },
  });
}

export async function buildCertificatePdf(certificateId: string, userId?: string) {
  const cert = await prisma.certificate.findFirst({
    where: userId ? { id: certificateId, userId } : { id: certificateId },
    include: {
      course: true,
      user: true,
    },
  });
  if (!cert) return null;

  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });
  const chunks: Buffer[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke("#1e3a5f");
    doc
      .fontSize(18)
      .fillColor("#1e3a5f")
      .text("LINGORA", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(28).text("Certificate of Completion", { align: "center" });
    doc.moveDown(1.5);
    doc.fontSize(14).fillColor("#334155").text("This certifies that", {
      align: "center",
    });
    doc.moveDown(0.5);
    doc.fontSize(26).fillColor("#0f172a").text(cert.user.name, {
      align: "center",
    });
    doc.moveDown(0.5);
    doc
      .fontSize(14)
      .fillColor("#334155")
      .text("has successfully completed", { align: "center" });
    doc.moveDown(0.4);
    doc.fontSize(22).fillColor("#1e3a5f").text(cert.course.title, {
      align: "center",
    });
    doc.moveDown(0.3);
    doc
      .fontSize(12)
      .fillColor("#64748b")
      .text(`${cert.course.language} · Level ${cert.course.level}`, {
        align: "center",
      });
    doc.moveDown(1.2);
    doc
      .fontSize(11)
      .fillColor("#475569")
      .text(`Issued ${cert.issuedAt.toLocaleDateString("en-US")}`, {
        align: "center",
      });
    doc.text(`Verification code: ${cert.code}`, { align: "center" });
    doc.end();
  });
}

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/auth/session";
import { buildCertificatePdf } from "@/backend/services/certificates";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  const { id } = await params;
  const pdf = await buildCertificatePdf(id, user.id);
  if (!pdf) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="lingora-certificate-${id}.pdf"`,
    },
  });
}

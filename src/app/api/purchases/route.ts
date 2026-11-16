import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(request: Request) {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: { supplier: true },
      orderBy: { purchasedAt: "desc" },
    });

    return NextResponse.json({ success: true, purchases });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro compras" },
      { status: 500 }
    );
  }
}

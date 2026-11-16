import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(request: Request) {
  try {
    const customers = await prisma.customer.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: { sales: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro clientes" },
      { status: 500 }
    );
  }
}

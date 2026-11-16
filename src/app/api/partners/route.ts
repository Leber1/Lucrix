import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(request: Request) {
  try {
    const partners = await prisma.partner.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: { distributions: { orderBy: { date: "desc" } } },
    });

    return NextResponse.json({ success: true, partners });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro sócios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partnerId, amount, type = "PROFIT_SHARE", notes } = body;

    const numAmount = Number(amount) || 0;

    const result = await prisma.$transaction(async (tx) => {
      const dist = await tx.partnerDistribution.create({
        data: {
          partnerId,
          amount: numAmount,
          type,
          notes,
        },
      });

      if (type === "WITHDRAWAL" || type === "PROFIT_SHARE") {
        await tx.partner.update({
          where: { id: partnerId },
          data: { totalWithdrawn: { increment: numAmount } },
        });
      } else if (type === "CAPITAL_INJECTION") {
        await tx.partner.update({
          where: { id: partnerId },
          data: { totalCapitalInvested: { increment: numAmount } },
        });
      }

      return dist;
    });

    return NextResponse.json({ success: true, distribution: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro na distribuição" },
      { status: 500 }
    );
  }
}

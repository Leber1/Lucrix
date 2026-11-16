import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = body.event; // PAYMENT_CONFIRMED, PAYMENT_RECEIVED, etc.
    const payment = body.payment;

    console.log(`[ASAAS WEBHOOK] Evento recebido: ${event}`);

    if (event === "PAYMENT_CONFIRMED" || event === "PAYMENT_RECEIVED") {
      const asaasCustomerId = payment?.customer;

      if (asaasCustomerId) {
        // Encontrar tenant vinculado e ativar
        const tenant = await prisma.tenant.findFirst({
          where: { asaasCustomerId },
        });

        if (tenant) {
          await prisma.tenant.update({
            where: { id: tenant.id },
            data: { subscriptionStatus: "ACTIVE" },
          });

          // Registrar no financeiro como receita do SaaS
          const firstAccount = await prisma.financialAccount.findFirst({
            where: { tenantId: tenant.id },
          });

          await prisma.financialTransaction.create({
            data: {
              tenantId: tenant.id,
              accountId: firstAccount?.id || null,
              type: "INCOME",
              category: "ASSINATURA",
              description: `Renovação de Assinatura Asaas (${tenant.plan})`,
              amount: payment.value || 39.9,
              status: "PAID",
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Erro no processamento do webhook Asaas:", error);
    return NextResponse.json({ error: "Erro interno no webhook" }, { status: 500 });
  }
}

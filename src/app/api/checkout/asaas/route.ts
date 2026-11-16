import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAsaasCustomer, createAsaasSubscription } from "@/lib/asaas";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, name, email, phone, cpfCnpj, billingType = "PIX" } = body;

    const planPrices: Record<string, { name: string; price: number }> = {
      STARTER: { name: "Plano Starter", price: 19.9 },
      PRO: { name: "Plano Pro", price: 39.9 },
      BUSINESS: { name: "Plano Business", price: 79.9 },
    };

    const selectedPlan = planPrices[planId] || planPrices.PRO;

    // 1. Criar ou Obter Cliente no Asaas
    const customer = await createAsaasCustomer({
      name: name || "Cliente Lucrix",
      email: email || "assinante@lucrix.app",
      phone: phone || "11999999999",
      cpfCnpj: cpfCnpj ? cpfCnpj.replace(/\D/g, "") : undefined,
    });

    // 2. Criar Assinatura Recorrente no Asaas
    const subscription = await createAsaasSubscription({
      customerId: customer.id,
      billingType: billingType as any,
      value: selectedPlan.price,
      description: `Assinatura Mensal Lucrix — ${selectedPlan.name}`,
    });

    // 3. Atualizar Tenant no Banco de Dados
    await prisma.tenant.update({
      where: { id: DEFAULT_TENANT_ID },
      data: {
        plan: planId,
        asaasCustomerId: customer.id,
        subscriptionStatus: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
      customer,
      plan: selectedPlan,
    });
  } catch (error: any) {
    console.error("Erro no checkout Asaas:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao processar assinatura no Asaas" },
      { status: 500 }
    );
  }
}

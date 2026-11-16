import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(request: Request) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: DEFAULT_TENANT_ID },
    });

    const plans = [
      {
        id: "STARTER",
        name: "Starter",
        price: 19.9,
        period: "mês",
        description: "Ideal para autônomos e comerciantes que estão iniciando sua operação.",
        features: [
          "Até 50 mercadorias ativas",
          "Vendas e Recibos em PDF",
          "Controle de Custos e Reparos",
          "Suporte via WhatsApp",
        ],
        highlight: false,
      },
      {
        id: "PRO",
        name: "Pro",
        price: 39.9,
        period: "mês",
        description: "O plano mais escolhido por lojistas e revendedores profissionais.",
        features: [
          "Mercadorias Ilimitadas",
          "Módulo de Trocas & Catiras",
          "Fluxo de Caixa & DRE Gerencial",
          "8 Calculadoras Comerciais",
          "Gestão de Sócios & Pro-labore",
          "Ordens de Serviço (O.S.) & Garantias",
        ],
        highlight: true,
      },
      {
        id: "BUSINESS",
        name: "Business",
        price: 79.9,
        period: "mês",
        description: "Para empresas com equipe, filiais e múltiplos pontos de atendimento.",
        features: [
          "Tudo do Plano Pro",
          "Múltiplos Usuários com Permissões RBAC",
          "Emissão Fiscal Automática (Hostinger Ready)",
          "Backup em Nuvem Diário",
          "Gerente de Conta Exclusivo",
        ],
        highlight: false,
      },
    ];

    return NextResponse.json({ success: true, tenant, plans });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro assinatura" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, paymentMethod = "PIX" } = body;

    // Atualizar plano do tenant
    const updated = await prisma.tenant.update({
      where: { id: DEFAULT_TENANT_ID },
      data: {
        plan: planId,
        subscriptionStatus: "ACTIVE",
      },
    });

    // Simulação do payload retornado pelo Asaas (Pix QR Code)
    const asaasMock = {
      subscriptionId: `sub_asaas_${Date.now()}`,
      status: "ACTIVE",
      pixQrCode: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540539.905802BR5913LUCRIX GESTAO6009SAO PAULO62070503***6304E2CA",
      pixCopyPaste: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540539.905802BR5913LUCRIX GESTAO6009SAO PAULO62070503***6304E2CA",
    };

    return NextResponse.json({
      success: true,
      tenant: updated,
      asaas: asaasMock,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro no checkout" },
      { status: 500 }
    );
  }
}

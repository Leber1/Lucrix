import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, tradeName, segment, ownerName, email, phone, pinCode = "1234" } = body;

    if (!companyName || !email || !ownerName) {
      return NextResponse.json(
        { success: false, error: "Preencha todos os campos obrigatórios" },
        { status: 400 }
      );
    }

    // Criar Tenant e Usuário
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: companyName,
          tradeName: tradeName || companyName,
          businessType: segment || "ELECTRONICS",
          phone,
          email,
          plan: "PRO",
          subscriptionStatus: "TRIAL",
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: ownerName,
          email: email.toLowerCase().trim(),
          role: "ADMIN",
          pinCode: String(pinCode),
        },
      });

      // Criar carteira padrão Caixa
      await tx.financialAccount.create({
        data: {
          tenantId: tenant.id,
          name: "Caixa Físico / Carteira",
          type: "CASH",
          balance: 0,
          isDefault: true,
        },
      });

      // Criar sócio fundador
      await tx.partner.create({
        data: {
          tenantId: tenant.id,
          name: ownerName,
          email,
          phone,
          sharePercentage: 100,
        },
      });

      return { tenant, user };
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        tenant: result.tenant,
      },
    });

    response.cookies.set("lucrix_session", JSON.stringify({ userId: result.user.id, tenantId: result.tenant.id }), {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    console.error("Erro no cadastro:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao cadastrar empresa" },
      { status: 500 }
    );
  }
}

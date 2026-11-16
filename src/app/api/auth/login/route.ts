import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, pinCode } = body;

    // Se login por PIN (estilo banco/app mobile)
    if (pinCode) {
      const user = await prisma.user.findFirst({
        where: { pinCode: String(pinCode) },
        include: { tenant: true },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "PIN de acesso inválido" },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenant: user.tenant,
        },
      });

      // Grava cookie simples de sessão
      response.cookies.set("lucrix_session", JSON.stringify({ userId: user.id, tenantId: user.tenantId }), {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      });

      return response;
    }

    // Login por Email
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Informe o email para acessar" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
      include: { tenant: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuário não cadastrado com este e-mail" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: user.tenant,
      },
    });

    response.cookies.set("lucrix_session", JSON.stringify({ userId: user.id, tenantId: user.tenantId }), {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro no login" },
      { status: 500 }
    );
  }
}

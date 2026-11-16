import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(request: Request) {
  try {
    // 1. Contas Bancárias / Carteiras
    const accounts = await prisma.financialAccount.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      orderBy: { balance: "desc" },
    });

    // 2. Transações
    const transactions = await prisma.financialTransaction.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: { account: true },
      orderBy: { date: "desc" },
    });

    // 3. Contas a Receber (parcelas de vendas pendentes)
    const pendingReceivables = await prisma.paymentInstallment.findMany({
      where: {
        status: { in: ["PENDING", "OVERDUE"] },
      },
      include: {
        sale: {
          include: { customer: true, items: true },
        },
      },
      orderBy: { dueDate: "asc" },
    });

    // 4. Contas a Pagar
    const pendingPayables = transactions.filter(
      (t) => t.type === "EXPENSE" && t.status === "PENDING"
    );

    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
    const totalReceivables = pendingReceivables.reduce((acc, r) => acc + r.amount, 0);
    const totalPayables = pendingPayables.reduce((acc, p) => acc + p.amount, 0);

    return NextResponse.json({
      success: true,
      accounts,
      transactions,
      pendingReceivables,
      pendingPayables,
      metrics: {
        totalBalance,
        totalReceivables,
        totalPayables,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro financeiro" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountId, type, category, description, amount, status = "PAID" } = body;

    const numAmount = Number(amount) || 0;

    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.financialTransaction.create({
        data: {
          tenantId: DEFAULT_TENANT_ID,
          accountId: accountId || null,
          type: type || "EXPENSE",
          category: category || "GERAL",
          description: description || "Lançamento Financeiro",
          amount: numAmount,
          status,
          date: new Date(),
        },
      });

      // Atualizar saldo da conta se estiver PAGO
      if (accountId && status === "PAID") {
        const delta = type === "INCOME" ? numAmount : -numAmount;
        await tx.financialAccount.update({
          where: { id: accountId },
          data: { balance: { increment: delta } },
        });
      }

      return transaction;
    });

    return NextResponse.json({ success: true, transaction: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao salvar transação" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month"; // today, yesterday, week, 15days, 30days, month, year

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "15days":
        startDate.setDate(startDate.getDate() - 15);
        break;
      case "30days":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // 1. Vendas no período
    const sales = await prisma.sale.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        soldAt: { gte: startDate },
      },
      include: {
        customer: true,
        items: true,
        installments: true,
      },
      orderBy: { soldAt: "desc" },
    });

    const faturamento = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    const custoProdutosVendidos = sales.reduce((acc, s) => acc + s.totalCost, 0);
    const lucroBruto = faturamento - custoProdutosVendidos;

    // 2. Despesas operacionais do período
    const expenses = await prisma.financialTransaction.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        type: "EXPENSE",
        date: { gte: startDate },
      },
    });

    const despesasOperacionais = expenses.reduce((acc, e) => acc + e.amount, 0);
    const lucroOperacional = lucroBruto - despesasOperacionais;
    const lucroLiquidoEstimado = lucroOperacional; // Pode deduzir impostos estimados se houver

    // 3. Estoque Atual & Capital Investido
    const readyProducts = await prisma.product.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        status: { in: ["READY", "IN_REPAIR", "IN_IMPROVEMENT"] },
      },
      include: {
        expenses: true,
      },
    });

    const estoqueAtualCount = readyProducts.reduce((acc, p) => acc + p.quantity, 0);
    const capitalInvestidoEstoque = readyProducts.reduce(
      (acc, p) => acc + p.totalCost * p.quantity,
      0
    );
    const valorPotencialVenda = readyProducts.reduce(
      (acc, p) => acc + p.targetPrice * p.quantity,
      0
    );
    const lucroProjetadoEstoque = valorPotencialVenda - capitalInvestidoEstoque;

    // 4. Saldo em Caixa Disponível (todas as carteiras)
    const accounts = await prisma.financialAccount.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
    });
    const caixaDisponivel = accounts.reduce((acc, a) => acc + a.balance, 0);

    // 5. Contas a Receber (parcelas pendentes)
    const pendingInstallments = await prisma.paymentInstallment.findMany({
      where: {
        status: { in: ["PENDING", "OVERDUE"] },
      },
    });
    const contasAReceber = pendingInstallments.reduce((acc, i) => acc + i.amount, 0);

    // 6. Contas a Pagar
    const pendingExpenses = await prisma.financialTransaction.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        type: "EXPENSE",
        status: "PENDING",
      },
    });
    const contasAPagar = pendingExpenses.reduce((acc, e) => acc + e.amount, 0);

    // 7. Mercadorias paradas (mais de 15 dias sem venda)
    const fifteenDaysAgo = new Date(Date.now() - 15 * 86400000);
    const slowMovingProducts = readyProducts.filter(
      (p) => p.createdAt < fifteenDaysAgo || (p.purchaseDate && p.purchaseDate < fifteenDaysAgo)
    );

    // 8. Vendas Recentes (últimas 5)
    const recentSales = sales.slice(0, 5);

    return NextResponse.json({
      success: true,
      period,
      stats: {
        faturamento,
        lucroBruto,
        despesasOperacionais,
        lucroOperacional,
        lucroLiquidoEstimado,
        estoqueAtualCount,
        capitalInvestidoEstoque,
        valorPotencialVenda,
        lucroProjetadoEstoque,
        caixaDisponivel,
        contasAReceber,
        contasAPagar,
        slowMovingCount: slowMovingProducts.length,
        slowMovingCapital: slowMovingProducts.reduce((acc, p) => acc + p.totalCost, 0),
        rentabilidadePercent: faturamento > 0 ? (lucroLiquidoEstimado / faturamento) * 100 : 0,
      },
      recentSales,
      accounts,
      slowMovingProducts: slowMovingProducts.slice(0, 3),
    });
  } catch (error: any) {
    console.error("Erro nas estatísticas:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno" },
      { status: 500 }
    );
  }
}

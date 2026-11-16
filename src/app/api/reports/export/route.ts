import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    const format = searchParams.get("format") || "json"; // json ou csv

    const now = new Date();
    const startDate = start ? new Date(start) : new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = end ? new Date(end) : new Date();
    endDate.setHours(23, 59, 59, 999);

    // 1. Buscar Vendas no intervalo
    const sales = await prisma.sale.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        soldAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: true,
        items: true,
      },
      orderBy: { soldAt: "asc" },
    });

    // 2. Buscar Despesas no intervalo
    const expenses = await prisma.financialTransaction.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        type: "EXPENSE",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });

    // 3. Buscar Compras no intervalo
    const purchases = await prisma.purchase.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        purchasedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { supplier: true },
      orderBy: { purchasedAt: "asc" },
    });

    const totalFaturamento = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalCustoVendas = sales.reduce((acc, s) => acc + s.totalCost, 0);
    const totalLucroBruto = totalFaturamento - totalCustoVendas;
    const totalDespesas = expenses.reduce((acc, e) => acc + e.amount, 0);
    const totalLucroLiquido = totalLucroBruto - totalDespesas;
    const totalCompras = purchases.reduce((acc, p) => acc + p.totalAmount, 0);

    // Se solicitado formato CSV (compatível com Excel)
    if (format === "csv") {
      let csv = "Tipo;Data;Descricao / Cliente;Forma Pagamento;Valor (R$);Custo (R$);Lucro (R$)\n";

      for (const s of sales) {
        const dataStr = new Date(s.soldAt).toLocaleDateString("pt-BR");
        const itemTitle = (s.items[0]?.title || "Venda").replace(/;/g, ",");
        const cliente = s.customer?.name ? s.customer.name.replace(/;/g, ",") : "Balcao";
        csv += `Venda;${dataStr};${itemTitle} (${cliente});${s.paymentMethod};${s.totalAmount.toFixed(
          2
        )};${s.totalCost.toFixed(2)};${s.grossProfit.toFixed(2)}\n`;
      }

      for (const e of expenses) {
        const dataStr = new Date(e.date).toLocaleDateString("pt-BR");
        const desc = e.description.replace(/;/g, ",");
        csv += `Despesa;${dataStr};${desc};-;-${e.amount.toFixed(2)};0.00;-${e.amount.toFixed(
          2
        )}\n`;
      }

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="relatorio-lucrix-${startDate.toISOString().split("T")[0]}-a-${endDate.toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      summary: {
        totalFaturamento,
        totalCustoVendas,
        totalLucroBruto,
        totalDespesas,
        totalLucroLiquido,
        totalCompras,
        margemLiquida: totalFaturamento > 0 ? (totalLucroLiquido / totalFaturamento) * 100 : 0,
        qtdVendas: sales.length,
        qtdDespesas: expenses.length,
        qtdCompras: purchases.length,
      },
      sales,
      expenses,
      purchases,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao exportar dados" },
      { status: 500 }
    );
  }
}

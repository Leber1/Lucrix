import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(request: Request) {
  try {
    const trades = await prisma.tradeOperation.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      orderBy: { operationDate: "desc" },
    });

    return NextResponse.json({ success: true, trades });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao buscar catiras" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      productOutName,
      valueOut = 0,
      costOut = 0,
      productInName,
      valueIn = 0,
      cashDifference = 0,
      additionalCost = 0,
      notes,
    } = body;

    const valOut = Number(valueOut) || 0;
    const cOut = Number(costOut) || 0;
    const valIn = Number(valueIn) || 0;
    const cashDiff = Number(cashDifference) || 0;
    const addCost = Number(additionalCost) || 0;

    // Fórmula da Catira:
    // O lojista entregou um produto que custou cOut + gastou addCost.
    // O lojista recebeu um produto avaliado em valIn + cashDiff (dinheiro que entrou no caixa).
    // Lucro Real = (valIn + cashDiff) - (cOut + addCost)
    const realizedProfit = valIn + cashDiff - (cOut + addCost);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Cadastrar produto recebido no estoque se fornecido
      let productInId = null;
      if (productInName) {
        const newProduct = await tx.product.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            name: productInName,
            purchasePrice: valIn,
            totalCost: valIn,
            targetPrice: valIn * 1.25, // Margem de revenda inicial
            status: "READY",
            condition: "USED",
            description: `Entrou na permuta: ${title}`,
          },
        });
        productInId = newProduct.id;
      }

      // 2. Registrar a Operação de Catira
      const trade = await tx.tradeOperation.create({
        data: {
          tenantId: DEFAULT_TENANT_ID,
          title: title || `Permuta: ${productOutName || "Item"} por ${productInName || "Item"}`,
          productInId,
          valueOut: valOut,
          costOut: cOut,
          valueIn: valIn,
          cashDifference: cashDiff,
          additionalCost: addCost,
          realizedProfit,
          notes,
        },
      });

      // 3. Se houve volta em dinheiro para o caixa da loja, lança no financeiro
      if (cashDiff !== 0) {
        const firstAccount = await tx.financialAccount.findFirst({
          where: { tenantId: DEFAULT_TENANT_ID },
        });

        await tx.financialTransaction.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            accountId: firstAccount?.id || null,
            type: cashDiff > 0 ? "INCOME" : "EXPENSE",
            category: "CATIRA",
            description: `Volta financeira Catira: ${trade.title}`,
            amount: Math.abs(cashDiff),
            status: "PAID",
            referenceId: trade.id,
          },
        });
      }

      return trade;
    });

    return NextResponse.json({ success: true, trade: result });
  } catch (error: any) {
    console.error("Erro ao registrar troca:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao registrar permuta" },
      { status: 500 }
    );
  }
}

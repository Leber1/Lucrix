import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(request: Request) {
  try {
    const sales = await prisma.sale.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        installments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, sales });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao buscar vendas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      productId,
      title,
      quantity = 1,
      unitPrice = 0,
      discount = 0,
      shippingCost = 0,
      paymentMethod = "PIX",
      installmentsCount = 1,
      notes,
    } = body;

    // Buscar o produto para obter o custo real
    let product: any = null;
    let unitCost = 0;
    if (productId) {
      product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (product) {
        unitCost = product.totalCost || product.purchasePrice || 0;
      }
    }

    const subtotal = Number(unitPrice) * Number(quantity);
    const totalAmount = subtotal - Number(discount) + Number(shippingCost);
    const totalCost = unitCost * Number(quantity);
    const grossProfit = totalAmount - totalCost;

    // Buscar último número de venda para incremento
    const lastSale = await prisma.sale.findFirst({
      where: { tenantId: DEFAULT_TENANT_ID },
      orderBy: { saleNumber: "desc" },
    });
    const nextSaleNumber = (lastSale?.saleNumber || 1000) + 1;

    // Criar as parcelas
    const installmentList: any[] = [];
    const count = Math.max(1, parseInt(installmentsCount) || 1);
    const installmentAmount = totalAmount / count;

    for (let i = 1; i <= count; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (i - 1) * 30);
      installmentList.push({
        number: i,
        totalCount: count,
        amount: installmentAmount,
        dueDate,
        paidDate: count === 1 && paymentMethod !== "TERM" ? new Date() : null,
        status: count === 1 && paymentMethod !== "TERM" ? "PAID" : "PENDING",
        method: paymentMethod,
      });
    }

    // Executar transação atômica
    const result = await prisma.$transaction(async (tx) => {
      // 1. Criar Venda
      const sale = await tx.sale.create({
        data: {
          tenantId: DEFAULT_TENANT_ID,
          saleNumber: nextSaleNumber,
          customerId: customerId || null,
          subtotal,
          discount: Number(discount) || 0,
          shippingCost: Number(shippingCost) || 0,
          totalAmount,
          totalCost,
          grossProfit,
          paymentMethod,
          paymentStatus: count === 1 && paymentMethod !== "TERM" ? "PAID" : "PARTIALLY_PAID",
          notes,
          items: {
            create: [
              {
                productId: productId || null,
                title: title || product?.name || "Mercadoria Avulsa",
                quantity: Number(quantity) || 1,
                unitCost,
                unitPrice: Number(unitPrice) || 0,
                totalAmount,
              },
            ],
          },
          installments: {
            create: installmentList,
          },
        },
        include: {
          customer: true,
          items: true,
          installments: true,
        },
      });

      // 2. Dar baixa no produto se vinculado
      if (productId && product) {
        await tx.product.update({
          where: { id: productId },
          data: {
            status: "SOLD",
            soldDate: new Date(),
          },
        });
      }

      // 3. Registrar lançamento no Financeiro se houve pagamento à vista
      if (paymentMethod !== "TERM") {
        const firstAccount = await tx.financialAccount.findFirst({
          where: { tenantId: DEFAULT_TENANT_ID },
        });

        await tx.financialTransaction.create({
          data: {
            tenantId: DEFAULT_TENANT_ID,
            accountId: firstAccount?.id || null,
            type: "INCOME",
            category: "VENDAS",
            description: `Recebimento Venda #${sale.saleNumber} (${sale.items[0]?.title})`,
            amount: count === 1 ? totalAmount : installmentAmount,
            status: "PAID",
            referenceId: sale.id,
          },
        });
      }

      return sale;
    });

    return NextResponse.json({ success: true, sale: result });
  } catch (error: any) {
    console.error("Erro ao registrar venda:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao registrar venda" },
      { status: 500 }
    );
  }
}

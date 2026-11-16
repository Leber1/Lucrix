import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // READY, DRAFT, SOLD, ALL
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");

    const where: any = {
      tenantId: DEFAULT_TENANT_ID,
    };

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { serialNumber: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        expenses: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("Erro ao listar produtos:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      brand,
      model,
      serialNumber,
      serialNumber2,
      color,
      storage,
      batteryHealth,
      apparelSize,
      condition,
      description,
      imageUrl,
      quantity = 1,
      purchasePrice = 0,
      additionalCosts = 0,
      targetPrice = 0,
      minPrice,
      status = "READY",
      draftStep = 5,
      supplierName,
      purchaseDate,
      categoryId,
      expenses = [],
    } = body;

    const totalExpenses = Array.isArray(expenses)
      ? expenses.reduce((acc: number, cur: any) => acc + (Number(cur.amount) || 0), 0)
      : Number(additionalCosts) || 0;

    const totalCost = Number(purchasePrice) + totalExpenses;
    const targetPriceNum = Number(targetPrice) || 0;
    const marginProjected =
      targetPriceNum > 0 ? ((targetPriceNum - totalCost) / targetPriceNum) * 100 : 0;

    const product = await prisma.product.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        name,
        brand,
        model,
        serialNumber,
        serialNumber2,
        color,
        storage,
        batteryHealth: batteryHealth ? parseInt(batteryHealth) : null,
        apparelSize,
        condition: condition || "SEMI_NEW",
        description,
        imageUrl:
          imageUrl ||
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
        quantity: parseInt(quantity) || 1,
        purchasePrice: Number(purchasePrice) || 0,
        additionalCosts: totalExpenses,
        totalCost,
        targetPrice: targetPriceNum,
        minPrice: minPrice ? Number(minPrice) : null,
        marginProjected,
        status: status || "READY",
        draftStep: draftStep || 5,
        supplierName,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        categoryId: categoryId || null,
        expenses: {
          create: Array.isArray(expenses)
            ? expenses.map((exp: any) => ({
                description: exp.description || "Melhoria / Reparo",
                amount: Number(exp.amount) || 0,
                supplier: exp.supplier || null,
              }))
            : [],
        },
      },
      include: {
        category: true,
        expenses: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Erro ao cadastrar produto:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao salvar produto" },
      { status: 500 }
    );
  }
}

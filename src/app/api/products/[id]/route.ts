import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEFAULT_TENANT_ID = "tenant-lucrix-demo";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        tenantId: DEFAULT_TENANT_ID,
      },
      include: {
        category: true,
        expenses: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      quantity,
      purchasePrice,
      additionalCosts,
      targetPrice,
      minPrice,
      status,
      draftStep,
      supplierName,
      categoryId,
    } = body;

    const purchasePriceNum = Number(purchasePrice) || 0;
    const additionalCostsNum = Number(additionalCosts) || 0;
    const totalCost = purchasePriceNum + additionalCostsNum;
    const targetPriceNum = Number(targetPrice) || 0;
    const marginProjected =
      targetPriceNum > 0 ? ((targetPriceNum - totalCost) / targetPriceNum) * 100 : 0;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        brand,
        model,
        serialNumber,
        serialNumber2,
        color,
        storage,
        batteryHealth: batteryHealth ? parseInt(batteryHealth) : null,
        apparelSize,
        condition,
        description,
        imageUrl,
        quantity: quantity ? parseInt(quantity) : 1,
        purchasePrice: purchasePriceNum,
        additionalCosts: additionalCostsNum,
        totalCost,
        targetPrice: targetPriceNum,
        minPrice: minPrice ? Number(minPrice) : null,
        marginProjected,
        status,
        draftStep,
        supplierName,
        categoryId: categoryId || null,
      },
      include: {
        category: true,
        expenses: true,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Produto excluído" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao excluir produto" },
      { status: 500 }
    );
  }
}

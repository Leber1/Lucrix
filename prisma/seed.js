const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed do banco de dados Lucrix...");

  // 1. Criar Tenant Principal
  const tenant = await prisma.tenant.upsert({
    where: { id: "tenant-lucrix-demo" },
    update: {},
    create: {
      id: "tenant-lucrix-demo",
      name: "Lucrix Prime Store",
      tradeName: "Lucrix Operações & Tecnologia",
      document: "48.291.802/0001-44",
      businessType: "ELECTRONICS",
      phone: "(11) 98844-2200",
      email: "contato@lucrix.app",
      plan: "PRO",
      subscriptionStatus: "ACTIVE",
    },
  });

  // 2. Usuário Administrador
  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: "admin@lucrix.app",
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Carlos Eduardo (Admin)",
      email: "admin@lucrix.app",
      role: "ADMIN",
      pinCode: "1234",
    },
  });

  // 3. Sócios e Divisão Societária
  const socio1 = await prisma.partner.create({
    data: {
      tenantId: tenant.id,
      name: "Carlos Eduardo",
      document: "389.201.849-01",
      sharePercentage: 50.0,
      totalCapitalInvested: 45000.0,
      totalWithdrawn: 12500.0,
      phone: "(11) 98844-2200",
      email: "carlos@lucrix.app",
      status: "ACTIVE",
    },
  });

  const socio2 = await prisma.partner.create({
    data: {
      tenantId: tenant.id,
      name: "Rafael Mendes",
      document: "412.984.102-55",
      sharePercentage: 50.0,
      totalCapitalInvested: 45000.0,
      totalWithdrawn: 12500.0,
      phone: "(11) 97722-1144",
      email: "rafael@lucrix.app",
      status: "ACTIVE",
    },
  });

  // 4. Contas Bancárias / Carteiras
  const accCaixa = await prisma.financialAccount.create({
    data: {
      tenantId: tenant.id,
      name: "Caixa Físico Balcão",
      type: "CASH",
      balance: 4250.0,
      isDefault: false,
    },
  });

  const accInter = await prisma.financialAccount.create({
    data: {
      tenantId: tenant.id,
      name: "Banco Inter PJ",
      type: "BANK",
      balance: 38400.0,
      isDefault: true,
    },
  });

  const accAsaas = await prisma.financialAccount.create({
    data: {
      tenantId: tenant.id,
      name: "Asaas Cobranças",
      type: "GATEWAY",
      balance: 9350.0,
      isDefault: false,
    },
  });

  // 5. Categorias
  const catApple = await prisma.category.create({
    data: {
      tenantId: tenant.id,
      name: "Smartphones Apple",
      icon: "smartphone",
      type: "SMARTPHONE",
    },
  });

  const catSamsung = await prisma.category.create({
    data: {
      tenantId: tenant.id,
      name: "Smartphones Samsung",
      icon: "smartphone",
      type: "SMARTPHONE",
    },
  });

  const catServicos = await prisma.category.create({
    data: {
      tenantId: tenant.id,
      name: "Assistência & Manutenção",
      icon: "wrench",
      type: "SERVICE",
    },
  });

  const catAcessorios = await prisma.category.create({
    data: {
      tenantId: tenant.id,
      name: "Acessórios Premium",
      icon: "headphones",
      type: "PRODUCT",
    },
  });

  // 6. Fornecedores
  const supMega = await prisma.supplier.create({
    data: {
      tenantId: tenant.id,
      name: "Mega Distribuidora Tech SP",
      contactName: "Roberto Silveira",
      phone: "(11) 94002-8922",
      document: "12.345.678/0001-90",
      city: "São Paulo",
    },
  });

  const supParts = await prisma.supplier.create({
    data: {
      tenantId: tenant.id,
      name: "TechParts Telas e Baterias",
      contactName: "Fernando Santos",
      phone: "(11) 93311-5500",
      document: "23.456.789/0001-01",
      city: "Campinas",
    },
  });

  // 7. Clientes
  const cliMarcos = await prisma.customer.create({
    data: {
      tenantId: tenant.id,
      name: "Marcos Vinícius Silva",
      phone: "(11) 98765-4321",
      document: "321.654.987-00",
      email: "marcos.silva@gmail.com",
      city: "São Paulo",
      state: "SP",
    },
  });

  const cliJuliana = await prisma.customer.create({
    data: {
      tenantId: tenant.id,
      name: "Juliana Mendes Costa",
      phone: "(11) 99123-8877",
      document: "219.876.543-12",
      email: "juliana.costa@hotmail.com",
      city: "Santo André",
      state: "SP",
    },
  });

  // 8. Produtos Ativos e em Estoque
  const p1 = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      categoryId: catApple.id,
      name: "iPhone 15 Pro Max 256GB Titânio Natural",
      brand: "Apple",
      model: "A3106",
      serialNumber: "359482109283741",
      color: "Titânio Natural",
      storage: "256GB",
      batteryHealth: 100,
      condition: "SEMI_NEW",
      description: "Aparelho impecável, sem marcas de uso, completo na caixa com cabo original.",
      imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
      quantity: 1,
      purchasePrice: 5300.0,
      additionalCosts: 120.0, // Película 3D + Capa MagSafe
      totalCost: 5420.0,
      targetPrice: 6790.0,
      minPrice: 6500.0,
      marginProjected: 20.17,
      status: "READY",
      draftStep: 5,
      supplierName: supMega.name,
      purchaseDate: new Date(Date.now() - 6 * 86400000),
      expenses: {
        create: [
          {
            description: "Capa MagSafe + Película Hrebos",
            amount: 120.0,
            supplier: "TechParts",
          },
        ],
      },
    },
  });

  const p2 = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      categoryId: catApple.id,
      name: "iPhone 14 Pro 128GB Roxo Profundo",
      brand: "Apple",
      model: "A2890",
      serialNumber: "354928109847120",
      color: "Roxo Profundo",
      storage: "128GB",
      batteryHealth: 89,
      condition: "SEMI_NEW",
      description: "Excelente estado. Bateria 89% original de fábrica. Acompanha carregador 20W.",
      imageUrl: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&auto=format&fit=crop&q=80",
      quantity: 1,
      purchasePrice: 3850.0,
      additionalCosts: 180.0,
      totalCost: 4030.0,
      targetPrice: 4990.0,
      minPrice: 4750.0,
      marginProjected: 19.23,
      status: "READY",
      draftStep: 5,
      supplierName: "Particular (Compra Balcão)",
      purchaseDate: new Date(Date.now() - 10 * 86400000),
      expenses: {
        create: [
          {
            description: "Higienização interna + Carregador 20W Foxconn",
            amount: 180.0,
            supplier: "TechParts",
          },
        ],
      },
    },
  });

  const p3 = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      categoryId: catSamsung.id,
      name: "Samsung Galaxy S24 Ultra 512GB Titânio Cinza",
      brand: "Samsung",
      model: "SM-S928B",
      serialNumber: "358910293847111",
      color: "Titânio Cinza",
      storage: "512GB",
      condition: "NEW",
      description: "Lacrado na caixa nacional com nota fiscal e 1 ano de garantia Samsung.",
      imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80",
      quantity: 1,
      purchasePrice: 4900.0,
      additionalCosts: 0.0,
      totalCost: 4900.0,
      targetPrice: 6190.0,
      minPrice: 5890.0,
      marginProjected: 20.84,
      status: "READY",
      draftStep: 5,
      supplierName: supMega.name,
      purchaseDate: new Date(Date.now() - 3 * 86400000),
    },
  });

  // Produto em Rascunho / Em Reparo
  const pDraft = await prisma.product.create({
    data: {
      tenantId: tenant.id,
      categoryId: catApple.id,
      name: "iPhone 13 128GB Meia-Noite (Aguardando Troca de Bateria)",
      brand: "Apple",
      model: "A2633",
      serialNumber: "352918274619283",
      color: "Meia-Noite",
      storage: "128GB",
      batteryHealth: 74,
      condition: "USED",
      description: "Comprado com bateria degradada. Peça já encomendada na TechParts.",
      imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80",
      quantity: 1,
      purchasePrice: 2200.0,
      additionalCosts: 160.0,
      totalCost: 2360.0,
      targetPrice: 3190.0,
      minPrice: 2990.0,
      marginProjected: 26.01,
      status: "DRAFT",
      draftStep: 3,
      supplierName: "Particular (Balcão)",
      purchaseDate: new Date(Date.now() - 2 * 86400000),
    },
  });

  // 9. Venda Concluída
  const venda1 = await prisma.sale.create({
    data: {
      tenantId: tenant.id,
      saleNumber: 1001,
      customerId: cliMarcos.id,
      subtotal: 3490.0,
      discount: 100.0,
      shippingCost: 0.0,
      totalAmount: 3390.0,
      totalCost: 2650.0,
      grossProfit: 740.0,
      paymentMethod: "SPLIT",
      paymentStatus: "PAID",
      notes: "R$ 1.390 no Pix + R$ 2.000 em 4x no Cartão de Crédito",
      soldAt: new Date(Date.now() - 2 * 86400000),
      items: {
        create: [
          {
            title: "iPhone 13 128GB Azul Estelar (IMEI: 351982746192830)",
            quantity: 1,
            unitCost: 2650.0,
            unitPrice: 3490.0,
            totalAmount: 3490.0,
          },
        ],
      },
      installments: {
        create: [
          {
            number: 1,
            totalCount: 1,
            amount: 1390.0,
            dueDate: new Date(Date.now() - 2 * 86400000),
            paidDate: new Date(Date.now() - 2 * 86400000),
            status: "PAID",
            method: "PIX",
          },
          {
            number: 1,
            totalCount: 4,
            amount: 500.0,
            dueDate: new Date(Date.now() + 28 * 86400000),
            status: "PENDING",
            method: "CREDIT_CARD",
          },
          {
            number: 2,
            totalCount: 4,
            amount: 500.0,
            dueDate: new Date(Date.now() + 58 * 86400000),
            status: "PENDING",
            method: "CREDIT_CARD",
          },
          {
            number: 3,
            totalCount: 4,
            amount: 500.0,
            dueDate: new Date(Date.now() + 88 * 86400000),
            status: "PENDING",
            method: "CREDIT_CARD",
          },
          {
            number: 4,
            totalCount: 4,
            amount: 500.0,
            dueDate: new Date(Date.now() + 118 * 86400000),
            status: "PENDING",
            method: "CREDIT_CARD",
          },
        ],
      },
    },
  });

  // 10. Catira / Permuta Registrada
  await prisma.tradeOperation.create({
    data: {
      tenantId: tenant.id,
      title: "Permuta: Entrega iPhone 14 128GB e Recebimento iPhone 12 64GB + Volta R$ 1.900",
      valueOut: 4200.0,
      costOut: 3300.0,
      valueIn: 1700.0,
      cashDifference: 1900.0, // Cliente pagou R$ 1.900 de volta
      additionalCost: 50.0,  // Custo de teste e laudo
      realizedProfit: 750.0, // (R$ 1.700 produto recebido + R$ 1.900 dinheiro) - R$ 3.300 custo - R$ 50 = R$ 250 em dinheiro + margem de ativo
      notes: "Excelente negócio. O iPhone 12 recebido já foi colocado para revisão e anúncio.",
      operationDate: new Date(Date.now() - 4 * 86400000),
    },
  });

  // 11. Ordem de Serviço
  await prisma.serviceOrder.create({
    data: {
      tenantId: tenant.id,
      orderNumber: 2001,
      customerId: cliJuliana.id,
      device: "iPhone 13 Pro 128GB Dourado",
      serialOrImei: "359182746192039",
      defectReport: "Aparelho não liga após queda leve. Tela sem trincos externos.",
      diagnosis: "Curto no conector da bateria e display descolado internamente.",
      status: "APPROVED",
      laborCost: 280.0,
      partsCost: 140.0,
      totalAmount: 420.0,
    },
  });

  // 12. Lançamentos Financeiros (DRE & Fluxo de Caixa)
  await prisma.financialTransaction.createMany({
    data: [
      {
        tenantId: tenant.id,
        accountId: accInter.id,
        type: "INCOME",
        category: "VENDAS",
        description: "Entrada Pix Venda #1001 (Marcos Vinícius)",
        amount: 1390.0,
        date: new Date(Date.now() - 2 * 86400000),
        status: "PAID",
      },
      {
        tenantId: tenant.id,
        accountId: accCaixa.id,
        type: "INCOME",
        category: "CATIRA",
        description: "Volta em Dinheiro Permuta iPhone 14 x iPhone 12",
        amount: 1900.0,
        date: new Date(Date.now() - 4 * 86400000),
        status: "PAID",
      },
      {
        tenantId: tenant.id,
        accountId: accInter.id,
        type: "EXPENSE",
        category: "ALUGUEL",
        description: "Aluguel Ponto Comercial Centro Empresarial",
        amount: 2200.0,
        date: new Date(Date.now() - 5 * 86400000),
        status: "PAID",
      },
      {
        tenantId: tenant.id,
        accountId: accInter.id,
        type: "EXPENSE",
        category: "PRO_LABORE",
        description: "Retirada Mensal Sócios (Carlos & Rafael)",
        amount: 5000.0,
        date: new Date(Date.now() - 8 * 86400000),
        status: "PAID",
      },
      {
        tenantId: tenant.id,
        accountId: accInter.id,
        type: "EXPENSE",
        category: "MARKETING",
        description: "Anúncios Meta Ads (Instagram/Facebook)",
        amount: 650.0,
        date: new Date(Date.now() - 1 * 86400000),
        status: "PAID",
      },
    ],
  });

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

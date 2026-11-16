# LUCRIX — Sua Operação no Lucro

> **Software SaaS de Gestão Empresarial, Vendas, Estoque e Finanças para Empreendedores e Revendedores**  
> **Tema**: *Lucrix Emerald Dark* (Dark Mode Sofisticado com acabamento SaaS Premium)  
> **Monograma**: **LX** com conceito de crescimento e ascensão financeira.

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js 18+ (testado e otimizado no Node.js v24)
- SQLite local (já incluso) / Pronto para PostgreSQL (Neon / Hostinger VPS)

### 2. Inicialização do Banco e Seeds
O banco de dados SQLite já foi criado e sincronizado via Prisma ORM:
```bash
# Rodar seeds com produtos, vendas, contas e transações realistas
npm run db:seed
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse no navegador ou no celular (na mesma rede Wi-Fi via IP local):
👉 **`http://localhost:3000`**

---

## 📱 Navegação e Estrutura dos Módulos

### Barra Inferior Fixa (Mobile-First):
- **Início**: Dashboard executiva com KPIs em tempo real, DRE sintética, previsão de pagar/receber e filtros de períodos (Hoje, Ontem, Semana, 15d, 30d, Mês, Ano).
- **Estoque**: Gestão de mercadorias com abas (*Ativos*, *Rascunhos*, *Trocas*), filtros de status, alternância card/lista, indicadores de capital investido e lucro projetado.
- **(+) Ações Rápidas (Botão Central Destacado)**: Action sheet para Nova Venda, Cadastro Guiado em 5 Etapas, Nova Catira, Nova Compra, Despesa e O.S.
- **Vendas**: Histórico de saídas com controle de recebimentos, parcelamento e emissão de comprovantes/recibos em PDF.
- **Relatórios**: Curva ABC de campeões de lucro, rentabilidade por categoria e giro de estoque.

### Menu Superior (Hambúrguer de 3 Linhas):
- **Financeiro & DRE**: Fluxo de Caixa, Carteiras/Bancos, Contas a Pagar/Receber e DRE contábil gerencial.
- **Trocas & Catiras**: Simulador de permutas com cálculo de volta em dinheiro, abatimento de estoque e lucro real apurado.
- **Gestão de Sócios**: Cotas societárias percentuais, aportes e rateio de resultados.
- **8 Calculadoras Comerciais**: Lojista/Revendedor, Brique & Oportunidade, Markup & Ponto de Equilíbrio, Simulador de Maquininha.
- **Ordens de Serviço & Garantias**: Assistência técnica com peças, mão de obra e laudo.
- **Assinatura & Checkout Asaas**: Planos Starter (R$ 19,90), Pro (R$ 39,90) e Business (R$ 79,90) com Pix instantâneo e renovação.
- **Painel Super Admin**: Indicadores de MRR, ARR, retenção e assinantes ativos.

---

## 🛡️ Produção & Hospedagem na Hostinger / VPS
Para publicar na Hostinger:
1. Altere o `provider` no `prisma/schema.prisma` para `postgresql` e defina `DATABASE_URL` para o banco Postgres (ex: Neon ou VPS).
2. Execute `npx prisma migrate deploy`.
3. Inicie a aplicação com `npm run build && npm run start` ou via Docker / PM2.

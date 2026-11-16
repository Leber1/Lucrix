/**
 * Módulo de Integração com o Gateway Asaas (API v3)
 * Suporta Sandbox (testes) e Produção oficial.
 */

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || "";
const ASAAS_ENV = process.env.ASAAS_ENVIRONMENT || "sandbox";

const BASE_URL =
  ASAAS_ENV === "production"
    ? "https://api.asaas.com/v3"
    : "https://api-sandbox.asaas.com/v3";

export async function createAsaasCustomer(data: {
  name: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
}) {
  if (!ASAAS_API_KEY) {
    // Retorno simulado realista para testes sem chave imediata
    return {
      id: `cus_sim_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpfCnpj: data.cpfCnpj,
    };
  }

  const response = await fetch(`${BASE_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_API_KEY,
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      mobilePhone: data.phone,
      cpfCnpj: data.cpfCnpj,
      notificationDisabled: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || "Erro ao criar cliente no Asaas");
  }

  return await response.json();
}

export async function createAsaasSubscription(data: {
  customerId: string;
  billingType: "PIX" | "CREDIT_CARD" | "BOLETO";
  value: number;
  description: string;
}) {
  if (!ASAAS_API_KEY) {
    // Simulação de assinatura recorrente com Pix
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const paymentId = `pay_sim_${Date.now()}`;
    return {
      id: `sub_sim_${Date.now()}`,
      customer: data.customerId,
      value: data.value,
      billingType: data.billingType,
      status: "ACTIVE",
      cycle: "MONTHLY",
      description: data.description,
      firstPaymentId: paymentId,
      pix: {
        encodedImage:
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        payload: `00020126580014br.gov.bcb.pix0136${Date.now()}520400005303986540${data.value.toFixed(
          2
        )}5802BR5913LUCRIX GESTAO6009SAO PAULO62070503***6304E2CA`,
        expirationDate: nextMonth.toISOString(),
      },
    };
  }

  const today = new Date().toISOString().split("T")[0];

  const response = await fetch(`${BASE_URL}/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_API_KEY,
    },
    body: JSON.stringify({
      customer: data.customerId,
      billingType: data.billingType,
      value: data.value,
      nextDueDate: today,
      cycle: "MONTHLY",
      description: data.description,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.description || "Erro ao criar assinatura no Asaas");
  }

  const sub = await response.json();

  // Buscar primeiro pagamento gerado para obter o Pix QR Code se for Pix
  let pixData = null;
  if (data.billingType === "PIX") {
    try {
      const paymentsRes = await fetch(
        `${BASE_URL}/subscriptions/${sub.id}/payments`,
        {
          headers: { access_token: ASAAS_API_KEY },
        }
      );
      const payments = await paymentsRes.json();
      if (payments.data?.[0]?.id) {
        const pixRes = await fetch(
          `${BASE_URL}/payments/${payments.data[0].id}/pixQrCode`,
          {
            headers: { access_token: ASAAS_API_KEY },
          }
        );
        pixData = await pixRes.json();
      }
    } catch (e) {
      console.error("Erro ao buscar QR Code Pix do Asaas:", e);
    }
  }

  return { ...sub, pix: pixData };
}

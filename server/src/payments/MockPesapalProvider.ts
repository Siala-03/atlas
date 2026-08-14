import { prisma } from "../db";
import { PaymentProvider, PaymentStatusResult } from "./PaymentProvider";

// PUBLIC_APP_URL may be a comma-separated list of allowed CORS origins; the
// first entry is the canonical app URL used for redirects.
const PUBLIC_APP_URL = (process.env.PUBLIC_APP_URL ?? "http://localhost:5173").split(",")[0].trim();

export class MockPesapalProvider implements PaymentProvider {
  readonly name = "mock_pesapal";

  async initiate({ orderId, reference }: { orderId: string; reference: string; amount: number }) {
    const providerRef = `MOCK-${reference}-${Date.now()}`;
    const redirectUrl = `${PUBLIC_APP_URL}/mock-payment/${providerRef}?orderId=${orderId}`;
    return { redirectUrl, providerRef };
  }

  async verify(providerRef: string): Promise<PaymentStatusResult> {
    const payment = await prisma.payment.findUnique({ where: { providerRef } });
    return { status: (payment?.status as PaymentStatusResult["status"]) ?? "pending" };
  }
}

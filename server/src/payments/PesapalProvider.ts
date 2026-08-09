import { PaymentProvider, PaymentStatusResult } from "./PaymentProvider";

const PESAPAL_ENV = ["live", "production"].includes(process.env.PESAPAL_ENV ?? "") ? "live" : "sandbox";
const BASE_URL = PESAPAL_ENV === "live" ? "https://pay.pesapal.com/v3" : "https://cybqa.pesapal.com/pesapalv3";
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY ?? "";
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET ?? "";
const CURRENCY = process.env.PESAPAL_CURRENCY ?? "RWF";
const PUBLIC_APP_URL = process.env.PUBLIC_APP_URL ?? "http://localhost:5173";
const PUBLIC_API_URL = process.env.PUBLIC_API_URL ?? "http://localhost:4000";

interface PesapalTokenResponse {
  token?: string;
  message?: string;
}

interface PesapalIpnResponse {
  ipn_id?: string;
  message?: string;
}

interface PesapalSubmitOrderResponse {
  order_tracking_id?: string;
  redirect_url?: string;
  message?: string;
  error?: { message?: string } | null;
}

interface PesapalTransactionStatusResponse {
  status_code?: number;
  message?: string;
}

export class PesapalProvider implements PaymentProvider {
  readonly name = "pesapal";
  private ipnId: string | null = null;

  private async getAccessToken(): Promise<string> {
    const response = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET })
    });
    const data = (await response.json()) as PesapalTokenResponse;
    if (!data.token) throw new Error(`Pesapal auth failed: ${data.message ?? "unknown error"}`);
    return data.token;
  }

  private async getIpnId(token: string): Promise<string> {
    if (this.ipnId) return this.ipnId;
    const response = await fetch(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        url: `${PUBLIC_API_URL}/api/payments/pesapal/ipn`,
        ipn_notification_type: "GET"
      })
    });
    const data = (await response.json()) as PesapalIpnResponse;
    if (!data.ipn_id) throw new Error(`Pesapal IPN registration failed: ${data.message ?? "unknown error"}`);
    this.ipnId = data.ipn_id;
    return this.ipnId;
  }

  async initiate({
    orderId,
    reference,
    amount,
    email,
    phone,
    contactName
  }: {
    orderId: string;
    reference: string;
    amount: number;
    email: string;
    phone: string;
    contactName: string;
  }) {
    const token = await this.getAccessToken();
    const ipnId = await this.getIpnId(token);

    const response = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        id: `${reference}-${Date.now()}`,
        currency: CURRENCY,
        amount,
        description: `Atlas order ${reference}`.slice(0, 100),
        callback_url: `${PUBLIC_APP_URL}/order-confirmed/${orderId}`,
        notification_id: ipnId,
        billing_address: {
          email_address: email,
          phone_number: phone,
          first_name: contactName,
          country_code: "RW"
        }
      })
    });
    const data = (await response.json()) as PesapalSubmitOrderResponse;
    if (!data.order_tracking_id || !data.redirect_url) {
      throw new Error(`Pesapal order submission failed: ${data.error?.message ?? data.message ?? "unknown error"}`);
    }
    return { redirectUrl: data.redirect_url, providerRef: data.order_tracking_id };
  }

  async verify(providerRef: string): Promise<PaymentStatusResult> {
    const token = await this.getAccessToken();
    const response = await fetch(
      `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(providerRef)}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
    );
    const data = (await response.json()) as PesapalTransactionStatusResponse;
    if (data.status_code === 1) return { status: "paid" };
    if (data.status_code === 2 || data.status_code === 3) return { status: "failed" };
    return { status: "pending" };
  }
}

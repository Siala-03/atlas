export interface PaymentInitiationResult {
  redirectUrl: string;
  providerRef: string;
}

export interface PaymentStatusResult {
  status: "pending" | "paid" | "failed";
}

export interface PaymentProvider {
  readonly name: string;
  initiate(params: {
    orderId: string;
    reference: string;
    amount: number;
    email: string;
    phone: string;
    contactName: string;
  }): Promise<PaymentInitiationResult>;
  verify(providerRef: string): Promise<PaymentStatusResult>;
}

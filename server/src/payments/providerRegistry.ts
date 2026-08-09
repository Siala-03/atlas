import { PaymentProvider } from "./PaymentProvider";
import { MockPesapalProvider } from "./MockPesapalProvider";
import { PesapalProvider } from "./PesapalProvider";

export const paymentProvider: PaymentProvider =
  process.env.PAYMENT_PROVIDER === "pesapal" ? new PesapalProvider() : new MockPesapalProvider();

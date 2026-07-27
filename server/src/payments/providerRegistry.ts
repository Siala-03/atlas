import { PaymentProvider } from "./PaymentProvider";
import { MockPesapalProvider } from "./MockPesapalProvider";

// The only file that changes to go live with real Pesapal: add a
// `PesapalProvider implements PaymentProvider` and select it here when
// PAYMENT_PROVIDER=pesapal. Nothing else in the server or frontend changes.
export const paymentProvider: PaymentProvider = new MockPesapalProvider();

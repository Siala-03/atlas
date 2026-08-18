import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM_EMAIL || "Atlas Supplies <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

type OrderForEmail = {
  reference: string;
  email: string;
  contactName: string;
  total: number;
  lines: { name: string; quantity: number; mode: string }[];
};

function formatCurrency(amount: number): string {
  return `RWF ${amount.toLocaleString("en-US")}`;
}

export async function sendOrderConfirmationEmail(order: OrderForEmail): Promise<void> {
  if (!resend) {
    console.log(`[mailer] RESEND_API_KEY not set — skipping confirmation email for ${order.reference}`);
    return;
  }

  const itemsHtml = order.lines.
  map((line) => `<li>${line.name} × ${line.quantity} ${line.mode === "business" ? "case(s)" : "piece(s)"}</li>`).
  join("");

  await resend.emails.send({
    from: fromAddress,
    to: order.email,
    subject: `Your Atlas Supplies order ${order.reference} is in!`,
    html: `
      <p>Hi ${order.contactName},</p>
      <p><strong>Your Order is in! 🥂</strong></p>
      <p>We're getting everything ready and will keep you updated on your delivery.</p>
      <p><strong>Reference:</strong> ${order.reference}</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
      <p>Thanks for ordering from Atlas Supplies.</p>
    `
  });
}

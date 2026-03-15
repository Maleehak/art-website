import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "MK Art <onboarding@resend.dev>";
const ARTIST_EMAIL =
  process.env.ARTIST_EMAIL || "maleehakhalid93@gmail.com";

export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ARTIST_EMAIL,
    replyTo: email,
    subject: `New Inquiry: ${subject}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #8b7355; padding-bottom: 12px;">
          New Contact Form Message
        </h2>
        <table style="width: 100%; margin: 24px 0; font-size: 15px; color: #2c2c2c;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 100px;">From:</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #8b7355;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
            <td style="padding: 8px 0;">${subject}</td>
          </tr>
        </table>
        <div style="background: #faf8f5; padding: 20px; border-radius: 8px; margin-top: 16px;">
          <p style="margin: 0; color: #2c2c2c; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #6b6b6b;">
          Reply directly to this email to respond to ${name}.
        </p>
      </div>
    `,
  });
}

export async function sendOrderConfirmation({
  customerEmail,
  customerName,
  orderId,
  items,
  total,
}: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: { title: string; price: number }[];
  total: number;
}) {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f5f0eb;">${item.title}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f5f0eb; text-align: right;">$${item.price.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Order Confirmed — ${orderId}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 8px;">Thank You, ${customerName}!</h1>
        <p style="color: #6b6b6b; font-size: 15px; margin-bottom: 32px;">
          Your order has been confirmed. We'll begin preparing your artwork for shipping.
        </p>

        <div style="background: #faf8f5; padding: 24px; border-radius: 8px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b6b6b; text-transform: uppercase; letter-spacing: 1px;">Order ID</p>
          <p style="margin: 0 0 20px 0; font-size: 15px; color: #1a1a1a; font-weight: bold;">${orderId}</p>

          <table style="width: 100%; font-size: 15px; color: #2c2c2c;">
            <thead>
              <tr>
                <th style="text-align: left; padding-bottom: 12px; border-bottom: 2px solid #8b7355; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b6b6b;">Item</th>
                <th style="text-align: right; padding-bottom: 12px; border-bottom: 2px solid #8b7355; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b6b6b;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
              <tr>
                <td style="padding-top: 16px; font-weight: bold; font-size: 17px;">Total</td>
                <td style="padding-top: 16px; font-weight: bold; font-size: 17px; text-align: right;">$${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style="margin-top: 32px; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
          If you have any questions about your order, simply reply to this email or visit our
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://maleehakhalid.art"}/contact" style="color: #8b7355;">contact page</a>.
        </p>

        <p style="margin-top: 24px; color: #1a1a1a; font-style: italic;">
          — Maleeha Khalid
        </p>
      </div>
    `,
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ARTIST_EMAIL,
    subject: `New Order! ${orderId} — $${total.toFixed(2)}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #4a7c59; padding-bottom: 12px;">
          New Order Received
        </h2>
        <table style="width: 100%; margin: 24px 0; font-size: 15px; color: #2c2c2c;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px;">Order ID:</td>
            <td style="padding: 8px 0;">${orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Customer:</td>
            <td style="padding: 8px 0;">${customerName} (${customerEmail})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Total:</td>
            <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #4a7c59;">$${total.toFixed(2)}</td>
          </tr>
        </table>
        <h3 style="color: #1a1a1a;">Items:</h3>
        <ul style="color: #2c2c2c; line-height: 1.8;">
          ${items.map((i) => `<li>${i.title} — $${i.price.toFixed(2)}</li>`).join("")}
        </ul>
      </div>
    `,
  });
}

export async function sendBankTransferInstructions({
  customerEmail,
  customerName,
  orderId,
  total,
}: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  total: number;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Bank Transfer Details — Order ${orderId}`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 8px;">Bank Transfer Details</h1>
        <p style="color: #6b6b6b; font-size: 15px; margin-bottom: 32px;">
          Hi ${customerName}, here are the bank details to complete your order.
        </p>

        <div style="background: #faf8f5; padding: 24px; border-radius: 8px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b6b6b; text-transform: uppercase; letter-spacing: 1px;">Amount Due</p>
          <p style="margin: 0 0 24px 0; font-size: 24px; color: #1a1a1a; font-weight: bold;">$${total.toFixed(2)}</p>

          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b6b6b; text-transform: uppercase; letter-spacing: 1px;">Reference</p>
          <p style="margin: 0 0 24px 0; font-size: 15px; color: #1a1a1a; font-weight: bold;">${orderId}</p>

          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b6b6b; text-transform: uppercase; letter-spacing: 1px;">Bank Details</p>
          <table style="width: 100%; font-size: 14px; color: #2c2c2c;">
            <tr><td style="padding: 4px 0; font-weight: bold;">Bank:</td><td>${process.env.BANK_NAME || "—"}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Account Title:</td><td>${process.env.BANK_ACCOUNT_TITLE || "—"}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">Account No:</td><td>${process.env.BANK_ACCOUNT_NUMBER || "—"}</td></tr>
            <tr><td style="padding: 4px 0; font-weight: bold;">IBAN:</td><td>${process.env.BANK_IBAN || "—"}</td></tr>
          </table>
        </div>

        <p style="margin-top: 24px; color: #c44536; font-size: 14px; font-weight: bold;">
          Please complete the transfer within 48 hours and include the order reference.
        </p>
        <p style="margin-top: 16px; color: #6b6b6b; font-size: 14px;">
          After transferring, reply to this email with your payment screenshot for faster processing.
        </p>
      </div>
    `,
  });
}

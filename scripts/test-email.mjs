import { Resend } from "resend";
import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env.local") });

const resend = new Resend(process.env.RESEND_API_KEY);
const to = "maleehakhalid604@gmail.com";

console.log(`Sending test email to ${to}...`);

const result = await resend.emails.send({
  from: "MK Art <onboarding@resend.dev>",
  to,
  subject: "Test Email from MK Art Website",
  html: `
    <div style="font-family: Georgia, serif; padding: 40px 20px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a1a1a;">It works!</h1>
      <p style="color: #6b6b6b; font-size: 16px;">
        Your MK Art website email system is set up correctly.
        You will receive contact form messages, order confirmations,
        and bank transfer details at this email.
      </p>
      <p style="color: #8b7355; font-style: italic;">— MK Art Website</p>
    </div>
  `,
});

if (result.error) {
  console.error("Failed:", result.error);
} else {
  console.log("Success! Email ID:", result.data?.id);
  console.log("Check your inbox at:", to);
}

import crypto from "crypto";

const XPAY_BASE_URL =
  process.env.XPAY_ENVIRONMENT === "production"
    ? "https://api.xpaycheckout.com"
    : "https://api.test.xpaycheckout.com";

function getAuthHeader(): string {
  const publicKey = process.env.XPAY_PUBLIC_KEY;
  const privateKey = process.env.XPAY_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error("XPAY_PUBLIC_KEY and XPAY_PRIVATE_KEY must be set");
  }
  return `Basic ${Buffer.from(`${publicKey}:${privateKey}`).toString("base64")}`;
}

export interface XPayCustomerDetails {
  name: string;
  email: string;
  contactNumber?: string;
  customerAddress: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
}

export interface XPayCreateIntentRequest {
  amount: number;
  currency: string;
  callbackUrl: string;
  cancelUrl?: string;
  receiptId?: string;
  description?: string;
  customerDetails: XPayCustomerDetails;
  paymentMethods?: string[];
  metadata?: Record<string, string>;
}

export interface XPayIntentResponse {
  amount: number;
  currency: string;
  receiptId?: string;
  description?: string;
  callbackUrl: string;
  cancelUrl?: string;
  createdAt: string;
  status: string;
  xIntentId: string;
  fwdUrl: string;
  metadata?: Record<string, string>;
}

export interface XPayWebhookEvent {
  eventId: string;
  eventType: string;
  eventTime: number;
  intentId: string;
  receiptId?: string;
  status: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  customerDetails?: {
    name: string;
    email: string;
    contactNumber?: string;
  };
  card?: {
    brand: string;
    country: string;
    lastFourDigit: string;
    expiryMonth: number;
    expiryYear: number;
    fundingType: string;
  };
  errorCode?: string;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent(
  request: XPayCreateIntentRequest
): Promise<XPayIntentResponse> {
  const response = await fetch(`${XPAY_BASE_URL}/payments/create-intent`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.errorDescription || `XPay API error: ${response.status}`
    );
  }

  return response.json();
}

export async function getPaymentIntent(
  intentId: string
): Promise<XPayIntentResponse> {
  const response = await fetch(
    `${XPAY_BASE_URL}/payments/get-intent/${intentId}`,
    {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.errorDescription || `XPay API error: ${response.status}`
    );
  }

  return response.json();
}

export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.XPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("XPAY_WEBHOOK_SECRET is not set");
  }

  const hmac = crypto.createHmac("sha512", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("base64");

  return signature === expectedSignature;
}

export function formatAmountForXPay(amount: number): number {
  return Math.round(amount * 100);
}

export function formatAmountFromXPay(amount: number): number {
  return amount / 100;
}

const COUNTRY_CODE_MAP: Record<string, string> = {
  Pakistan: "PK",
  "United States": "US",
  "United Kingdom": "GB",
  "United Arab Emirates": "AE",
  Canada: "CA",
  Germany: "DE",
  France: "FR",
};

export function getCountryCode(countryName: string): string {
  return COUNTRY_CODE_MAP[countryName] || "PK";
}

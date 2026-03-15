import crypto from "crypto";

const EASYPAISA_URLS = {
  sandbox: "https://easypaystg.easypaisa.com.pk/easypay/Index.jsf",
  production: "https://easypay.easypaisa.com.pk/easypay/Index.jsf",
};

function getConfig() {
  const storeId = process.env.EASYPAISA_STORE_ID;
  const hashKey = process.env.EASYPAISA_HASH_KEY;
  if (!storeId || !hashKey) {
    throw new Error("EASYPAISA_STORE_ID and EASYPAISA_HASH_KEY must be set");
  }
  const env: keyof typeof EASYPAISA_URLS =
    process.env.EASYPAISA_ENVIRONMENT === "production"
      ? "production"
      : "sandbox";
  return { storeId, hashKey, env };
}

export function getEasypayUrl(): string {
  const { env } = getConfig();
  return EASYPAISA_URLS[env];
}

/**
 * Generates AES-ECB encrypted hash for EasyPaisa.
 * Parameters are sorted alphabetically, joined as key=value&,
 * then encrypted with AES-ECB using the merchant's hashKey.
 */
function generateHash(
  params: Record<string, string>,
  hashKey: string
): string {
  const sortedKeys = Object.keys(params).sort();
  const rawString = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");

  const keyBytes = Buffer.from(hashKey, "utf8");

  let algorithm: string;
  if (keyBytes.length === 16) {
    algorithm = "aes-128-ecb";
  } else if (keyBytes.length === 24) {
    algorithm = "aes-192-ecb";
  } else if (keyBytes.length === 32) {
    algorithm = "aes-256-ecb";
  } else {
    const paddedKey = Buffer.alloc(16);
    keyBytes.copy(paddedKey, 0, 0, Math.min(keyBytes.length, 16));
    return generateHashWithKey(rawString, paddedKey, "aes-128-ecb");
  }

  return generateHashWithKey(rawString, keyBytes, algorithm);
}

function generateHashWithKey(
  data: string,
  key: Buffer,
  algorithm: string
): string {
  const cipher = crypto.createCipheriv(algorithm, key, null);
  cipher.setAutoPadding(true);
  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);
  return encrypted.toString("base64");
}

function formatExpiryDate(minutesAhead: number = 60): string {
  const date = new Date(Date.now() + minutesAhead * 60 * 1000);
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}${MM}${dd} ${HH}${mm}${ss}`;
}

export interface EasypaisaPaymentParams {
  amount: number;
  orderRefNum: string;
  emailAddr: string;
  mobileNum: string;
  postBackURL: string;
}

export interface EasypaisaFormData {
  url: string;
  params: Record<string, string>;
}

export function createEasypaisaPayment(
  input: EasypaisaPaymentParams
): EasypaisaFormData {
  const { storeId, hashKey } = getConfig();

  const payload: Record<string, string> = {
    storeId,
    amount: input.amount.toFixed(2),
    orderRefNum: input.orderRefNum,
    expiryDate: formatExpiryDate(60),
    postBackURL: input.postBackURL,
    autoRedirect: "1",
    emailAddr: input.emailAddr,
    mobileNum: input.mobileNum,
    paymentMethod: "MA_PAYMENT_METHOD",
  };

  const merchantHashedReq = generateHash(payload, hashKey);

  return {
    url: getEasypayUrl(),
    params: {
      ...payload,
      merchantHashedReq,
    },
  };
}

export interface EasypaisaCallbackData {
  orderRefNumber?: string;
  responseCode?: string;
  responseDesc?: string;
  paymentToken?: string;
  transactionId?: string;
  transactionDateTime?: string;
  msisdn?: string;
  accountNumber?: string;
  status?: string;
}

export function isPaymentSuccessful(responseCode: string): boolean {
  return responseCode === "0000";
}

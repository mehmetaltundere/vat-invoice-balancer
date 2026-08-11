import crypto from "crypto";

/**
 * Verifies HMAC SHA-256 signature for incoming IdeaSoft webhooks
 */
export function verifyIdeaSoftWebhook(
  rawPayload: string,
  signatureHeader: string | null,
  webhookSecret: string
): boolean {
  if (!signatureHeader || !webhookSecret) {
    return false;
  }

  try {
    const computedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawPayload, "utf8")
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(computedSignature, "utf8"),
      Buffer.from(signatureHeader, "utf8")
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return false;
  }
}

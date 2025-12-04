import crypto from "crypto";

export function hashUserId(userId: number): string {
  const secret = process.env.HASH_SECRET || "SUPER_SECRET_KEY_CHANGE_ME";

  return crypto
    .createHmac("sha256", secret)
    .update(String(userId))
    .digest("hex");
}

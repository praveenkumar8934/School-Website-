import crypto from "crypto";

const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || "default_insecure_secret_for_nova_academy";

export function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const answer = (num1 + num2).toString();
  
  // Sign the answer
  const hmac = crypto.createHmac("sha256", CAPTCHA_SECRET);
  hmac.update(answer);
  const token = hmac.digest("hex");

  return {
    question: `${num1} + ${num2} = ?`,
    token
  };
}

export function verifyCaptcha(answer: string, token: string): boolean {
  if (!answer || !token) return false;
  
  const hmac = crypto.createHmac("sha256", CAPTCHA_SECRET);
  hmac.update(answer.trim());
  const expectedToken = hmac.digest("hex");

  return token === expectedToken;
}

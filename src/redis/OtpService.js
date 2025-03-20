import redisClient from "./RedisClient.js";
import crypto from "crypto";

const OTP_EXPIRATION = 300; // 5 minutes

// Generate a random 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Save OTP in Redis
async function saveOTP(emailId, otp) {
  const key = `otp:${emailId}`;
  await redisClient.setEx(key, OTP_EXPIRATION, otp);
}

// Verify OTP from Redis
async function verifyOTP(emailId, otp) {
  const key = `otp:${emailId}`;
  const storedOTP = await redisClient.get(key);

  if (!storedOTP) {
    return { success: false, message: "OTP expired or invalid" };
  }

  if (storedOTP !== otp) {
    return { success: false, message: "Incorrect OTP" };
  }

  // Delete OTP after successful verification
  await redisClient.del(key);
  return { success: true, message: "OTP verified successfully" };
}

export { generateOTP, saveOTP, verifyOTP };



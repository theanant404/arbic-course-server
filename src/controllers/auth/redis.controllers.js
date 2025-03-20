import { ApiError } from "../../utils/ApiError.js"
import {ApiResponse} from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateOTP,saveOTP,verifyOTP } from "../../redis/OtpService.js";
import { sendEmail } from "../../mail/sendEmail.js";


const sendOtp=asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Email ID is required");
    }
    const otp = generateOTP();
    await saveOTP(email, otp);
    // Send OTP to the user's email (implementation not shown)
    await sendEmail(
        email,
        "Email Verification",
        `
          <h1>Email Verification</h1>
          <p>Thank you for registering. Please use the following OTP to verify your email:</p>
          <h2>${otp}</h2>
          <p>If you did not request this, please ignore this email.</p>
        `
      );
    return res.status(200).json(
        new ApiResponse(200, "OTP sent successfully", {
        })
    );
})

const verifyOpt=asyncHandler(async(req,res)=>{
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new ApiError(400, "Email ID and OTP are required");
    }
    const result = await verifyOTP(email, otp);
    if (!result.success) {
        throw new ApiError(400, result.message);
    }
    res.status(200).json(new ApiResponse(200,"OTP verified successfully"));
})

export { sendOtp, verifyOpt };
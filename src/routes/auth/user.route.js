import { Router } from "express";
import { sendOtp,verifyOpt } from "../../controllers/auth/redis.controllers.js";
import { loginUser, registerUser,logoutUser,refreshAccessToken } from "../../controllers/auth/users.controllers.js";
import { createOrderAndHandlePayment,verifyPayment} from "../../controllers/auth/razorpay.controllers.js";
import { verifyJWT } from "../../middlewares/auth.middlewares.js";

const router = Router();
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOpt);
router.route("/payment").post(createOrderAndHandlePayment);
router.route("/verify-payment").post(verifyPayment);
router.route("/register").post(registerUser);
router.route("/sign-in").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/log-out").post(verifyJWT,logoutUser);

export default router;
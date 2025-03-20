import { razorpay } from "../../payment/razorpay.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Subscription } from "../../models/admin/subscriptions.models.js";
import { SubscriptionData } from "../../models/admin/subscriptions.data.modesl.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
/**
 * Create Razorpay Order and Handle Payment
 */
const createOrderAndHandlePayment = asyncHandler(async (req, res) => {
  const { plan, email, name } = req.body;

  // Validate input
  if (!plan || !email || !name) {
    throw new ApiError(400, "Plan, email, and name are required");
  }

  // Fetch plan details from the database
  const planDetails = await Subscription.findOne({ plan });
  if (!planDetails) {
    throw new ApiError(404, "Plan not found");
  }

  // Create Razorpay order
  const options = {
    amount: planDetails.price * 100, // Amount in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1, // Auto-capture payment
  };

  const order = await razorpay.orders.create(options);
  if (!order) {
    throw new ApiError(500, "Failed to create Razorpay order");
  }

  // Save order details to the database
  const subscriptionData = new SubscriptionData({
    email: email,
    plan,
    price: planDetails.price,
    razorpay_order_id: order.id,
  });
  await subscriptionData.save();

  // Open Razorpay Checkout (server-side)
  const checkoutOptions = {
    key: process.env.RAZORPAY_KEY_ID, // Razorpay Key ID
    amount: order.amount,
    currency: order.currency,
    name: "Your Company Name",
    description: "Course Payment",
    order_id: order.id,
    prefill: {
      name,
      email,
    },
    theme: {
      color: "#3399cc",
    },
  };
  // console.log("Checkout Options: ", checkoutOptions);

  // Return the checkout options to the frontend
  res.status(200).json(
    new ApiResponse(200, "Order created successfully", {
      checkoutOptions,
    })
  );
});

/**
 * Verify Razorpay Payment
 */
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid payment signature" });
  }
});

export { createOrderAndHandlePayment, verifyPayment };
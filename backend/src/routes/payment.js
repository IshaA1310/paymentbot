import express from "express";
import { createOrder, verifyPayment } from "../controllers/PaymentController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
// router.post("/webhook", razorpayWebhook);
// router.get("/history", getPaymentHistory);

export default router;

// rzp_live_ApIZMCc7fqOaJG
// 5FCdxflYSdoyy6Xf2ozWrYgA
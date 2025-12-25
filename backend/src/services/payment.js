import razorpay from "../config/razorpay.js";
import Payment from "../models/Payment.js";

export const createPaymentOrder = async ({ userId, credits }) => {
  const amount = credits * 100;
  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`
  });
  const payment = await Payment.create({
    userId,
    razorpayOrderId: order.id,
    amount,
    creditsPurchased: credits,
    status: "CREATED"
  });
  return { order, payment };
};

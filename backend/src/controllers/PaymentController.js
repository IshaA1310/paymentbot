import crypto from "crypto";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import { createPaymentOrder } from "../services/payment.js";
import { addCreditsToUser } from "../services/credit.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";

export const createOrder = async (req, res) => {
  try {
    const { phoneNumber, credits } = req.body;
    console.log(phoneNumber, credits);
    const user = await User.findOrCreateByPhone(phoneNumber);
    console.log(user);
    const { order } = await createPaymentOrder({
      userId: user._id,
      credits
    });
    console.log(order, "order");
    console.log(process.env.RAZORPAY_KEY_ID, "process.env.RAZORPAY_KEY_ID");
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      phoneNumber
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id
    });

    if (!payment || payment.status === "SUCCESS") {
      return res.status(400).json({ message: "Invalid or duplicate payment" });
    }

    const user = await User.findOne({ phoneNumber });
    console.log(user, "user");
    payment.status = "SUCCESS";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();
    console.log(user._id, payment.creditsPurchased, "user._id, payment.creditsPurchased");
    await addCreditsToUser(user, payment.creditsPurchased);

    res.json({ success: 'Payment verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const razorpayWebhook = async (req, res) => {
    try {
        const webhookSignature = req.get("X-Razorpay-Signature");
        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.WEBHOOK_SECRET
        );
        if(!isWebhookValid) {
        return res.status(400).json({ message: "Invalid webhook signature" });
        }
        const event = req.body.event;
        if(event === "payment.captured") {
            const paymentEntity = req.body.payload.payment.entity;
            const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });
            if(!payment) {
                return res.status(400).json({ message: "Payment not found" });
            }
            payment.status = "SUCCESS";
            payment.razorpayPaymentId = paymentEntity.id;
            await payment.save();
            await addCreditsToUser(payment.userId, payment.creditsPurchased);
        }
        return res.status(200).json({ message: "Webhook received" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getPaymentHistory = async (req, res) => {
  try {
    const { phoneNumber } = req.query;

    if (!phoneNumber) {
      return res.status(400).json({ message: "phoneNumber is required" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const payments = await Payment.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select(
        "amount creditsPurchased status razorpayPaymentId razorpayOrderId createdAt"
      );

    res.status(200).json({
      totalPayments: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

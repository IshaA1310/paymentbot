import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, dafault: null },
    amount: { type: Number, required: true },
    creditsPurchased: { type: Number, required: true },
    status: { type: String, enum: ["CREATED", "SUCCESS", "FAILED", "REFUNDED"], default: "CREATED" },
    paymentMethod: { type: String, dafault: "razorpay" },
  },{ timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema, "Payment");
export default Payment;

// services/payment.js
import razorpay from "../config/razorpay.js";
import Payment from "../models/Payment.js";

export const createPaymentOrder = async ({ userId, credits }) => {
  try {
    console.log("=== Creating Order ===");
    console.log("User ID:", userId);
    console.log("Credits:", credits);
    
    const amount = credits * 100;
    console.log("Amount in paise:", amount);
    
    console.log("Razorpay instance:", razorpay); // ⭐ Yeh check karo
    
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });
    
    console.log("Order created successfully:", order);
    
    const payment = await Payment.create({
      userId,
      razorpayOrderId: order.id,
      amount,
      creditsPurchased: credits,
      status: "CREATED"
    });
    
    console.log("Payment record created:", payment);
    
    return { order, payment };
  } catch (error) {
    console.error("❌ Error in createPaymentOrder:", error.message);
    console.error("Full error:", error);
    
    // More detailed error information
    if (error.statusCode === 401) {
      console.error("\n🔴 AUTHENTICATION FAILED - Possible causes:");
      console.error("1. Key Secret doesn't match Key ID");
      console.error("2. Extra spaces or characters in .env file");
      console.error("3. Credentials were regenerated - old ones are invalid");
      console.error("4. Using Key ID and Secret from different Razorpay accounts");
      console.error("\n💡 Solution:");
      console.error("1. Go to Razorpay Dashboard → Settings → API Keys");
      console.error("2. Make sure you're in LIVE mode");
      console.error("3. Copy Key ID and Secret again (click 'Reveal' for secret)");
      console.error("4. Update your .env file with exact values (no spaces)");
      console.error("5. Restart your server");
    }
    
    throw error;
  }
};
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
const razorpay = new Razorpay({
    // key_id: 'rzp_test_RvM88LQwwarZ7F',
    // key_secret: '40rFmMWBESnZWRMngYGBxdrp'
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export default razorpay;
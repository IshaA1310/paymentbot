import express from "express";
import cors from "cors";
import paymentRoutes from "./routes/payment.js";
const app = express();

app.use("/api/payment/webhook", express.raw({type: "application/json"}));
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

app.use("/api/payment", paymentRoutes);

export default app;
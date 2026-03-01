const express = require("express");
const cors = require("cors");
const app = express();

// ── CORS: allow local Next.js frontend and any deployed frontend ────────────
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        process.env.FRONTEND_URL || "*"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

const authRoutes = require("./routes/authRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const logisticsRoutes = require("./routes/logisticsRoutes");
const decisionRoutes = require("./routes/decisionRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const ratingRoutes = require("./routes/ratingroutes");

app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/logistics", logisticsRoutes);
app.use("/api/decision", decisionRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/rating", ratingRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

module.exports = app;

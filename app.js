const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const logisticsRoutes = require("./routes/logisticsRoutes");
const decisionRoutes = require("./routes/decisionRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const  ratingRoutes = require("./routes/ratingroutes");
app.use("/api/rating", ratingRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/decision", decisionRoutes);
app.use("/api/logistics", logisticsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
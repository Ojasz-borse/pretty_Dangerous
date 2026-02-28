const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "success" // Static success for now as requested
    }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);

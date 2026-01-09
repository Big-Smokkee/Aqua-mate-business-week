const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  userId: {
    type: String,        // ← changed from ObjectId
    required: true
  },

  deviceId: {
    type: String,
    required: true
  },

  parameter: String,
  value: Number,

  severity: {
    type: String,
    enum: ["warning", "critical"]
  },

  message: String,

  status: {
    type: String,
    enum: ["active", "resolved"],
    default: "active"
  },

  resolvedBy: String,
  resolvedAt: Date

}, { timestamps: true });   // ⭐ gives createdAt + updatedAt automatically

module.exports = mongoose.model("Alert", alertSchema);
        
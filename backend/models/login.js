const mongoose = require("mongoose");


const loginAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ MUST match User model name
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  loginAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("LoginAttempt", loginAttemptSchema);




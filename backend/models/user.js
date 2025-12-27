const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    location: { type: String },
    avatar: {
      type: String,
      default: "/uploads/avatars/default.png",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);



 
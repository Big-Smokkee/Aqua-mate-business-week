const User = require("../models/user");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");


// ================= UPLOAD AVATAR =================
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }


    const avatarPath = `/uploads/avatars/${req.file.filename}`;


    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });


    // 🧹 Delete old avatar (if not default)
    if (user.avatar && user.avatar !== "/uploads/avatars/default.png") {
      const oldPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }


    user.avatar = avatarPath;
    await user.save();


    res.json({
      message: "Avatar updated successfully",
      avatar: avatarPath,
    });
  } catch (error) {
    console.error("UPLOAD AVATAR ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= CHANGE PASSWORD =================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;


    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }


    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }


    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });


    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is wrong" });
    }


    // Prevent same password
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return res
        .status(400)
        .json({ message: "New password must be different" });
    }


    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();


    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};




const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const LoginAttempt = require("../models/login");


// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, location } = req.body;


    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email & password required" });
    }


    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      location,
      // avatar auto set by schema default
    });


    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }


    // Save login history
    await LoginAttempt.create({
      userId: user._id,
      email: user.email,
    });


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });


    // ✅ SEND FULL USER DATA
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar, //  MOST IMPORTANT
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};




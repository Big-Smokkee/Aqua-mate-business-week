require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const auth = require("./middleware/auth");
const userRoutes = require("./routes/userRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
const PORT = 5000;


// ✅ Express v5 compatible CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(morgan("dev"));


// Routes
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads")); // MUST
app.use("/api/user", userRoutes);
app.use("/api", sensorRoutes);
app.use("/api/reports", reportRoutes);

// Protected route
app.get("/api/dashboard", auth, (req, res) => {
  res.json({
    message: `Welcome ${req.user.fullName}`,
    data: [
      { sensor: "Water Temperature", value: "27°C", ideal: "25-30°C" },
      { sensor: "pH Level", value: "7.2", ideal: "6.5-8.0" },
      { sensor: "Water Turbidity", value: "13L", ideal: "less than 25 NTU" },
    ],
  });
});


// 404 handler (NO wildcard string)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// Start server
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




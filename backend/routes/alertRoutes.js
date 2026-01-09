const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

// 📌 get all alerts
router.get("/", async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.json(alerts);
});

// 📌 manual resolve
router.put("/resolve/:id", async (req, res) => {
  await Alert.findByIdAndUpdate(req.params.id, {
    status: "resolved",
    resolvedBy: "manual",
    resolvedAt: new Date()
  });

  res.json({ message: "Alert resolved manually" });
});

module.exports = router;
// 📌 count active alerts (for navbar badge)
router.get("/count", async (req, res) => {
  const count = await Alert.countDocuments({ status: "active" });
  res.json({ count });
})
router.put("/resolve/:id", async (req, res) => {

  await Alert.findByIdAndUpdate(req.params.id, {
    status: "resolved",
    resolvedBy: "manual",
    resolvedAt: new Date()
  });

  res.json({ message: "Alert resolved manually" });
});

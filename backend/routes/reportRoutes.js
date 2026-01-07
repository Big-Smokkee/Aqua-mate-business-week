const express = require("express");
const router = express.Router();
const SensorData = require("../models/sensorData");

// 📌 1) Get 7 days daily averages
router.get("/daily-averages", async (req, res) => {
  try {
    const data = await SensorData.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          avgPh: { $avg: "$ph" },
          avgTurbidity: { $avg: "$turbidity" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
      { $limit: 7 }
    ]);

    res.json(data.reverse()); // oldest → newest
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch averages" });
  }
});

// 📌 2) Get readings by specific date
router.get("/by-date", async (req, res) => {

  const date = new Date(req.query.date);

  // 🔥 Start of selected day
  const start = new Date(date.setHours(0, 0, 0, 0));

  // 🔥 End of selected day
  const end = new Date(date.setHours(23, 59, 59, 999));

  const data = await SensorData.find({
    createdAt: { $gte: start, $lte: end }
  }).sort({ createdAt: 1 });

  res.json(data);
});

module.exports = router;

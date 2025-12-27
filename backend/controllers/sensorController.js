const SensorData = require("../models/sensorData");

// ESP32 sends data here
exports.saveSensorData = async (req, res) => {
  try {
    const { deviceId, ph, turbidity } = req.body;

    const data = new SensorData({
      deviceId,
      ph,
      turbidity
    });

    await data.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dashboard fetches latest data
exports.getLatestSensorData = async (req, res) => {
  const data = await SensorData.findOne().sort({ createdAt: -1 });
  res.json(data);
};

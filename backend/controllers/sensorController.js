const SensorData = require("../models/sensorData");
const Alert = require("../models/Alert");

const PH_MIN = 6.5;
const PH_MAX = 8.0;
const TURB_MAX = 25;

exports.saveSensorData = async (req, res) => {
  try {
    const { deviceId, ph, turbidity } = req.body;

    // TEMP user – later from token
    const userId = "ddd";

    // save sensor data
    const data = await SensorData.create({
      deviceId,
      ph,
      turbidity
    });

    // -------------- ALERT LOGIC ------------------

    // ⭐ pH alert
    if (ph < PH_MIN || ph > PH_MAX) {

      const existing = await Alert.findOne({
        userId,
        deviceId,
        parameter: "pH",
        status: "active"
      });

      if (!existing) {
        await Alert.create({
          userId,
          deviceId,
          parameter: "pH",
          value: ph,
          severity: "critical",
          message: `pH out of safe range (${ph})`
        });
      }

    } else {
      // ⭐ AUTO RESOLVE pH
      await Alert.updateMany(
        { userId, deviceId, parameter: "pH", status: "active" },
        { status: "resolved", resolvedBy: "auto", resolvedAt: new Date() }
      );
    }

    // ⭐ Turbidity alert
    if (turbidity > TURB_MAX) {
      const existing = await Alert.findOne({
        userId,
        deviceId,
        parameter: "Turbidity",
        status: "active"
      });

      if (!existing) {
        await Alert.create({
          userId,
          deviceId,
          parameter: "Turbidity",
          value: turbidity,
          severity: "warning",
          message: `High turbidity detected (${turbidity} NTU)`
        });
      }

    } else {
      // ⭐ AUTO RESOLVE turbidity
      await Alert.updateMany(
        { userId, deviceId, parameter: "Turbidity", status: "active" },
        { status: "resolved", resolvedBy: "auto", resolvedAt: new Date() }
      );
    }

    // ----------------------------------------------

    res.status(200).json({ success: true, data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getLatestSensorData = async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ message: "No sensor data found" });
    }

    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

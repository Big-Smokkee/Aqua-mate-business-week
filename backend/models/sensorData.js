const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true
  },
  ph: {
    type: Number,
    required: true
  },
  turbidity: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SensorData", sensorDataSchema);

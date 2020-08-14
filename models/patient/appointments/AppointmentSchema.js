const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    date: {
      type: String,
    },
    hour: {
      type: String,
    },
    day: {
      type: String,
    },
    duration: { type: String },
    procedure: {
      type: String,
    },
  },
  { _id: false }
);

module.exports = AppointmentSchema;

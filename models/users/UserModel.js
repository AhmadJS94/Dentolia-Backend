const mongoose = require('mongoose');
const patientSchema = require('../../models/patient/PatientModel');
const LabSchema = require('../lab/LabSchema');
const moment = require('moment');
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  officeName: {
    type: String,
    required: true,
  },

  patients: {
    type: [patientSchema],
    default: [],
  },
  labs: {
    type: [LabSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: moment,
  },
});

module.exports = mongoose.model('User', UserSchema);

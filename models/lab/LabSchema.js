const mongoose = require('mongoose');

const pricesSchema = new mongoose.Schema({
  pfm: {
    type: String,
    default: '',
  },

  metal: {
    type: String,
    default: '',
  },
  zirconia: {
    type: String,
    default: '',
  },
  veneers: {
    type: String,
    default: '',
  },
  fullRpd: {
    type: String,
    default: '',
  },
  partialRpd: {
    type: String,
    default: '',
  },
  ortho: {
    type: String,
    default: '',
  },
  vacuum: {
    type: String,
    default: '',
  },
});

const businessInfoSchema = new mongoose.Schema({
  ceramicType: {
    type: String,
  },
  metalType: {
    type: String,
  },
  prices: {
    type: pricesSchema,
  },
});
const LabSchema = new mongoose.Schema({
  labName: {
    type: String,
    default: '',
  },
  technicianName: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  speciality: {
    type: [String],
    default: '',
  },
  businessInfo: {
    type: businessInfoSchema,
    default: {},
  },
});

module.exports = LabSchema;

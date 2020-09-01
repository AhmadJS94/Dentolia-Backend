const mongoose = require('mongoose');
// const Patient = require('../PatientModel');

const PersonalInfoSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: '',
      // required: true,
    },
    age: {
      type: String,
      default: '',
      // required: true,
    },
    address: {
      type: String,
      default: '',
      // required: true,
    },
    occupation: {
      type: String,
      default: '',
      // required: true,
    },
    phoneNumber: {
      type: String,
      default: '',
      // required: true
    },
  },
  { _id: false }
);
module.exports = PersonalInfoSchema;

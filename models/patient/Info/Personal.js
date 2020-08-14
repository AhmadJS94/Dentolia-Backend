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
      required: true,
    },
    age: {
      type: String,
      // required: true,
    },
    address: {
      type: String,
      // required: true,
    },
    occupation: {
      type: String,
      // required: true,
    },
    phoneNumber: {
      type: String,
      // required: true
    },
  },
  { _id: false }
);
module.exports = PersonalInfoSchema;

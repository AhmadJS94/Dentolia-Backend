const mongoose = require('mongoose');
const PersonalInfoSchema = require('./Info/Personal');
const MedicalInfoSchema = require('./Info/Medical');
const AppointmentSchema = require('./appointments/AppointmentSchema');
const medicalFormSchema = require('./forms/MedicalForm');

const dentalInfoSchema = require('./Info/dental/dentalInfoSchema');
// const PatientMedicalInfo = require('./Info/Medical');

// All teeth schema
// const teethSchema = new mongoose.Schema({});
//Medical history schema

//dental history schema

// const dentalHistorySchema = new mongoose.Schema({
//   numberOfTeeth: {
//     type: Number,
//   },
//   typeOfTeeth: {
//     type: String,
//   },
//   lastProcedure: {
//     type: String,
//   },
//   teeth: [teethSchema],
// });

//Overall patient Profile schema
const patientSchema = new mongoose.Schema({
  personalInfo: {
    type: PersonalInfoSchema,
    default: {},
  },

  medicalInfo: {
    type: MedicalInfoSchema,
    default: {},
  },
  appointments: {
    type: [AppointmentSchema],
    default: [],
  },
  medicalForms: [medicalFormSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dentalInfo: {
    type: dentalInfoSchema,
    default: {},
  },
});
module.exports = patientSchema;

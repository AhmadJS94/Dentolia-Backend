const mongoose = require('mongoose');
const conditionsSchema = new mongoose.Schema(
  {
    name: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);
const allergiesSchema = new mongoose.Schema(
  {
    name: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);
const surgerySchema = new mongoose.Schema(
  {
    name: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);
const medicationsSchema = new mongoose.Schema(
  {
    name: [{ type: String }],
  },
  { _id: false }
);

const MedicalInfoSchema = new mongoose.Schema(
  {
    medicalConditions: {
      type: [String],
      default: [],
    },

    pastSurgeries: {
      type: [String],
      default: [],
    },

    allergies: {
      type: [String],
      default: [],
    },
    medications: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

module.exports = MedicalInfoSchema;

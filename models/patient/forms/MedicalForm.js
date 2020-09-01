const mongoose = require('mongoose');

const allergiesSchema = new mongoose.Schema(
  {
    adrenaline: {
      type: Boolean,
      default: false,
    },
    latex: {
      type: Boolean,
      default: false,
    },
    pencillin: {
      type: Boolean,
      default: false,
    },
    ibuProfen: {
      type: Boolean,
      default: false,
    },
    codeine: {
      type: Boolean,
      default: false,
    },
    aspirin: {
      type: Boolean,
      default: false,
    },
    iodine: {
      type: Boolean,
      default: false,
    },
    sulfa: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);
const medicalConditionsSchema = new mongoose.Schema(
  {
    asthma: {
      type: Boolean,
      default: false,
    },
    bleedingProblems: {
      type: Boolean,
      default: false,
    },
    cancer: {
      type: Boolean,
      default: false,
    },
    diabetes: {
      type: Boolean,
      default: false,
    },
    bloodPressure: {
      type: Boolean,
      default: false,
    },
    liverDisease: {
      type: Boolean,
      default: false,
    },
    kidnetDisease: {
      type: Boolean,
      default: false,
    },
    heartProblems: {
      type: Boolean,
      default: false,
    },
    heartStroke: {
      type: Boolean,
      default: false,
    },
    pregnancy: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);
const socialHabitsSchema = new mongoose.Schema(
  {
    smoking: {
      type: Boolean,
      default: false,
    },
    alcohol: {
      type: Boolean,
      default: false,
    },
    nuts: {
      type: Boolean,
      default: false,
    },
    soda: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);
const specialNotesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: 'false',
    },
  },
  { _id: false }
);

const medicalFormSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Medical Form',
  },
  date: {
    type: String,
    default: '',
  },
  allergies: {
    type: allergiesSchema,
    default: {},
  },
  medicalConditions: {
    type: medicalConditionsSchema,
    default: {},
  },
  medications: {
    type: [String],
    default: [],
  },
  pastSurgeries: {
    type: [String],
    default: [],
  },
  bloodType: {
    type: String,
    default: '',
  },
  socialHabits: {
    type: socialHabitsSchema,
    default: {},
  },
  specialNotes: {
    type: [specialNotesSchema],
    default: {},
  },
});

module.exports = medicalFormSchema;

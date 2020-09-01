const mongoose = require('mongoose');

const proceduresSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: '',
    },
    option: {
      type: String,
      default: '',
    },
    surfaces: {
      type: [String],
    },
    date: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);
const conditionsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: '',
    },
    option: {
      type: String,
      default: '',
    },
    surfaces: {
      type: [String],
    },
    date: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const toothSchema = new mongoose.Schema(
  {
    procedures: {
      type: [proceduresSchema],
      default: [],
    },
    conditions: {
      type: [conditionsSchema],
      default: [],
    },
  },
  { _id: false }
);
const teethSchema = new mongoose.Schema(
  {
    tooth_11: {
      type: toothSchema,
      default: {},
    },
    tooth_12: {
      type: toothSchema,
      default: {},
    },
    tooth_13: {
      type: toothSchema,
      default: {},
    },
    tooth_14: {
      type: toothSchema,
      default: {},
    },
    tooth_15: {
      type: toothSchema,
      default: {},
    },
    tooth_16: {
      type: toothSchema,
      default: {},
    },
    tooth_17: {
      type: toothSchema,
      default: {},
    },
    tooth_18: {
      type: toothSchema,
      default: {},
    },
    tooth_21: {
      type: toothSchema,
      default: {},
    },
    tooth_22: {
      type: toothSchema,
      default: {},
    },
    tooth_23: {
      type: toothSchema,
      default: {},
    },
    tooth_23: {
      type: toothSchema,
      default: {},
    },
    tooth_24: {
      type: toothSchema,
      default: {},
    },
    tooth_25: {
      type: toothSchema,
      default: {},
    },
    tooth_26: {
      type: toothSchema,
      default: {},
    },
    tooth_27: {
      type: toothSchema,
      default: {},
    },
    tooth_28: {
      type: toothSchema,
      default: {},
    },
    tooth_31: {
      type: toothSchema,
      default: {},
    },
    tooth_32: {
      type: toothSchema,
      default: {},
    },
    tooth_33: {
      type: toothSchema,
      default: {},
    },
    tooth_34: {
      type: toothSchema,
      default: {},
    },
    tooth_35: {
      type: toothSchema,
      default: {},
    },
    tooth_36: {
      type: toothSchema,
      default: {},
    },
    tooth_37: {
      type: toothSchema,
      default: {},
    },
    tooth_38: {
      type: toothSchema,
      default: {},
    },
    tooth_41: {
      type: toothSchema,
      default: {},
    },
    tooth_42: {
      type: toothSchema,
      default: {},
    },
    tooth_43: {
      type: toothSchema,
      default: {},
    },
    tooth_44: {
      type: toothSchema,
      default: {},
    },
    tooth_45: {
      type: toothSchema,
      default: {},
    },
    tooth_46: {
      type: toothSchema,
      default: {},
    },
    tooth_47: {
      type: toothSchema,
      default: {},
    },
    tooth_48: {
      type: toothSchema,
      default: {},
    },
  },
  { _id: false }
);
const dentalInfoSchema = new mongoose.Schema({
  teeth: {
    type: teethSchema,
    default: {},
  },
  forms: {
    type: String,
    default: '',
  },
});

module.exports = dentalInfoSchema;

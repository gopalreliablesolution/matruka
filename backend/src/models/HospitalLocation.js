const mongoose = require('mongoose');

const hospitalLocationSchema = new mongoose.Schema(
  {
    sectionTitle: {
      type: String,
      trim: true,
      default: 'Visit Our Clinic',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      default: 'Surat',
    },
    state: {
      type: String,
      required: true,
      trim: true,
      default: 'Gujarat',
    },
    pincode: {
      type: String,
      trim: true,
      default: '395007',
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    days: {
      type: String,
      default: 'Monday to Saturday',
    },
    hours: {
      type: String,
      default: '10:00 AM to 1:00 PM | 5:00 PM to 7:00 PM',
    },
    mapEmbedUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.HospitalLocation ||
  mongoose.model('HospitalLocation', hospitalLocationSchema);

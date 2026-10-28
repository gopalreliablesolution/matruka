const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    location: { type: String, default: 'Surat, Gujarat' },
    story: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    patientImage: { type: String, default: '' },
    treatmentReceived: { type: String, required: true },
    doctorAttended: { type: String, default: 'Dr. Kairavi Yagnik & Dr. Rut Shah' },
    isFeatured: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.index({ isPublished: 1, isFeatured: -1, sortOrder: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);


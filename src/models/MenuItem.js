const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', default: null },
    sortOrder: { type: Number, default: 0 },
    isHeader: { type: Boolean, default: true },
    isFooter: { type: Boolean, default: false },
    footerSection: {
      type: String,
      enum: ['quick_links', 'specialities', 'patient_info'],
      default: 'quick_links',
    },
    isActive: { type: Boolean, default: true },
    isExternal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

menuItemSchema.index({ isHeader: 1, isActive: 1, sortOrder: 1 });
menuItemSchema.index({ isFooter: 1, isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);


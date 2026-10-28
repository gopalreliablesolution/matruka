const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'system' },
    userName: { type: String, default: 'System' },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'publish', 'unpublish', 'login', 'logout', 'system'],
      required: true,
    },
    module: { type: String, required: true },
    description: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

activityLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);


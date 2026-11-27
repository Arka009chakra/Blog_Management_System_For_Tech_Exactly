const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  targetType: String,
  targetId: String,
  details: String
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);

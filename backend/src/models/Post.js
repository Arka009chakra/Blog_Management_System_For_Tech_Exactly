const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, unique: true, trim: true },
  body: { type: String, required: true, maxlength: 30000 },
  excerpt: { type: String, maxlength: 400, default: '' },
  category: { type: String, default: 'General', trim: true },
  tags: [{ type: String, trim: true, lowercase: true }],
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

postSchema.index({ title: 'text', body: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);

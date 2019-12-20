const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const novelSchema = new Schema({
  title: String,
  author_name: String,
  description: String,
  chapters: [{ name: String, text: String }],
  comments: [{ user_id: Schema.Types.ObjectId, text: String }],
  genres: [Number],
  last_update: Date,
  total_rate: Number,
  rate_count: Number
});

const Novel = mongoose.model('novels', novelSchema);

module.exports = Novel;
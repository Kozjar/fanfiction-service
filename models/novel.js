const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const novelSchema = new Schema({
  title: String,
  author_id: Schema.Types.ObjectId,
  description: String,
  chapters: [{ name: String, text: String }],
  comments: [{ user_id: Schema.Types.ObjectId, text: String, date: Date }],
  genres: [Number],
  last_update: Date,
  upload_date: Date,
  total_rate: Number,
  user_rate: [{ rate: Number }]
});

const Novel = mongoose.model('novels', novelSchema);

module.exports = Novel;
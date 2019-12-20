const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genresSchema = new Schema({
  pos: Number,
  en: String,
  ru: String
});

const Genre = mongoose.model('genres', genresSchema);

module.exports = Genre;
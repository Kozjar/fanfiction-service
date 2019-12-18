const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genresSchema = new Schema({
  name: String
});

const Genre = mongoose.model('genres', genresSchema);

module.exports = Genre;
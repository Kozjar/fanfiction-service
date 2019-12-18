const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    email_status: Boolean,
    isAdmin: Boolean,
    sessionId: String
});

const User = mongoose.model('users', userSchema);

module.exports = User;
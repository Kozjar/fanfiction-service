const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const keys = require('./config/keys');

const app =express();

app.use(bodyParser.json());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURL, () => {
    console.log('connected to mongodb');
});

const server = app.listen(8000, () => {
    console.log('\x1b[32mListening \x1b[36mhttp://localhost:8000', '\x1b[0m');
});
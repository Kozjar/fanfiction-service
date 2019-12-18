const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const api = require('./routes/api');

const keys = require('./config/keys');

const app =express();

app.use(bodyParser.json());
app.use(cors());

// set up routes
app.use('/api', api);

// connect to mongodb
mongoose.connect(keys.mongodb.dbURL, () => {
    console.log('connected to mongodb');
});

const server = app.listen(8000, () => {
    console.log('\x1b[32mListening \x1b[36mhttp://localhost:8000', '\x1b[0m');
});
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const usersApi = require('./routes/usersApi');
const novelsApi = require('./routes/novelsApi');

const keys = require('./config/keys');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURL, () => {
    console.log('connected to mongodb');
});

app.use(session({
  secret: 'kozjar',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000,
    secure: false
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// set up routes
app.use('/api/users', usersApi);
app.use('/api/novels', novelsApi);

const server = app.listen(4000, () => {
    console.log('\x1b[32mListening \x1b[36mhttp://localhost:4000', '\x1b[0m');
});
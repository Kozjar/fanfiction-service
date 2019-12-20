const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const api = require('./routes/api');
const novelsApi = require('./routes/novelsApi');

const keys = require('./config/keys');

const app =express();

app.use(bodyParser.json());
app.use(cookieParser());
// app.use(cors());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURL, () => {
    console.log('connected to mongodb');
});

app.use(session({
  secret: 'kozjar',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60,
    secure: false
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// set up routes
app.use('/api', api);
app.use('/api/novels', novelsApi);
app.get('/api/', (req, res) => {
  res.send("tttt");
})
app.get('/api/testCookie', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
  res.send('ok');
})

app.get('/api/initCookie', function (req, res) {
  console.log(req.session.testNums)
  if (req.session.testNums) {
    req.session.testNums = 2;
  }
  else {
    req.session.testNums = 1;
  }
  console.log("visits: " + req.session.testNums);
  res.send('ok');
})

const server = app.listen(8000, () => {
    console.log('\x1b[32mListening \x1b[36mhttp://localhost:8000', '\x1b[0m');
});
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const path = require('path');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const usersApi = require('./routes/usersApi');
const novelsApi = require('./routes/novelsApi');

let mongoURL = undefined;

if (process.env.NODE_ENV !== 'production') {
  mongoURL = require('./config/keys').mongodb.dbURL;
} else {
  mongoURL = process.env.MONGODB_URL;
}

const app = express();

const port = process.env.PORT || 4000;

// app.use(express.static(path.join(__dirname, 'frontend/build')));

app.use(bodyParser.json());
app.use(cookieParser());
//build mode


// connect to mongodb
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }, () => {
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
// app.get('*', (req, res) => { res.sendFile(path.join(__dirname+'/frontend/public/index.html')); })

//production mode
if(process.env.NODE_ENV === 'production') {  
  app.use(express.static(path.join(__dirname, 'frontend/build'))); 
  app.get('*', (req, res) => { res.sendfile(path.join(__dirname = 'frontend/build/index.html')); });
}

const server = app.listen(port, () => {
    console.log('\x1b[32mListening \x1b[36mhttp://localhost:4000', '\x1b[0m');
});
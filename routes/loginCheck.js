const User = require('../models/user');

const checkIsLoggedIn = (req, res, next) => {
  req.isLoggedIn = true;
  User.findById(req.session.userId)
  .then(user => {
    if (user) next();
    else {
      req.isLoggedIn = false;
      next();
    }
  })
  .catch(err => console.log(`checkIsLoggedIn error: ${err}`))
}

const checkIsLoggedInStrict = (req, res, next) => {
  req.isLoggedIn = true;
  User.findById(req.session.userId)
  .then(user => {
    if (user) next();
    else {
      res.status(401).send();
    }
  })
  .catch(err => console.log(err))
}

module.exports = { checkIsLoggedIn, checkIsLoggedInStrict }
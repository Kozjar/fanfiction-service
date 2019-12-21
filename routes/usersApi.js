const router = require('express').Router();
const User = require('../models/user');
const ACCESS_TYPE = require('../config/userAccessType');

router.post('/register', (req, res) => {
    User.findOne({ $or: [ {username: req.body.username}, {email: req.body.email} ]})
    .then(user => {
      if (user) {
        if (user.email === req.body.email)
          res.status(401).send({ problemField: 'email' });
        else
          res.status(401).send({ problemField: 'username' });
      }

      else {
        new User({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          email_status: false,
          isAdmin: false
        }).save()
        .then(newUser => {
            res.send({username: newUser.username, access: newUser.isAdmin});
        })
        .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(`wtf, error ${err}`));
});

router.get('/login', (req, res) => {
  User.findById(req.session.userId)
  .then(user => {
    if (!user) res.send({access: ACCESS_TYPE.guest});
    else res.send({username: user.username, access: user.isAdmin});
  })
  .catch(err => console.log(`cant login via cookie ${err}`));
})

router.post('/login', (req, res) => {
  User.findOne({email: req.body.email, password: req.body.password})
  .then(user => {
    console.log(user);
    if (!user) res.status(400).send();
    else {
      req.session.userId = user._id;
      res.send({username: user.username, access: user.isAdmin});
    }
  })
  .catch(err => console.log(`cant login ${err}`));
})

router.delete('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
    console.log(`error: ${err}`);
    console.log(req.session);
    res.status(500).send(err);
    }
    else {
      console.log('session was destroyed');
      res.send('session was destroyed');
    }
  });
})

module.exports = router;
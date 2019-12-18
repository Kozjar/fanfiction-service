const router = require('express').Router();
const User = require('../models/user');

router.post('/users/register', (req, res) => {
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
})

router.post('/users/login', (req, res) => {

    User.findOne({email: req.body.email, password: req.body.password})
    .then(user => {
        if (!user) res.status(401).send();
        else res.send({username: user.username, access: user.isAdmin});
    })
    .catch(err => console.log(`cant login ${err}`));
})

module.exports = router;
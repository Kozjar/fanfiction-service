const router = require('express').Router();
const User = require('../models/users');

router.post('/users/register', (req, res) => {
    Users.findOne({ $or: [ {username: req.body.username}, {email: req.body.email} ]})
    .then(user => {
        if (user) {
            if (user.email === req.body.email)
                res.status(401).send('email');
            else
                res.status(401).send('username');
        }

        else {
            new Users({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            }).save()
            .then(newUser => {
                res.send(newUser);
            })
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(`wtf, error ${err}`));
})

router.post('/users/login', (req, res) => {
    Users.findOne({email: req.body.email, password: req.body.password})
    .then(user => {
        if (!user) res.status(401).send();
        else res.send(user);
    })
    .catch(err => console.log(`cant login ${err}`));
})
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const userModel = mongoose.model('user');
var router = express.Router();

router.post('/register', function(req, res) {
    if(!req.body.username || !req.body.password) {
        return res.status(404).send(
            {message: "username or password missing"});
    } else {
        var user = new userModel({username: req.body.username, 
            password: req.body.password});
        user.save(function(error) {
            if(error) return res.status(500).send({message: "db error"});
            return res.status(200).send({message: "registration success"});
        })
    }
});

router.get('/', function(req, res) {
    console.log("Query parameterek", req.query);
    console.log(req.session.passport.user);
    if(req.isAuthenticated()) {
        return res.status(200).send({message: "Hello World"});
    } else {
        return res.status(403).send({message: "You are not welcome here"});
    }
});

router.get('/users', function(req, res) {
    if(req.isAuthenticated() && req.session.passport.user.username === "admin") {
        userModel.find({}, function(err, users) {
            return res.status(200).send(users);
        })
    } else {
        return res.status(403).send({message: "Unauthorized access"});
    }
})

router.post('/logout', function(req, res) {
    if(req.isAuthenticated()) {
        req.logout();
        res.status(200).send({message: "You have been logged out"});
    } else {
        res.status(403).send({message: "You have to log in first"});
    }
});

router.post('/login', function (req, res) {
    if (req.body.username && req.body.password) {
        passport.authenticate('local', function (error, username) {
            if (error) {
                return res.status(403).send(error);
            } else {
                req.logIn(username, function (error) {
                    if (error) return res.status(500).send(error);
                    return res.status(200).send({message: "login successful"});
                })
            }
        })(req, res);
    } else {
        return res.status(403).send({message: "username and password required"});
    }
})

router.route('/book').get(function (req, res) {
    return res.status(404).send({message: "No books yet"});
}).post(function (req, res) {
    return res.status(200).send({message: "new book stored"});
}).put(function (req, res) {
    return res.status(200).send({message: "book updated"});
}).delete(function (req, res) {
    return res.status(200).send({message: "book deleted"});
})

module.exports = router;
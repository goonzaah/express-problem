const express = require('express');
const router = express.Router();

const passport = require('passport')
const {isLoggedIn} = require('../lib/auth')
const {isNotLoggedIn} = require('../lib/auth')

// -- SIGNUP --

router.get('/signup',isNotLoggedIn, (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
}))

// -- SIGNIN --

router.get('/signin', isNotLoggedIn,(req, res) =>{
    res.render('auth/signin')
})

router.post('/signin', isNotLoggedIn, (req,res,next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/home',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
})

// home

router.get('/home', isLoggedIn,(req, res) => {

    res.render('home')
})

// Logout

router.get('/logout', isLoggedIn, (req, res) =>{
    req.logOut();
    res.redirect('/signin')
})




module.exports = router;
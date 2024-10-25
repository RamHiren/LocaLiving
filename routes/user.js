const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl} = require('../middleware/middleware');
const userController = require('../controllers/user')

// signup
router.get('/signup',(req,res)=>{
    res.render('users/signup.ejs')
});

// signData save in DB
router.post('/signup', wrapAsync(userController.signUp));


// login
router.get('/login',(req,res)=>{
    res.render('users/login.ejs')
})

// login data verify in DB
router.post('/login',
    saveRedirectUrl,
    passport.authenticate('local',{failureRedirect:'/login',failureFlash:true }),
    wrapAsync(userController.login))

// logout
router.get('/logout',userController.logout)

module.exports = router;
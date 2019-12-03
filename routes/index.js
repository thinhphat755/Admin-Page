var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
var indexController = require('../controllers/indexController');
var usersController = require('../controllers/usersController');

//User model
const User = require('../models/user');

/* GET home page. */
router.get('/', ensureAuthenticated, indexController.home);

/* GET register page. */
router.get('/register', forwardAuthenticated, usersController.register);

/* GET login page. */
router.get('/login', forwardAuthenticated, usersController.login);

/*POST method register page*/
router.post('/register', (req, res) => {
  const {name, email, username, password, password2} = req.body;
  let errors = [];

  //Check required Fields
  if(!name || !email || !username || !password || !password2){
    errors.push({ msg: 'Please fill in all fields' });
  }

  //Check password match
  if(password !== password2){
    errors.push({ msg:'Password do not match! Please fill again!' });
  }

  //Check password length
  if(password.length < 6){
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if(errors.length === 0){
    //Validation passed
    User.findOne({ email:email })
    .then(user => {
      if(user){
        //User exists
        errors.push({ msg: 'Email is already registered'});
        res.render('register');
      } else{
        const newUser = new User({
          name,
          email,
          username,
          password
        });
        
        //Hash password
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) =>
        {
          if(err) throw err;
          
          newUser.password = hash;

          newUser.save()
            .then(user => {
              req.flash('success_msg', 'You are now registered and can log in!');
              res.redirect('/login');
            })
            .catch(err => console.log(err));
        }))
      }
    });
  } else{
    res.render('register');
  }
});

//Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});

module.exports = router;
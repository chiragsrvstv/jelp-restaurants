const express = require('express');
const router  = express.Router();
const passport = require("passport");
const User    = require("../models/user");
const middleware = require('../middleware');

// register

router.get("/register", function(req, res) {
  res.render('register.ejs');
});

router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if(err){
      console.log(err);
      req.flash("error", err.message); // if user already exist we flash 'err' message
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

//logging

router.get("/login", function(req, res) {
  res.render('login.ejs');
});

router.post("/login",passport.authenticate("local",{
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}) ,function(req, res) {

});

//logout

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "logged you out");
  res.redirect("/");
})


module.exports = router;

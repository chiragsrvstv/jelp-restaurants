const express = require('express');
const router  = express.Router();
const passport = require("passport");
const User    = require("../models/user");

// register

router.get("/register", function(req, res) {
  res.render('register.ejs');
});

router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if(err){
      console.log(err);
      return res.render("register.ejs")
    }
    passport.authenticate("local")(req, res, function(){
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
  res.redirect("/");
})

// checking unauth sessions

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
const express = require('express');
const router = express.Router();
const Campground  = require("../models/campground");
const Comment = require("../models/comment");


// new comment
router.get('/campgrounds/:id/comments/new',isLoggedIn ,function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err){
      console.log(err);
    }
    else{
      res.render('comments/new.ejs', {campground: foundCampground});
    }
  })
});

//create coment
router.post('/campgrounds/:id/comments',isLoggedIn ,function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    }
    else{
      console.log(req.body.comment);
      Comment.create(req.body.comment, function(err, comment) {
        if(err){
          console.log(err);
        }
        else{
          // add username and id to comments
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          foundCampground.comments.push(comment);
          comment.save();
          foundCampground.save();
          console.log(comment);
          res.redirect('/campgrounds/' + foundCampground._id);
        }
      })
    }
  });
  // lookup campground using id
  // create new comment
  // connect new comment to campground
  // redirect back to show page

});

// middleware

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
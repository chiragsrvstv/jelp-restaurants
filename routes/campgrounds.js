const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require('../middleware');

// landing
router.get("/", function(req, res) {
  res.render("home.ejs");
});

// Index - Show all campgrounds
router.get("/campgrounds", function(req, res) {
  // adding from db
  console.log(req.user);
  Campground.find({}, function(err, campgroundsFromDb) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index.ejs", { campgrounds: campgroundsFromDb });
    }
  });
});

// New - Show form to add a campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new.ejs");
});

// Create - Add a new campground
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
  //get data from form and add to array + redirect back
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };

  var newCampground = {
    name: name,
    image: image,
    description: description,
    author: author
  };

  // create and save campground to db
  Campground.create(newCampground, function(err, newlyCreatedCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log("successfully created");
      res.redirect("/campgrounds");
      console.log(newlyCreatedCampground);
    }
  });
});

// show
router.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        res.render("campgrounds/show.ejs", { campground: foundCampground });
      }
    });
});

// edit
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(
  req,
  res
) {
  //is user logged in:
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render("campgrounds/edit.ejs", { campground: foundCampground });
  });
});

//  yes: does the user own the campground
//        no: redirect
//   no: then redirect



//


//update
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
  //find and update them redirect
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//destroy
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership ,function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground Deleted");
      res.redirect("/campgrounds");
    }
  });
});




module.exports = router;

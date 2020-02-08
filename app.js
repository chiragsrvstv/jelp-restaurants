var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require('./models/campground'),
    //seedDB      = require('./seeds'),
    Comment     = require('./models/comment'),
    passport    = require("passport"),
    LocalStategy = require("passport-local"),
    User        = require("./models/user"),
    methodOverride = require("method-override");

const commentRoutes     = require("./routes/comments"),
      campgroundRoutes  = require("./routes/campgrounds"),
      authRoutes        = require("./routes/index");


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// server will listen for localhost
app.listen(3000, function(){
  console.log("serving YelpCamp localhost port 3000");
});

// connecting with db
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});

// passport config
app.use(require("express-session")({
  secret: "I am the best",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this middleware gives every template the username object
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});



app.use(authRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

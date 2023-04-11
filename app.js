const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    environment = require("dotenv").config(),
    User = require("./models/user");

var indexRoutes = require("./routes/index");
var questionRoutes = require("./routes/question");
var paperRoutes = require("./routes/paper")

if (environment.error) {
    throw environment.error;
}

console.log(environment.parsed);

// mongoose.connect(process.env.DATABASEURL);
// MongoClient.connect(process.env.DATABASEURL, { useUnifiedTopology: true })

mongoose.connect(process.env.DATABASEURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true });

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(
    require("express-session")({
        secret: "SANE",
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/questions", questionRoutes);
app.use("/papers", paperRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server is live at Port:", process.env.PORT);
});
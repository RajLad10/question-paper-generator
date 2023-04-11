var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res) => {
	res.render("home");
});

router.get("/register", (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	var newUser = new User({
		username: req.body.username
	});
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function () {
			req.flash("success", "Welcome to Question Paper Generator System " + user.username);
			res.redirect("/");
		});
	});
});

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
	// failureRedirect: "/"
}), function (req, res) {});


// actual code

// router.get("/logout", (req, res) => {
// 	req.logout();
// 	req.flash("success", "Logged you out!");
// 	res.redirect("/");
// })


// my code
router.get('/logout', function(req, res) {
	req.logout(function(err) {
	  	if (err) { 
			req.flash("error", err.message);
		}
	  	req.flash("success", "Logged you out!");
	  	res.redirect('/');
	});
  });

module.exports = router;
var express = require("express");
var router = express.Router();
var question = require("../models/question");
var middleware = require("../middleware/index");

router.get("/", middleware.isLoggedIn, (req, res) => {
    question.find({
        "author.username": "" + req.user.username + ""
    }, (err, allQuestions) => {
        if (err) {
            console.log(err);
        } else {
            res.render("questions/index", {
                questions: allQuestions
            });
        }
    });
})

router.get("/add", middleware.isLoggedIn, (req, res) => {
    res.render("questions/add");
})

router.post("/add", middleware.isLoggedIn, (req, res) => {
    var newQuestion = {
        format: req.body.format,
        subject: req.body.subject,
        topic: req.body.topic,
        question: req.body.question,
        solution: req.body.solution,
        difficulty: req.body.difficulty,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    question.create(newQuestion, (err, newlyCreated) => {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/questions");
        } else {
            console.log(newlyCreated);
            req.flash("success", "Added question to your library");
            res.redirect("/questions");
        }
    });
})

router.get("/:id/edit", middleware.isLoggedIn, (req, res) => {
    question.findById(req.params.id, (err, foundQuestion) => {
        res.render("questions/edit", {
            question: foundQuestion
        });
    });
})

router.put("/:id", middleware.isLoggedIn, (req, res) => {
    question.findByIdAndUpdate(req.params.id, req.body.question, (err, updatedQuestion) => {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/questions");
        } else {
            req.flash("success", "Updated Question");
            res.redirect("/questions");
        }
    })
})

router.get("/:id", middleware.isLoggedIn, (req, res) => {
    question.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/questions");
        } else {
            req.flash("success", "Deleted Question");
            res.redirect("/questions");
        }
    });
});

router.post("/search", middleware.isLoggedIn, (req, res) => {
    var search = {
        "author.username": "" + req.user.username + ""
    }
    if (req.body.format != '') {
        search.format = req.body.format;
    }
    if (req.body.subject != '') {
        search.subject = req.body.subject;
    }
    if (req.body.topic != '') {
        search.topic = req.body.topic;
    }
    if (req.body.difficulty != '') {
        search.difficulty = req.body.difficulty;
    }
    console.log(search);
    question.find(search, (err, allQuestions) => {
        if (err) {
            console.log(err);
        } else {
            res.render("questions/search", {
                questions: allQuestions
            });
        }
    })
})
module.exports = router;
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index");
var paper = require("../models/paper");
var question = require("../models/question");

router.get("/", middleware.isLoggedIn, (req, res) => {
    paper.find({
        "author.username": "" + req.user.username + ""
    }, (err, allPapers) => {
        if (err) {
            console.log(err);
        } else {
            res.render("papers/index", {
                paper: allPapers
            });
        }
    });
})

router.get("/generate", middleware.isLoggedIn, (req, res) => {
    res.render("papers/generate");
})

// my code <
// router.get("/qpaper", middleware.isLoggedIn, (req, res) => {
//     // paper.find({
//     //     "author.username": "" + req.user.username + ""
//     // }, (err, allPaper) => {
//     //     if (err) {
//     //         console.log(err);
//     //     } else {
//     //         res.render("papers/qpaper", {
//     //             paper: allPaper
//     //         });
//     //     }
//     // });
//     question.find({
//         "author.username": "" + req.user.username + ""
//     }, (err, allQuestions) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(allQuestions);
//             res.render("papers/qpaper", {
//                 question: allQuestions
//             });
//         }
//     });
//     // res.render("papers/qpaper");
// })
// my code >


router.post("/generate", middleware.isLoggedIn, (req, res) => {
// router.post("/qpaper", middleware.isLoggedIn, (req, res) => {
    var newPaper = {
        name: req.body.name,
        difficulty: req.body.difficulty,
        numberOfQuestions: req.body.numberOfQuestions,
        subject: req.body.subject,
        time: req.body.time,
        topic: req.body.topic,
        // questions: req.body.questions,
        questions: {
            questions: req.body.question,
        },
        format: req.body.format,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }
    
    console.log(newPaper);

    // Written by me <
    paper.create(newPaper, (err, newlyCreated) => {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/papers");
        } else {
            // console.log(newlyCreated);
            
            req.flash("success", "New paper created");
            res.redirect("/papers");
        }
    });
    // Written by me >
});


// Delete Paper
router.get("/:id", middleware.isLoggedIn, (req, res) => {
    paper.findByIdAndRemove(req.params.id, function (err) {
        console.log(req.params.id);
        if (err) {
            req.flash("error", err.message)
            res.redirect("/papers");
        } else {
            req.flash("success", "Deleted Paper");
            res.redirect("/papers");
        }
    });
});

// Search paper
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
    paper.find(search, (err, allPaper) => {
        if (err) {
            console.log(err);
        } else {
            res.render("papers/search", {
                papers: allPaper
            });
        }
    })
})
module.exports = router;
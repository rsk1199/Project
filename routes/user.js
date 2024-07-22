const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {  saveRedirectUrl } = require("../middleware.js");

// Sign-up route - render the sign-up form
router.get("/signup", (req, res) => {
    res.render("users/signUp.ejs");
});

// Sign-up route - handle the form submission
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerdUser = await User.register(newUser, password);
        console.log(registerdUser);
        // automatic log in if user sign up
        req.login(registerdUser ,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listing");
        } )
       
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
})
);

// Login route - render the login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login route - handle the login form submission
router.post("/login",saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    async (req, res) => {   
        req.flash("success", "welcome back to Wanderlust!");
        let redirectUrl =res.locals.redirectUrl || "/listing";
        res.redirect(redirectUrl);
    });

// Log out route - handle the logout 

router.get("/logout" , (req  , res ,next) =>{
req.logOut((err)=>{
    if(err){
       return next(err);
    }
    req.flash("success" , "You are logged out!")
    res.redirect("/listing");
})
});


// router.get("/logout", (req, res, next) => {
//     if (req.isAuthenticated()) {
//         req.logOut((err) => {
//             if (err) {
//                 return next(err);
//             }
//             req.flash("success", "You are logged out!");
//             res.redirect("/listing");
//         });
//     } else {
//         req.flash("error", "You are already logged out!");
//         res.redirect("/listing");
//     }
// });





module.exports = router;

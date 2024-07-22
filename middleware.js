const Listing = require("./models/listing");
// const ExpressError = require("./utils/ExpressError.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isloggedin = (req, res, next) => {
    console.log(req.path, "..", req.originalUrl);
    if (!req.isAuthenticated()) {
        // Save redirect URL     
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create the listing");
        return res.redirect("/login"); // Added return
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // if (!listing) {
    //     req.flash("error", "Listing not found!");
    //     return res.redirect("/listing");
    // }
    // if (!res.locals.currUser) {
    //     req.flash("error", "You must be logged in to perform this action!");
    //     return res.redirect("/login");
    // }
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listing/${id}`);
    }
    next();
};


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
};

module.exports.validateListing = validateListing;


const validateReview = (req , res , next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",");
     throw new ExpressError(400 , errorMsg);
    }else{
        next();
    }
};

module.exports.validateReview = validateReview;
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this Review!");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
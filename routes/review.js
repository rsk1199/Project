const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js")
const Listing = require("../models/listing");
const {validateReview, isloggedin, isReviewAuthor} = require("../middleware.js");


// Reviews
// Post the review Route 
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

router.post("/", isloggedin,validateReview , wrapAsync (async (req, res) => {
    try {
        // Trim the ID to remove any leading/trailing spaces
        let id = req.params.id.trim();

        // Validate the ID format
        if (!isValidObjectId(id)) {
            return res.status(400).send("Invalid ObjectId format");
        }

        // Find the listing by the trimmed and validated ID
        let listing = await Listing.findById(id);
        
        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        // Create a new review from the request body
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log(newReview);
        // Push the new review to the listing's reviews array
        listing.reviews.push(newReview);

        // Save the new review and the updated listing
        await newReview.save();
        await listing.save();

        req.flash('success', 'New Review Created!');
        res.redirect(`/listing/${listing._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));


// Delete Review

router.delete("/:reviewId",isloggedin,isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Your Review Deleted!');
    res.redirect(`/listing/${id}`);
})
);


module.exports = router;
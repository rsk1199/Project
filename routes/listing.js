const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isloggedin , isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});




// Index Route
router.route("/").get(wrapAsync(listingController.index))
.post(isloggedin  ,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createNewListing));


// new route
router.get("/new", isloggedin, listingController.rednderNewForm);

// Show route
router.get("/:id", wrapAsync (listingController.showListing));

// Create Route (reating new listing)
router.post("/", isloggedin, validateListing, wrapAsync (listingController.createNewListing));

// Edit Route
router.get("/:id/edit", isloggedin,isOwner, wrapAsync (listingController.renderEditForm));

// update route
router.put("/:id", isloggedin,isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));

// Delete Route 
router.delete("/:id", isloggedin,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
};


module.exports.rednderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist!")
        res.redirect("/listing");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
};


module.exports.createNewListing = async (req, res, next) => {
    // let {title , description , location , country , image , price} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash('success', 'New Listing Created!');
    res.redirect("/listing");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist!")
        res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    updatedImageUrl =  originalImageUrl.replace("/upload" , "/upload/h_300,w_250");
    
    res.render("listings/edit.ejs", { listing , updatedImageUrl});
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // Assuming req.body.listing exists and it contains the updated data for the listing
    try {
        let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });
        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }
        req.flash('success', 'Listing Updated');
        res.redirect(`/listing/${id}`);
    } catch (error) {
        // Handle errors, possibly validation errors or issues with the database operation
        console.error("Error updating listing:", error);
        res.status(500).send("Failed to update listing");
    }
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success', 'Listing Deleted!');
    res.redirect("/listing");
};
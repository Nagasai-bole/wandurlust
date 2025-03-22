const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
  let { searchListings, category, price } = req.query;
  let query = {};
  if (searchListings) {
    query.country = { $regex: searchListings, $options: "i" };
  }

  if (category) {
    query.category = { $regex: category, $options: "i" };
  }
  if (price) {
    query.price = { $gt: 2000 }; // Filtering listings with price greater than 2000
  }

  let allListings = await Listing.find(query);

  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  let newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  await newlisting.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  let originalimageurl = listing.image.url;
  originalimageurl = originalimageurl.replace("/upload", "/uplaod/h_300,w_200");
  res.render("listings/edit.ejs", { listing, originalimageurl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", " Listing Updated");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletelisting = await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted");
  res.redirect("/listings");
};

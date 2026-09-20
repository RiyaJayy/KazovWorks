const Review = require("../models/Review");

const getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
};

const submitReview = async (req, res, next) => {
  try {
    const { name, rating, message } = req.body;
    const review = await Review.create({ name, rating, message, status: "pending" });
    res.status(201).json({ success: true, message: "Thanks — your review has been submitted for approval.", review });
  } catch (err) { next(err); }
};

const getAllReviewsAdmin = async (req, res, next) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
};

const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    res.json({ success: true, message: "Review updated.", review });
  } catch (err) { next(err); }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    res.json({ success: true, message: "Review deleted." });
  } catch (err) { next(err); }
};

module.exports = { getApprovedReviews, submitReview, getAllReviewsAdmin, updateReviewStatus, deleteReview };

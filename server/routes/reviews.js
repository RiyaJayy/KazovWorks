const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getApprovedReviews, submitReview, getAllReviewsAdmin, updateReviewStatus, deleteReview } = require("../controllers/reviewController");

router.get("/", getApprovedReviews);
router.post("/", submitReview);
router.get("/admin/all", protect, getAllReviewsAdmin);
router.patch("/:id/status", protect, updateReviewStatus);
router.delete("/:id", protect, deleteReview);

module.exports = router;

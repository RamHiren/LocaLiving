const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync =require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js')
const Review = require('../models/review.js');
const {validateReview, isLoggedIn,isReviewsAuthor} = require('../middleware/middleware.js')
const reviewController = require('../controllers/review.js')




// reviews create
router.post('/',validateReview,isLoggedIn, wrapAsync(reviewController.createReview));

// Review Delete
router.delete('/:reviewId',isLoggedIn,isReviewsAuthor,wrapAsync(reviewController.deleteReview))


module.exports = router;
const express = require('express')
const { createReview, getReviews, getReview, updateReview, deleteReview, parentRefrence } = require('../controllers/reviewController')
const { protect, restrictTo } = require('../controllers/auth/authController')

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(getReviews)
    .post(protect, restrictTo('user'), parentRefrence, createReview)

router.route('/:id')
    .get(getReview)
    .patch(protect, restrictTo('user'), updateReview)
    .delete(protect, restrictTo('user'), deleteReview);

module.exports = router
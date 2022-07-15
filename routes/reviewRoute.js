const express = require('express')
const { createReview, getReviews, getReview, updateReview, deleteReview} = require('../controllers/reviewController')
const { protect, restrictTo } = require('../controllers/auth/authController')

const router = express.Router()

router.route('/')
    .get(getReviews)
    .post(protect, restrictTo('user'), createReview)

router.route('/:id')
    .get(getReview)
    .patch(updateReview)
    .delete(deleteReview)


module.exports = router
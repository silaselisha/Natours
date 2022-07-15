const express = require('express')
const { createReview, getReviews, getReview, updateReview, deleteReview, parentRefrence } = require('../controllers/reviewController')
const { protect, restrictTo } = require('../controllers/auth/authController')

const router = express.Router({ mergeParams: true })

router.use(protect)

router.route('/')
    .get(getReviews)
    .post(restrictTo('user'), parentRefrence, createReview)

router.route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), updateReview)
    .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router
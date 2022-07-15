const express = require('express')

const { getTours, getTour, createTour, updateTour, deleteTour } = require('../controllers/tourController')
const { protect, restrictTo } = require('../controllers/auth/authController')
const { createReview } = require('../controllers/reviewController')
const router = express.Router()

router.route('/')
    .get(getTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour)

router
  .route('/:id')
  .get(
    protect,
    restrictTo('user', 'admin', 'lead-guide', 'tour-guide'),
    getTour
  )
  .put(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

router.route('/:tourId/reviews')
    .post(protect, restrictTo('user'), createReview)

module.exports = router
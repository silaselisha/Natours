const express = require('express')

const { getTours, getTour, createTour, updateTour, deleteTour, toursWithin, toursNearMe, tourUpload, resizeImages } = require('../controllers/tourController')
const { protect, restrictTo } = require('../controllers/auth/authController')
const reviewRouter = require('./reviewRoute')

const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)

router.route('/')
    .get(getTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour)

router.route('/tours-within/distance/:distance/center/:latlng/unit/:unit?')
    .get(toursWithin)

router.route('/tours-within/center/:latlng/unit/:unit?')
    .get(toursNearMe)

router.route('/:id')
    .get(getTour)
    .patch(protect, restrictTo('admin', 'lead-guide'), tourUpload, resizeImages,updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

module.exports = router
const express = require('express')

const { getTours, getTour, createTour, updateTour, deleteTour } = require('../controllers/tourController')
const { protect } = require('../controllers/auth/authController')
const router = express.Router()

router.route('/')
    .get(getTours)
    .post(protect, createTour)

router.route('/:id')
    .get(protect, getTour)
    .put(protect, updateTour)
    .delete(protect, deleteTour)

module.exports = router
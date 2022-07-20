const express = require('express')
const { protect } = require('../controllers/auth/authController')
const { bookingTour } = require('../controllers/bookingController')

const router = express.Router()

router.get('/checkout-session/:tourId', protect, bookingTour)
module.exports = router
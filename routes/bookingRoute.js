const express = require('express')
const { protect, restrictTo } = require('../controllers/auth/authController')
const { bookingTour, getBooking, getBookings, updateBooking, createBooking, deleteBooking } = require('../controllers/bookingController')

const router = express.Router()

router.get('/checkout-session/:tourId', protect, bookingTour)

router.use(protect, restrictTo('admin lead-guide'))

router.route('/')
        .get(getBookings)
        .post(createBooking)

router.route('/:id')
        .get(getBooking)
        .patch(updateBooking)
        .delete(deleteBooking)

module.exports = router
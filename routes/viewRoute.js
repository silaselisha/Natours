const express = require('express')
const { getOverview, getTour, getLoginForm, getMyAccount, updateMyAccount, getMyTourBookings } = require('../controllers/viewController')
const { isLoggedin, logoutUser, protect } = require('../controllers/auth/authController')
const { bookingCheckout } = require('../controllers/bookingController');

const router = express.Router()

router.get('/my-account', protect, getMyAccount)
router.post('/update-my-account', protect, updateMyAccount)
router.get('/my-bookings', protect, getMyTourBookings)

router.get('/', bookingCheckout, isLoggedin, getOverview)

router.get('/tour/:slug', isLoggedin, getTour)
router.get('/login', isLoggedin, getLoginForm)
router.get('/logout', isLoggedin, logoutUser)



module.exports = router
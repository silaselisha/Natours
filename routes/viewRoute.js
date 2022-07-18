const express = require('express')
const { getOverview, getTour, getLoginForm, getMyAccount } = require('../controllers/viewController')
const { isLoggedin, logoutUser, protect } = require('../controllers/auth/authController')

const router = express.Router()

router.get('/my-account', protect, getMyAccount)


router.get('/', isLoggedin, getOverview);
router.get('/tour/:slug', isLoggedin, getTour);
router.get('/login', isLoggedin, getLoginForm)
router.get('/logout', isLoggedin, logoutUser)


module.exports = router
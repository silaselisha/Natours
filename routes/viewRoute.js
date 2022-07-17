const express = require('express')
const { getOverview, getTour, getLoginForm } = require('../controllers/viewController')
const { isLoggedin, logoutUser } = require('../controllers/auth/authController')

const router = express.Router()

router.use(isLoggedin)

router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm)
router.get('/logout', logoutUser)


module.exports = router
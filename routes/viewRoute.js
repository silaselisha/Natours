const express = require('express')
const { getOverview, getTour, getLoginForm } = require('../controllers/viewController')
const { isLoggedin } = require('../controllers/auth/authController')

const router = express.Router()

router.use(isLoggedin)

router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm)


module.exports = router
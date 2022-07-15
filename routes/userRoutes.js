const express = require('express')

const { getUsers, getUser, deleteMe, updateMe, getMe, getLoggedInUserId } = require('../controllers/userController')

const { signUp, logIn, protect, resetPassword, forgotPassword, updatePassword, restrictTo } = require('../controllers/auth/authController')

const router = express.Router()

router.post('/sign-up', signUp)
router.post('/login', logIn)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)

router.use(protect)

router.patch('/update-password', updatePassword)
router.get('/me', getLoggedInUserId, getMe)

router.patch('/update-me', updateMe)
router.delete('/delete-me', deleteMe)

router.route('/')
    .get(restrictTo('admin'), getUsers)

router.route('/:id')
    .get(restrictTo('admin'), getUser)


module.exports = router
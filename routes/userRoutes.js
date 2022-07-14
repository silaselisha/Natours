const express = require('express')

const { getUsers, getUser, deleteMe, updateMe } = require('../controllers/userController')

const { signUp, logIn, protect, resetPassword, forgotPassword, updatePassword } = require('../controllers/auth/authController')

const router = express.Router()

router.post('/sign-up', signUp)
router.post('/login', logIn)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)
router.patch('/update-password', protect, updatePassword)

router.patch('/update-me', protect, updateMe)
router.delete('/delete-me', protect, deleteMe)

router.route('/')
    .get(getUsers)

router.route('/:id')
    .get(getUser)


module.exports = router
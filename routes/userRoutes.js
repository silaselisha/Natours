const express = require('express')

const { getUsers, getUser, createUser, updateUser, deleteUser, updateMe } = require('../controllers/userController')

const { signUp, logIn, protect, resetPassword, forgotPassword, updatePassword } = require('../controllers/auth/authController')

const router = express.Router()

router.post('/sign-up', signUp)
router.post('/login', logIn)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)
router.patch('/update-password', protect, updatePassword)

router.patch('/update-me', protect, updateMe)

router.route('/')
    .get(getUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router
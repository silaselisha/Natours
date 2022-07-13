const express = require('express')

const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController')

const { signUp, logIn } = require('../controllers/auth/authController')

const router = express.Router()

router.post('/sign-up', signUp)
router.post('/login', logIn)

router.route('/')
    .get(getUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router
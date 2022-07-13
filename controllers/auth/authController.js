const jwt = require('jsonwebtoken')

const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const User = require('../../models/userModel')


exports.signUp = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

    const token = jwt.sign({id: user._id}, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
})

exports.logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password) {
        return next(new AppError('Provide your email or password to login', 400))
    }

    const user = await User.findOne({email: email}).select('+password')

    if(!user || !(await user.comparePasswords(password, user.password))) {
        return next(new AppError('Provide valid email address or password', 404))
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.status(200).json({
        status: 'success',
        token
    })
})
 
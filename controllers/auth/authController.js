const { promisify } = require('util')
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

exports.protect = catchAsync(async (req, res, next) => {
  
    let token
    if(!req.headers.authorization) {
        return next(new AppError('Unauthorized to access this resource, please signup or login', 401))
    }

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token) {
        return next(
        new AppError(
            'Unauthorized to access this resource, please signup or login',
            401
        )
        );
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    
    const user = await User.findById(decodedToken.id).select('+password')

    if (!user) {
      return next(
        new AppError(`User with ${decodedToken.id} was not found`, 404)
      );
    }

    if (user.checkChangedPasswords(decodedToken.iat)) {
      return next(
        new AppError(`Users' password was recently changed`, 400)
      );
    }

    req.user = user
    next()
})

exports.restrictTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError(`The user is not authorized to access this resource.`, 401))
        }
        next()
    })
}
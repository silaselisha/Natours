const { promisify } = require('util')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const AppError = require('../../utils/appError')
const catchAsync = require('../../utils/catchAsync')
const sendEmail = require('../../utils/sendEmail')
const User = require('../../models/userModel')

const sendJwtTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({id: user._id}, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    process.env.NODE_ENV === 'production' ? cookieOptions.secure = true : cookieOptions.secure = false

    res.cookie('token', token, cookieOptions)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}


exports.signUp = catchAsync(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })

    user.password = undefined

    sendJwtTokenResponse(user, 201, res)
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

    sendJwtTokenResponse(user, 200, res);
})

exports.protect = catchAsync(async (req, res, next) => {
    
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }else if(req.cookies.token) {
        token = req.cookies.token

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

    res.locals.user = user
    req.user = user
    next()
})

exports.isLoggedin = async (req, res, next) => {

    if(req.cookies.token) {
        try {
            const decodedToken = await jwt.verify(req.cookies.token, process.env.JWT_PRIVATE_KEY)
            
            const user = await User.findById(decodedToken.id).select('+password')
            
            if (!user) {
                return next()
                 
            }
                
            if (user.checkChangedPasswords(decodedToken.iat)) {
                return next()
            }
        
            res.locals.user = user
            return next()
        } catch (error) {
            return next()
        }
    }
    next()
}

exports.restrictTo = (...roles) => {
    return catchAsync(async (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError(`The user is not authorized to access this resource.`, 403))
        }
        next()
    })
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body

    const user = await User.findOne({email: email})

    if(!user) {
        return next(new AppError(`The user associated to email ${email} does not exist`, 404))
    }

    const resetToken = user.generateResetToken()
    
    await user.save({
        validateBeforeSave: false,
    });


    const url = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`

    const message = `Forgot your password? If you had requesetd for a password reset, kindly use this link by submitting your new password  and confirming your new password to reset your password ${url}, the link will expire in 10 minutes. Ignore this email if you didn't request for a password request!`

    const options = {
        email: user.email,
        subject: 'Password reset',
        message
    }

    try{
        await sendEmail(options)

    } catch (err) {
        user.passwordResetToken = null
        user.passwordResetTokenExpires = null
        await user.save({
            saveBeforeValidate: false
        })

        return next(new AppError('An error occurred while sending the email!', 500))
    }

    res.status(200).json({
        status: 'success',
        message: 'email successfully sent...'
    })
})

exports.resetPassword = catchAsync(async (req, res, next) => {
   const { password, confirmPassword } = req.body

   const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
   const user = await User.findOne({passwordResetToken: hashedToken, passwordResetTokenExpires: {$gt: Date.now()}})
   
   if(!user) {
    return next(new AppError(`User was not found or invalid token`, 400))
   }

   user.password = password
   user.confirmPassword = confirmPassword
   user.passwordResetTokenExpires = undefined
   user.passwordResetToken = undefined

   user.save()

   sendJwtTokenResponse(user, 200, res);
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, password, confirmPassword } = req.body

    const user = await User.findById(req.user._id).select('+password')

    if(!(await user.comparePasswords(currentPassword, user.password))){
        return next(new AppError(`Password don't match`, 400))
    }

    user.password = password
    user.confirmPassword = confirmPassword

    user.save()

    sendJwtTokenResponse(user, 200, res);
})

exports.logoutUser = (req, res, next) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000)
    })
    
    res.status(200).json({
        status: 'success'
    })
}
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')

const filteredData = (body, ...fields) => {
    const data = {}

    Object.keys(body).forEach((item) => {
        if(fields.includes(item)) {
            data[item] = body[item]
        }
    })

    return data
};

exports.updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.confirmPassword) {
        return next(new AppError(`Users cannot use the following route ${req.protocol}://${req.get('host')}${req.originalUrl} to update their password`, 400))
    }

    const data = filteredData(req.body, 'name', 'email')
 
    const user = await User.findByIdAndUpdate(req.user._id, data, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user) {
        return next(new AppError(`User not found`, 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})


exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {active: false}, {
        new: true,
        runValidators: true
    })
    
    res.status(204).json({
        status: 'success',
        data: null
    })
})

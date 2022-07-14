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

exports.getUsers = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'server error'
    })
}

exports.getUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'server error'
    })
}

exports.createUser = (req, res) => {
  
    res.status(500).json({
        status: 'error',
        message: 'server error'
    })
}

exports.updateUser = (req, res) => {

    res.status(500).json({
        status: 'error',
        message: 'server error'
    })
}

exports.deleteUser = (req, res) => {
    
    res.status(500).json({
        status: 'error',
        message: 'server error'
    })
}

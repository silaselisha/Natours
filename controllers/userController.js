const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { getOne, getAll } = require('../controllers/factoryHandler')
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

exports.getLoggedInUserId = (req, res, next) => {
    req.params.id = req.user._id
    next()
}

exports.getMe = getOne(User)
exports.getUsers = getAll(User)
exports.getUser = getOne(User)


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

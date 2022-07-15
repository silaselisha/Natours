const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const id = req.params.id
    const doc = await Model.findByIdAndDelete(id)

    if(!doc) {
        return next(new AppError('Document was not found in this resource', 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const id = req.params.id
    const payload = req.body
    const doc = await Model.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    })

    if(!doc) {
        return next(new AppError('Document was not found in this resource', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const payload = req.body
    const doc = await Model.create(payload)

    if(!doc) {
        return next(new AppError('Document was not created', 400))
    }

    res.status(201).json({
        status: 'success',
        data:{
            data: doc
        }
    })
})

exports.getOne = (Model, options) => catchAsync(async (req, res, next) => {
    const id = req.params.id
    let query = Model.findById(id)
 
    if(options) query = query.populate(options)

    const doc = await query

    if(!doc) {
        return next(new AppError('Document was not found in this resource', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})

exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const features = new APIFeatures(Model.find(filter), req.query)
                            .filter()
                            .fieldsSelect()
                            .sorting()
                            .pagination()
    
    const doc = await features.query
                            

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        }
    })
})
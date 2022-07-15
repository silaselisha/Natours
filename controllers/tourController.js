const colors = require('colors')
const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getTours = catchAsync(async (req, res, next) => {

    const features = new APIFeatures(Tour.find(), req.query)
                            .filter()
                            .fieldsSelect()
                            .sorting()
                            .pagination()

    const tours = await features.query

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })    
})

exports.getTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findById(req.params.id).populate('reviews')

    if(!tour) {
        return next(new AppError('Tour with that id was not found', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })   
})

exports.createTour = catchAsync(async (req, res, next) => {

    const tourData = req.body
    const tour = await Tour.create(tourData)

    if (!tour) {
        return next(new AppError('Tour was not created', 400));
    }

    res.status(201).json({
        status: 'success',
        data: {
            tour
        }
    })  
})

exports.updateTour = catchAsync(async (req, res, next) => {
   
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!tour) {
        return next(new AppError('Tour with that id was not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })   
})

exports.deleteTour = catchAsync(async (req, res, next) => {
 
    const tour = await Tour.findByIdAndDelete(req.params.id)

    if (!tour) {
        return next(new AppError('Tour with that id was not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    })   
})

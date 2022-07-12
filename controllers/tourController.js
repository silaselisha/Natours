const colors = require('colors')
const Tour = require('../models/tourMode')

exports.getTours = async (req, res) => {
    try {
        // ** Filter
        const queryObject = { ... req.query }
        const reservedFields = ['page', 'limit', 'fields', 'sort']

        Object.keys(queryObject).forEach(item => {
            if(reservedFields.includes(item)){
                delete queryObject[item]
            }
        })

        let queryString = JSON.stringify(queryObject)
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        let query = Tour.find(JSON.parse(queryString))

        if(req.query.fields) {

           let fieldsString = req.query.fields
           fieldsString = fieldsString.split(',').join(' ')

           query = query.select(fieldsString)
        }else {
            query = query.select('-__v')
        }

        if(req.query.sort) {

            let sortString = req.query.sort
            sortString = sortString.split(',').join(' ')

            query = query.sort(sortString)
        }

        const page = +req.query.page || 1
        const limit = +req.query.limit || 3

        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)

        const tours = await query

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })    
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })   
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        const tourData = req.body
        const tour = await Tour.create(tourData)

        res.status(201).json({
            status: 'success',
            data: {
                tour
            }
        })  
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })   
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null
        })   
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

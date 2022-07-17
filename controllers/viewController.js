const Tour = require('../models/tourModel')
const User = require('../models/userModel')

const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find()

  res.status(200).render('overview', {
    title: 'All tours',
    tours
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
    const slug = req.params.slug
    const tour = await Tour.findOne({slug: slug}).populate({
      path: 'reviews',
      fields: 'review rating user'
    })

    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour
    })
})

exports.getLoginForm = catchAsync(async (req, res, next) => {

    res.status(200).render('login', {
      title: 'Log into your account'
    })
})
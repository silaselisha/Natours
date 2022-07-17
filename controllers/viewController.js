const Tour = require('../models/tourModel')
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
      path: 'reviews'
    })

    res.status(200).render('tour', {
      title: 'tour',
      tour 
    })
})
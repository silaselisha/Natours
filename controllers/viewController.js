const AppError = require('../utils/appError')
const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const Booking = require('../models/bookingModel')

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

    if(!tour) {
      return next(new AppError('The page was not found!', 404))
    }

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

exports.getMyAccount = catchAsync(async (req, res, next) => {
  
  res.status(200).render('account', {
    title: 'Your account'
  })
})

exports.updateMyAccount = catchAsync(async (req, res) => {

  const user = await User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    email: req.body.email
  }, {
    new: true,
    runValidators: true
  })

  res.status(200).render('account', {
    title: 'Your account',
    user: user
  })
})

exports.getMyTourBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({user: req.user.id})
  
  console.log(bookings)
  const toursId = bookings.map(booking => booking.tour)
  const tours = await Tour.find({_id: {$in: toursId}})

  res.status(200).render('overview', {
    title: 'My bookings',
    tours: tours
  })
})
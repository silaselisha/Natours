const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { getOne, getAll, updateOne, deleteOne, createOne } = require('./factoryHandler')
const Tour = require('../models/tourModel')
const Booking = require('../models/bookingModel')
const { create } = require('../models/tourModel')


exports.bookingTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId)
  

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/?tour=${tour._id}&user=${req.user._id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      line_items: [
        {
          name: `${tour.name} Tour`,
          description: tour.summary,
          images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          amount: tour.price * 100,
          currency: 'usd',
          quantity: 1,
        },
      ],
      mode: 'payment',
    });

    res.status(200).json({
        status: 'success',
        session
    })
})


exports.bookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query

  if(!tour && !user && !price) {
    return next()
  }

  await Booking.create({
    tour,
    user, 
    price
  })

  res.redirect(req.originalUrl.split('?')[0])
})


exports.deleteBooking = deleteOne(Booking)
exports.getBooking = getOne(Booking)
exports.getBookings = getAll(Booking)
exports.createBooking = createOne(Booking)
exports.updateBooking = updateOne(Booking)
const Tour = require('../models/tourModel')
const { createOne, updateOne, deleteOne, getOne, getAll } = require('../controllers/factoryHandler')

exports.getTours = getAll(Tour)
exports.getTour = getOne(Tour, 'reviews')
exports.createTour = createOne(Tour)
exports.updateTour = updateOne(Tour)
exports.deleteTour = deleteOne(Tour)

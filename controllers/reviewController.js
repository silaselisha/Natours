const { deleteOne, updateOne, createOne, getOne, getAll } = require('../controllers/factoryHandler')
const Review = require('../models/reviewModel')

exports.parentRefrence = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user._id;

    next()
}

exports.createReview = createOne(Review)
exports.getReviews = getAll(Review)
exports.getReview = getOne(Review)
exports.updateReview = updateOne(Review)
exports.deleteReview = deleteOne(Review)
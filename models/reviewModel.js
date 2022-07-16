const mongoose = require('mongoose')
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Provide a review test for tour review']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user should be provided']
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'tour should be provided']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

reviewSchema.index({tour: 1, user: 1}, {unique: true})

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: '-__v'
    })

    next()
})

reviewSchema.statics.calculateReviews = async function(toursId) {
    const reviewStats = await this.aggregate([
        {
            $match: {
                tour: toursId
            }
        },
        {
            $group: {
                _id: '$tour',
                nRatings: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ])

    await Tour.findByIdAndUpdate(toursId, {ratingsAverage: reviewStats[0].avgRating, ratingsQuantity: reviewStats[0].nRatings}, {
        new: true,
        runValidators: true
    })
}

reviewSchema.post('save', function() {
    this.constructor.calculateReviews(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.rev = await this.findOne()
    next()
})

reviewSchema.post(/^findOneAnd/, function() {
    this.rev.constructor.calculateReviews(this.rev.tour)
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review
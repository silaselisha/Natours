const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour should have a name'],
        trim: true,
        unique: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour should have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour should hav a max number of tourist it can accomodate']
    },
    difficulty: {
        type: String, 
        enum: {
            values: ['medium', 'easy', 'difficult'],
            message: 'Tours difficulty level should either be medium, difficult or easy'
        },
        required: [true, 'A tour should have a level of difficulty']
    },
    price: {
        type: Number,
        required: [true, 'A tour should have a price']
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour should have a summary']
    },
    description: {
        type: String,
        required: [true, 'A tour should have a description']
    },
    imageCover: {
        type: String,
        required: [true, 'A tour should have an image']
    },
    ratingsAverage: {
        type: Number,
        min: 1,
        max: 5,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    startLocation: {
        type: {
            type: String,
            default:'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    images: [String],
    startDates: [Date],
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

tourSchema.virtual('reviews', {
   ref: 'Review',
   localField: '_id',
   foreignField: 'tour'
})

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })

    next()
})

const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour
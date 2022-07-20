const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'A booking shouldbelong toa tour']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A booking should be made by a user']
    },
    price: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

bookingSchema.pre(/^find/, function(next) {
    this.populate(user).populate({
        path: 'tour',
        fields: 'name'
    })
    
    next()
})

const Booking = mongoose.model('Booking', bookingSchema)
module.exports = Booking
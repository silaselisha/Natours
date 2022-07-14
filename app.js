const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/error/errorHandler')

const app = express()

app.use(helmet())
app.use(express.json({limit: '10kb'}))
app.use(mongoSanitize())
app.use(xss())
app.use(express.static(`${__dirname}/public`))
app.use(cors())
app.use(hpp({
    whitelist: ['price', 'duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty']
}))

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const limiter = rateLimit({
    max: 120,
    windowMs: 60 * 60 * 1000,
    message: 'Exceeded the amount of request, kindly wait for an hour'
})

app.use('/api', limiter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    return next(new AppError('Routes not implemented in the server', 404))
})

app.use(globalErrorHandler)

module.exports = app
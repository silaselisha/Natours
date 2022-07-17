const path = require('path')
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
const reviewRouter = require('./routes/reviewRoute')
const viewRouter = require('./routes/viewRoute')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/error/errorHandler')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors());
app.use(express.json({limit: '10kb'}))
app.use(mongoSanitize())
app.use(xss())
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

app.use('/', viewRouter)
app.use('/api', limiter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req, res, next) => {
    return next(new AppError('Routes not implemented in the server', 404))
})

app.use(globalErrorHandler)

module.exports = app
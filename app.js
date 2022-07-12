const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/error/errorHandler')

const app = express()

app.use(express.json())
app.use(express.static(`${__dirname}/public`))
app.use(cors())

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
    return next(new AppError('Routes not implemented in the server', 404))
})

app.use(globalErrorHandler)

module.exports = app
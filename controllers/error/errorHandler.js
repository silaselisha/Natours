const colors = require('colors')
const AppError = require('../../utils/appError')

const handleCastError = (err) => {
  const message = `Resource ${err.path} ${err.value} was not found`
  return new AppError(message, 404)
}

const handleDuplicate = (err) => {
  const values = Object.values(err.keyValue).toString()
  const message = `Resource value '${values}' already exists`
  return new AppError(message, 400)
}

const handleValidationError = (err) => {
  const error = Object.values(err.errors).map(item => {
    return item.message
  })

  const message = error.toString()

  return new AppError(message, 400)
}

const sendErrorToDeveloper = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  })
}

const sendErrorToClient = (err, res) => {
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }else {
    console.log(colors.red.inverse(err.message))
    res.status(500).json({
      status: 'error',
      message: 'something went so wrong!'
    })
  }
}

const globalErrorHandler = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development') {
        sendErrorToDeveloper(err, res)
    }else if(process.env.NODE_ENV === 'production') {
    
        if (err.name === 'CastError') 
          err = handleCastError(err)

        if (err.code === 11000) 
          err = handleDuplicate(err)

        if (err.name === 'ValidationError') 
          err = handleValidationError(err)

        sendErrorToClient(err, res);
    }
}


module.exports = globalErrorHandler
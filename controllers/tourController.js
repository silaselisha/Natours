const multer = require('multer')
const sharp = require('sharp')
const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const { createOne, updateOne, deleteOne, getOne, getAll } = require('../controllers/factoryHandler')

const memory = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true)
  }else {
    cb(new AppError('Please upload only images!', 400), false)
  }
}

const upload = multer({memory: memory, fileFilter: fileFilter})
exports.tourUpload = upload.fields([
  {name: 'imageCover', maxCount: 1},
  {name: 'images', maxCount: 3}
])

exports.resizeImages = catchAsync(async (req, res, next) => {
  console.log(req.files)
  if(!req.files.imageCover || !req.files.images)
    return next()

  const fileName = `tour-${req.user._id}-${Date.now()}-cover.jpg`

  await sharp(req.files.imageCover[0].buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({quality: 90})
          .toFile(`public/img/tours/${fileName}`)
  
          req.body.imageCover = fileName

  // process images 2

  req.body.images = []
  await Promise.all( req.files.images.map(async (image, i) => {
      const fileName = `tour-${req.user._id}-${Date.now()}-${i + 1}.jpg`

      await sharp(image.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/img/tours/${fileName}`)
      
      req.body.images.push(fileName)
      console.log(req.body.images)
  }))

  next()
})

exports.toursWithin = catchAsync(async (req, res, next) => {
    const {distance, latlng, unit} = req.params
    const [latitude, longitude] = latlng.split(',')

    const radius = unit === 'mi' ? distance / 3960.2 : distance / 6372.1
   
    if(!longitude || !latitude) {
        return next(new AppError('Please provide the longitude and latitude', 400))
    }

    const tours = await Tour.find({ startLocation: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}}})
    
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    })
})

exports.toursNearMe = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params
    const [latitude, longitude] = latlng.split(',')

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001

    if(!latitude || !longitude) {
        return next(new AppError('Please provide coordinates for longitude and latitude'))
    }

    const tours = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude * 1, latitude * 1],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: tours
        }
    })
})

exports.getTours = getAll(Tour)
exports.getTour = getOne(Tour, 'reviews')
exports.createTour = createOne(Tour)
exports.updateTour = updateOne(Tour)
exports.deleteTour = deleteOne(Tour)

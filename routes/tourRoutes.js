const express = require('express')

const { getTours, getTour, createTour, updateTour, deleteTour, checkId } = require('../controllers/tourController')

const router = express.Router()
router.param('id', checkId)

router.route('/')
    .get(getTours)
    .post(createTour)

router.route('/:id')
    .get(getTour)
    .put(updateTour)
    .delete(deleteTour)

module.exports = router
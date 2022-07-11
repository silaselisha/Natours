const fs = require('fs')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../_data/data/tours-simple.json`, 'utf-8'))

exports.checkId = (req, res, next, val) => {
    const id = +req.params.id
    
    if(id > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Tour not found'
        })
    }
    next()
}

exports.getTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
}

exports.getTour = (req, res) => {
    const tour = tours.find(el => el.id === +req.params.id)

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
}

exports.createTour = (req, res) => {
    const data = req.body
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({id: newId}, data)

    tours.push(newTour)

    fs.writeFile(`${__dirname}/../_data/data/tours-simple.json`, JSON.stringify(tours), 'utf-8', (err) => {
        if(err) 
        console.log(err.message)
    })

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
}

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Updated Tour'
        }
    })
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
}

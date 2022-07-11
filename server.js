const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')

const PORT = process.env.PORT || 3000
const localhsot = '127.0.0.1'

const dataBase = process.env.DATABASE_URI.replace('<password>', process.env.DATABASE_PASSCODE)

mongoose.connect(dataBase, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useFindAndModify: false
}).then(() => {
    console.log('Successfully connected to database')
}).catch(err => {
    console.log(err.message)
})

app.listen(PORT, () => {
    console.log(`Listening http://${localhsot}:${PORT}`)
})
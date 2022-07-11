const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')

const PORT = process.env.PORT || 3000
const localhsot = '127.0.0.1'

app.listen(PORT, () => {
    console.log(`Listening http://${localhsot}:${PORT}`)
})
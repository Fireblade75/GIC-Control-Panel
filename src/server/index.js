const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))
app.use('games', express.static('games'))



app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`))

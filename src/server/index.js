const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const serversRoute = require('./routes/serversRoute')
const teamsRoute = require('./routes/teamsRoute')
const gamesRoute = require('./routes/gamesRoute')

const app = express()
app.use(bodyParser.json())
app.use(morgan('tiny'))

app.use('servers', serversRoute)
app.use('teams', teamsRoute)
app.use('games', gamesRoute)


app.use('files', express.static('games'))
app.use(express.static('dist'))

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`))

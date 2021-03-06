const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const serversRoute = require('./routes/serversRoute')
const teamsRoute = require('./routes/teamsRoute')
const gamesRoute = require('./routes/gamesRoute')
const usersRoute = require('./routes/usersRoute')

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useFindAndModify: false});

const gamesPath = path.join(__dirname, '../../games')
const tempPath = path.join(__dirname, '../../tmp')
if (!fs.existsSync(gamesPath)) {
    fs.mkdirSync(gamesPath)
}
if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath)
}

const app = express()
app.use(bodyParser.json())
app.use(morgan('tiny'))

app.use((req, res, next) => {
    if(req.headers.authorization) {
        const token = req.headers.authorization
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({"error": "invalid_token"})
            } else {
                req.username = jwt.decode(token).username
                next()
            }
        })
    } else {
        next()
    }
})


app.use('/api/servers', serversRoute)
app.use('/api/teams', teamsRoute)
app.use('/api/games', gamesRoute)
app.use('/api/users', usersRoute)


app.use('/api/files', express.static(path.join(__dirname, '../../games')))
app.use(express.static(path.join(__dirname, '../../dist')))

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`))

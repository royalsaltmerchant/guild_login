
const dotenv = require('dotenv')
dotenv.config()
const path = require('path');
const express = require('express')
const cors = require("cors")
const users = require('./src/api/routes/users')
const projects = require('./src/api/routes/projects')
const packs = require('./src/api/routes/packs')
const entries = require('./src/api/routes/entries')
const contributions = require('./src/api/routes/contributions')
const tracks = require('./src/api/routes/tracks')
const s3 = require('./src/api/routes/s3')

var app = express()

//Set CORS
app.use(cors())

//Set JSON parser
app.use(express.json())

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../build')));

// Routes
app.use('/api', users)
app.use('/api', projects)
app.use('/api', packs)
app.use('/api', entries)
app.use('/api', contributions)
app.use('/api', tracks)
app.use('/api', s3)

//Error
app.use((error, req, res, next) => {
  console.error(error)
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message || "Internal Server Error"
    }
  })
})


// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});


//Run
var PORT = 4000
app.listen({port: PORT}, async () => {
  console.log(`Server Running at http://localhost:${PORT}`)
})
import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import express, { Request, Response, NextFunction } from 'express'
import cors from "cors"
import users from './src/api/routes/users'
import projects from './src/api/routes/projects'
import packs from './src/api/routes/packs'
import entries from './src/api/routes/entries'
import contributions from './src/api/routes/contributions'
import tracks from './src/api/routes/tracks'
import s3 from './src/api/routes/s3'

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
app.use((error: {status: number, message: string}, req:Request, res:Response, next:NextFunction) => {
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
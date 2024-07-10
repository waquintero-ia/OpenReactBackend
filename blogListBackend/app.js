const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

const connectDB = async () => {
  try{
    await mongoose.connect(config.MONGODB_URI)
    logger.info('connected to MongoDB')
  }catch(error){
    logger.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

connectDB()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

if(process.env.NODE_ENV !== 'test' ){
  app.use(middleware.morgan(':method :url :status :res[content-length] :response-time ms :body'))
}

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
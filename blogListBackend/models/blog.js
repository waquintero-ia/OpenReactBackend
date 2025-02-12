const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    author: String,
    url: {
      type: String,
      required: true,
      validate:{
        validator: function(v){
          return /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(v)
        },
        message: 'Enter a correct url'
      }
    },
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
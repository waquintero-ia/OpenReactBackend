const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)
  
  if(blog){
    response.status(204).end()
  }else{
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) =>{
  
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, 
    { likes }, 
    { new: true })

    if(updatedBlog === null){
      response.status(404).end()
    }else(
      response.status(200).json(updatedBlog)
    )

})

module.exports = blogsRouter
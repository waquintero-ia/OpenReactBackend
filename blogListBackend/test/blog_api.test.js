const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

describe ('when there is initially some notes saved', () =>{
  beforeEach(async () => {
  
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  
  test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')
  
     assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
  
  test('unique identifier of blog posts is called id', async () => {
    const response = await api.get('/api/blogs')
  
    result = helper.verifyIDs(response.body)
    assert.strictEqual(result, helper.initialBlogs.length)
  })
  
  describe('testing post', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: "Bussiness catalyst & life alchemist",
        author: "Laura Ribas",
        url: "https://lauraribas.com",
        likes: 0
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    
        const contents = blogsAtEnd.map(n => n.title)
        assert(contents.includes('Bussiness catalyst & life alchemist'))
    })
    
    test('creating blogs without likes', async () => {
      const newBlog = {
        title: "Bussiness catalyst & life alchemist",
        author: "Laura Ribas",
        url: "https://lauraribas.com"
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    
        assert.strictEqual(helper.likesInDb(blogsAtEnd, 'Bussiness catalyst & life alchemist' ), 0)
    })
    
    test('creating blogs without title or url', async () =>{
      const newBlog = {
        title: "",
        author: "Laura Ribas",
        url: ""
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })
  
  describe('testing delete', () => {
    test('deleting blogs correct', async () => {
      const blogToId = await helper.blogsInDb()
      const id = helper.idToDelete(blogToId)
      
      await api
        .delete(`/api/blogs/${id}`)
        .expect(204)
    })
    
    test('deleting blogs that are not in the database', async () => {
      const blogToId = await helper.blogsInDb()
      const id = helper.idToDelete(blogToId)
      
      await api
        .delete('/api/blogs/668dcb6d32abebb4b83bb515')
        .expect(404)
    })
    
    test('deleting blogs with id incorrect', async () => {
      const blogToId = await helper.blogsInDb()
      const id = helper.idToDelete(blogToId)
      
      await api
        .delete('/api/blogs/668dcb6d32abebb4b')
        .expect(400)
    })
  })

  describe('testin put', () => {
    test('updating likes', async () =>{
      const blogToId = await helper.blogsInDb()
      const id = helper.idToDelete(blogToId)

      const newLike = {
        likes: 999
      }

      await api
        .put(`/api/blogs/${id}`)
        .send(newLike)
        .expect(200)
      

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(helper.likesInDb(blogsAtEnd, 'React patterns' ), 999)
      
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})
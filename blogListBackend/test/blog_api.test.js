const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const { request } = require('node:http')
const { title } = require('node:process')
const { url } = require('node:inspector')

beforeEach(async () => {

  const statusApp = (await api.get('/api/blogs')).status
  
  console.log(statusApp) 

  await Blog.deleteMany({})
  console.log('delete blogs')  

  const noteObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = noteObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  console.log('created blogs')
})

test('all notes are returned', async () => {
  console.log('entra a la prueba')
  const response = await api.get('/api/blogs')

   assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier of blog posts is called id', async () => {
  console.log('entra a la prueba')
  const response = await api.get('/api/blogs')

  result = helper.verifyIDs(response.body)
  assert.strictEqual(result, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})

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
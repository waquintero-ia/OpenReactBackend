const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {

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
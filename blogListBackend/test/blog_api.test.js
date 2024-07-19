const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
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

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username length is min to 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('User validation failed: username: Path `username` (`ro`) is shorter than the minimum allowed length (3).'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is null', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('User validation failed: username: Path `username` is required.'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is null', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'robot',
      name: 'Superuser'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('Path `password` is required.'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password length is min to 3', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'robot',
      name: 'Superuser',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('password is shorter than the minimum allowed lenght (3)'))
  
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })
  
})
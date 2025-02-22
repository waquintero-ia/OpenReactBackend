const Blog = require('../models/blog')
const _ = require('lodash')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }     
]

const initialUsers = [
  {
    username: 'root',
    name: 'root',
    password: '12345'
  },
  {
    username: 'mike',
    name: 'mike',
    password: '12345777'
  }
]

const verifyIDs = (blogs) => {
  const IdBlogs = _.map(blogs, 'id')
  return IdBlogs.length
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const likesInDb = (blogs, name) => {
  const blogLike = _.find(blogs, { 'title': name })
  return blogLike.likes
}

const idToDelete = (blogs) => {
  return blogs[0].id
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  verifyIDs,
  blogsInDb,
  likesInDb,
  idToDelete,
  initialUsers,
  usersInDb
}
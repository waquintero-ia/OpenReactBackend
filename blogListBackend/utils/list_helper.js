const _ = require('lodash')

const dummy = (blogs) => {
   return blogs.length + 1
}

const totalLikes = (blogs) => {
   const blogsLength = blogs.length
   const sumLikes = blogs.map(blog => blog.likes)

   if(blogsLength === 0 ){
    return 0
   }

   const total = sumLikes.reduce((s,p) => {
    return s + p
   })

   return total
}

const favoriteBlog = (blogs) => {
    const maxLikes = blogs.map(blog => blog.likes)

    const max = maxLikes.reduce((s,p) => {
        return s > p ? s : p
    })
    
    return blogs.filter(blog => blog.likes === max)
}

const mostBlogs = (blogs) => {
  
  const blogsPorAutor = _.groupBy(blogs, 'author')

  const autorConMasBlogs = _.maxBy(_.keys(blogsPorAutor), autor => _.size(blogsPorAutor[autor]))

  const resultado = { author: autorConMasBlogs, blogs: _.size(blogsPorAutor[autorConMasBlogs]) }

  return resultado
}

const mostLikes = (blogs) => {

  const authorLikes = _.mapValues(_.groupBy(blogs, 'author'), blogs => _.sumBy(blogs, 'likes'))

  const authorWithMostLikes = _.maxBy(_.keys(authorLikes), author => authorLikes[author])

  result = {
    author: authorWithMostLikes,
    likes: authorLikes[authorWithMostLikes]
  }

  return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
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

module.exports = {
    dummy,
    totalLikes
}
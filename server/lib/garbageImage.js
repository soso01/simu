const {Image} = require('../db/model')
const path = require('path')
const fs = require('fs')

module.exports = () => {
  setInterval(async () => {
    const images = await Image.find()
    images.forEach(v => {
      if(Date.now() - v.created > 24 * 60 * 60 * 1000){
        fs.unlink(path.normalize(__dirname + "/../image/" + v.name), (err) => {
          if(err) console.error(err)
          else console.log(v.name + " deleted")
        })
        v.remove()
      }
    })
  }, 24 * 60 * 60 * 1000)
}
const { Image } = require("../db/model")
const path = require("path")
const fs = require("fs")

module.exports = () => {
  setInterval(async () => {
    const images = await Image.find({
      gameId: null,
      updated: { $lte : Date.now() - 1000 * 60 * 60 * 24}
    })
    images.forEach((v) => {
      console.log(v.updated)
      console.log((Date.now() - v.updated) / 1000)
      fs.unlinkSync(path.normalize(__dirname + "/../image/" + v.path + v.name))
      console.log("delete - ", v.name)
      v.remove()
    })
  }, 1000 * 60 * 60 * 24)
}

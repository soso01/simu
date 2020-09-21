const express = require("express")
const multer = require("multer")
const path = require("path")
const webp = require("webp-converter")
const fs = require("fs")

const router = express()
const upload = require("../lib/upload")
const { Image } = require("../db/model")

router.post("/upload", upload, async (req, res) => {
  const webpName =
    path.basename(req.file.filename, path.extname(req.file.filename)) + ".webp"
  if (req.file.mimetype === "image/gif") {
    await webp.gwebp(req.file.path, req.file.destination + webpName, "-lossy")
  } else {
    await webp.cwebp(req.file.path, req.file.destination + webpName)
  }
  fs.unlinkSync(req.file.path)
  Image.create({ name: webpName, path: req.imagePathDate })
  return res.send(webpName)
})

router.get("/:filename", async (req, res) => {
  const result = await Image.findOne({ name: req.params.filename })
  res.sendFile(
    path.normalize(__dirname + "/../image/" + result.path + req.params.filename)
  )
})

module.exports = router

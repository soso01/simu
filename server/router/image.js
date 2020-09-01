const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express()
const upload = require('../lib/upload')

router.post("/upload", (req, res) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      res.send("fail")
    } else if (err) {
      res.send("fail")
    }
    return res.send(req.file.filename);
  });
})

router.get("/:filename", (req, res) => {
  res.sendFile(path.normalize(__dirname + "/../image/" + req.params.filename))
})

module.exports = router
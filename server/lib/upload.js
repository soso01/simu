const multer = require("multer")
const moment = require("moment")
const path = require('path');
const fs = require('fs')

const getImagePath = (req) => {
  const now = new Date()
  let filePath = path.normalize(__dirname + '/../image/') + now.getFullYear() + "/"
  if(!fs.existsSync(filePath)) fs.mkdirSync(filePath)
  filePath = filePath + (Number(now.getMonth()) + 1) + "/"
  if(!fs.existsSync(filePath)) fs.mkdirSync(filePath)
  req.imagePathDate = now.getFullYear() + "/" + (Number(now.getMonth()) + 1) + "/"
  return filePath
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getImagePath(req))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, path.basename(file.originalname, ext) + "-" + moment().format("YYYYMMDDHHmmss") + ext)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
}).single("file")

module.exports = upload

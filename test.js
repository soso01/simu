const multer = require("multer")
const moment = require("moment")
const path = require('path');
const fs = require('fs')

const getImagePath = () => {
  const now = new Date()
  let filePath = path.normalize(__dirname + '/server/image/') + now.getFullYear() + "/" + now.getMonth()
  if(!fs.existsSync(filePath)) fs.mkdirSync(filePath)
}

getImagePath()
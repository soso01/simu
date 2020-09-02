var mongoose = require("mongoose")
var Schema = mongoose.Schema

var imageSchema = new Schema({
  name : {type: String, require: true},
  created : {type: Date, default: Date.now}
})

module.exports = mongoose.model("Image", imageSchema)

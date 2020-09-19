var mongoose = require("mongoose")
var Schema = mongoose.Schema

var imageSchema = new Schema({
  name : {type: String, require: true, unique: true},
  created : {type: Date, default: Date.now},
  path : {type: String},
  gameId : {type: Schema.Types.ObjectId}
})

module.exports = mongoose.model("Image", imageSchema)

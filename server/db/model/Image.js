var mongoose = require("mongoose")
var Schema = mongoose.Schema

var imageSchema = new Schema({
  name : {type: String, require: true, unique: true},
  updated : {type: Date, default: Date.now},
  path : {type: String},
  gameId : {type: Schema.Types.ObjectId, default: null}
})

module.exports = mongoose.model("Image", imageSchema)

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var gameSchema = new Schema({
  userId: { type: String, required: true },
  nickName: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  thumbnail: {type : String, default: 0},
  count: {type : Number, default: 0},
  created: {type: Date, default: Date.now},
  pages: [{ img: String, script: [{
    text: String,
    action: {actType: {type : String}, num: {type: Number, defaultValue: 0}},
    select: [
      {
        text: String,
        action: {actType: {type : String}, num: {type: Number, defaultValue: 0}},
      }
    ]
  }]}],
})

module.exports = mongoose.model("Game", gameSchema)

var mongoose = require("mongoose")
var Schema = mongoose.Schema

var gameSchema = new Schema({
  userId: { type: String, required: true },
  nickName: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  pages: [{ img: String, script: [{
    text: String,
    action: {type: String, num: {type: Number, defaultValue: 0}},
    select: [
      {
        text: String,
        action: {type: String, num: {type: Number, defaultValue: 0}},
      }
    ]
  }]}],
})

module.exports = mongoose.model("Game", gameSchema)

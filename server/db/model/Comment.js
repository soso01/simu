var mongoose = require("mongoose")
var Schema = mongoose.Schema

var commentSchema = new Schema({
  gameSeq: {type: Number, required: true},
  userId: { type: String, required: true },
  userNickname: { type: String, required: true},
  text: { type: String },
  created: { type: Date, default: Date.now },
  accuseCount: {type: Number, default: 0},
  recommendCount: {type: Number, default: 0},
  accuser: [String],
  recommender: [String],
})

module.exports = mongoose.model("Comment", commentSchema)

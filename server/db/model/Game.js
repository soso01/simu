var mongoose = require("mongoose")
const autoIncrement = require("mongoose-auto-increment")
const { stringify } = require("uuid")
var Schema = mongoose.Schema

autoIncrement.initialize(mongoose.connection)

var gameSchema = new Schema({
  seq: { type: Number },
  userId: { type: String, required: true },
  nickName: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  thumbnailNum: { type: Number, default: 0},
  thumbnail: { type: String, default: 0 },
  count: { type: Number, default: 0 },
  created: { type: Date, default: Date.now },
  accuseCount: {type: Number, default: 0},
  accuser: [String],
  recommendCount: {type: Number, default: 0},
  recommender: [String],
  isPrivate: {type: Boolean, default: false},
  pages: [
    {
      img: String,
      script: [
        {
          text: String,
          action: {
            actType: { type: String },
            num: { type: Number, defaultValue: null },
          },
          select: [
            {
              text: String,
              action: {
                actType: { type: String },
                num: { type: Number, defaultValue: null },
              },
            },
          ],
        },
      ],
    },
  ],
})

gameSchema.plugin(autoIncrement.plugin, {
  model: "Game",
  field: "seq",
  startAt: 1,
  increment: 1,
})

module.exports = mongoose.model("Game", gameSchema)

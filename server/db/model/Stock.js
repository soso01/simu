var mongoose = require("mongoose")
var Schema = mongoose.Schema

var stockSchema = new Schema({
  name: String,
  symbol: String,
  start: Date,
  data: {
    time : {
      close: Number,
      AdjClose: Number
    }
  }
})

module.exports = mongoose.model("stock", stockSchema)
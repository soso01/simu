var mongoose = require("mongoose")
const stockDB = require('./stockDB')
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

module.exports = stockDB.model("stock", stockSchema)

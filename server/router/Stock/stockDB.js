const mongoose = require("mongoose")
const stockDB = mongoose
  .createConnection("mongodb://localhost:27017/stock_app")

  module.exports = stockDB
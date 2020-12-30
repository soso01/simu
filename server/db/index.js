const mongoose = require("mongoose")

mongoose.Promise = global.Promise

mongoose
  .connect("mongodb://localhost:27017/simul", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Successfully connected to mongodb")
  })
  .catch((e) => console.error(e))

  module.exports = mongoose

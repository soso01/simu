const express = require("express")
const next = require("next")

const db = require('./db')
const garbageImage = require('./lib/garbageImage')

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()
const { port } = require('../key')

app.prepare().then(() => {
  garbageImage()
  const server = express()

  server.use(express.json())
  server.use("/join", require('./router/join'))
  server.use("/login", require("./router/login"))
  server.use('/image', require('./router/image'))
  server.use('/game', require('./router/game'))
  server.use('/comment', require('./router/comment'))
  server.use('/update', require('./router/update'))
  
  server.get("*", (req, res) => {
    return handle(req, res)
  })
  server.listen(port, (err) => {
    if (err) console.log("listen err : ", err)
    console.log("port " + port + " on")
  })
})

module.exports = app
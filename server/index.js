const express = require("express")
const next = require("next")

const db = require('./db')
const garbageImage = require('./lib/garbageImage')
const createSiteMap = require('./lib/createSiteMap')

const { port, node_env } = require('../key')
const app = next({ node_env })
const handle = app.getRequestHandler()

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

  createSiteMap()
  
  server.get("*", (req, res) => {
    return handle(req, res)
  })
  server.listen(port, (err) => {
    if (err) console.log("listen err : ", err)
    console.log("port " + port + " on")
  })
})

module.exports = app
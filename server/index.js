const express = require("express")
const next = require("next")

const db = require('./db')

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

const garbageImage = require("./lib/garbageImage")

app.prepare().then(() => {
  const server = express()
  garbageImage()

  server.use(express.json())

  server.use("/join", require('./router/join'))
  server.use("/login", require("./router/login"))
  server.use('/image', require('./router/image'))
  server.use('/game', require('./router/game'))
  
  server.get("*", (req, res) => {
    return handle(req, res)
  })
  server.listen(3000, (err) => {
    if (err) console.log("listen err : ", err)
    console.log("port 3000 on")
  })
})

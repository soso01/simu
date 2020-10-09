const express = require("express")
const next = require("next")
const https = require("https")
const fs = require("fs")

const db = require("./db")
const garbageImage = require("./lib/garbageImage")
const createSiteMap = require("./lib/createSiteMap")

const { port } = require("../key")
const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

const certificate = fs.readFileSync(__dirname + "/ssl/cert.pem")
const privateKey = fs.readFileSync(__dirname + "/ssl/key.pem")

app.prepare().then(() => {
  garbageImage()
  const server = express()

  server.use(express.json())
  server.use("/join", require("./router/join"))
  server.use("/login", require("./router/login"))
  server.use("/image", require("./router/image"))
  server.use("/game", require("./router/game"))
  server.use("/comment", require("./router/comment"))
  server.use("/update", require("./router/update"))

  createSiteMap()

  const options = {
    key: privateKey,
    cert: certificate,
  }

  server.all("*", (req, res, next) => {
    let protocol = req.headers["x-forwarded-proto"] || req.protocol
    if (protocol == "https") {
      next()
    } else {
      let from = `${protocol}://${req.hostname}${req.url}`
      let to = `https://${req.hostname}${req.url}` // log and redirect
      console.log(`[${req.method}]: ${from} -> ${to}`)
      res.redirect(to)
    }
  })

  server.get("*", (req, res) => {
    return handle(req, res)
  })
  server.listen(port, (err) => {
    if (err) console.log("listen err : ", err)
    console.log("port " + port + " on")
  })
  const httpsServer = https.createServer(options, server)
  httpsServer.listen(443, function () {
    console.log("HTTPS server listening on port " + 443)
  })
})

module.exports = app

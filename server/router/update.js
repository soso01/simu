const express = require("express")
const app = require("../index")
const { Game, Comment } = require("../db/model")
const jwtCheck = require("../lib/jwtCheck")

const router = express()

router.post("/getData", jwtCheck, async (req, res) => {
  const { seq } = req.body
  const game = await Game.findOne({ seq })
  if (req.user && (req.user.isAdmin || req.user.id === game.userId)) {
    res.json(game)
  } else {
    res.send("fail")
  }
})

router.get("/:seq", async (req, res) => {
  const actualPage = "/update"
  const queryParams = { seq: req.params.seq }
  app.render(req, res, actualPage, queryParams)
})

module.exports = router

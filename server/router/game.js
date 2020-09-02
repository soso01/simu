const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express()

const { Game, Image } = require("../db/model")
const jwtCheck = require("../lib/jwtCheck")

router.post("/create", jwtCheck, async (req, res) => {
  console.log(req.body)
  console.log(req.user)
  const { data, images } = req.body
  data.pages.forEach(async (v) => {
    Image.deleteOne({ name: v.img })
  })
  images.forEach((v) => {
    //이거 나중에 수정기능 완성하고 나서 해봐야함!!
    Image.findOneAndUpdate({ name: v }, null, { upsert: true })
  })
  const game = await Game.create({...data, userId : req.user.id, nickName : req.user.nickName})
  console.log(game)
})

module.exports = router

const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express()
const sharp = require("sharp")
const app = require("../index")

const { Game, Image, Comment } = require("../db/model")
const jwtCheck = require("../lib/jwtCheck")

const createThumbnail = async (originalName, gameId) => {
  const thumbName =
    "thumb_" + path.basename(originalName, path.extname(originalName)) + ".webp"
  const thumbExist = await Image.findOne({ name: thumbName })
  if (!thumbExist) {
    const originalImage = await Image.findOne({ name: originalName })
    sharp(
      path.normalize(
        __dirname + "/../image/" + originalImage.path + originalName
      )
    )
      .resize(600, 600)
      .toFile(
        path.normalize(
          __dirname + "/../image/" + originalImage.path + thumbName
        )
      )
    await Image.create({ name: thumbName, path: originalImage.path, gameId })
  }
  return thumbName
}

const checkGameValid = (data) => {
  if(data.title.length < 5) return {result : "fail", msg : "제목은 최소 4글자 이상이어야 합니다."}
  else if(data.title.length > 30) return {result : "fail", msg : "제목은 30글자 이하이어야 합니다."}
  else if(data.desc.length < 10) return {result : "fail", msg : "설명은 10글자 이상이어야 합니다."}
  else if(data.title.length > 2000) return {result : "fail", msg : "설명은 2000글자 이하이어야 합니다."}

  for(let i = 0; i < data.pages.length; i++){
    const page = data.pages[i];
    
  }
}

const makeFilter = ({ searchName, dateSort }) => {
  const filter = {}
  if (searchName) {
    filter["$or"] = [
      { title: new RegExp(searchName, "gi") },
      { desc: new RegExp(searchName, "gi") },
    ]
  }
  if (dateSort === "month")
    filter["created"] = { $gte: Date.now() - 1000 * 60 * 60 * 24 * 30 }
  else if (dateSort === "week")
    filter["created"] = { $gte: Date.now() - 1000 * 60 * 60 * 24 * 7 }
  else if (dateSort === "day")
    filter["created"] = { $gte: Date.now() - 1000 * 60 * 60 * 24 }
  return filter
}

router.post("/delete", jwtCheck, async (req, res) => {
  const { seq } = req.body
  const game = await Game.findOne({seq})
  if(!req.user || game.userId !== req.user.id){
    return res.json({result: "fail", msg: "시뮬레이션 제작자만 삭제할 수 있습니다."})
  }
  await Image.updateMany({gameId: game._id}, {gameId: null})
  await Comment.deleteMany({gameSeq: seq})
  game.remove()
  return res.json({result: "success", msg: "해당 시뮬레이션이 삭제되었습니다."})
})

router.post("/create", jwtCheck, async (req, res) => {
  if (!req.user) res.send("fail")
  const { data } = req.body

  const game = await Game.create({
    ...data,
    userId: req.user.id,
    nickName: req.user.nickName,
  })
  //썸네일 생성
  game.thumbnail = await createThumbnail(
    data.pages[data.thumbnail].img,
    game._id
  )
  game.save()

  const images = await Image.find({ gameId: game._id })
  for (let i = 0; i < images.length; i++) {
    images[i].gameId = null
    images[i].updated = Date.now()
    await images[i].save()
  }

  data.pages.forEach(async (v) => {
    await Image.findOneAndUpdate({ name: v.img }, { gameId: game._id })
  })
  await Image.findOneAndUpdate({ name: game.thumbnail }, { gameId: game._id })

  res.json(game)
})

router.post("/getCount", async (req, res) => {
  const { sortBy, dateSort, searchName } = req.body
  const filter = makeFilter({ dateSort, searchName })
  const count = await Game.countDocuments(filter)
  res.json({ count })
})

router.post("/getUserCount", jwtCheck, async (req, res) => {
  const { dateSort, searchName } = req.body
  const filter = makeFilter({ dateSort, searchName })
  filter.userId = req.user.id
  const count = await Game.countDocuments(filter)
  res.json({ count })
})

router.post("/recommend", jwtCheck, async (req, res) => {
  const { seq } = req.body
  const userId = req.user ? req.user.id : req.anonymousId
  if (!userId) return res.json({ result: "fail", msg: "추천 오류" })
  const game = await Game.findOne({ seq })
  if (game.userId === userId)
    return res.json({
      result: "fail",
      msg: "자신의 시뮬레이션에 추천할 수 없습니다.",
    })

  if (game.recommender.includes(userId))
    return res.json({ result: "fail", msg: "이미 추천한 시뮬레이션입니다." })

  game.recommender.push(userId)
  game.recommendCount = game.recommender.length
  game.save()

  return res.json({ result: "success", msg: "추천하였습니다." })
})

router.post("/accuse", jwtCheck, async (req, res) => {
  const { seq } = req.body
  const userId = req.user ? req.user.id : req.anonymousId
  if (!userId) return res.json({ result: "fail", msg: "오류" })
  const game = await Game.findOne({ seq })
  if (game.userId === userId)
    return res.json({
      result: "fail",
      msg: "자신의 시뮬레이션을 신고할 수 없습니다.",
    })

  if (game.accuser.includes(userId))
    return res.json({ result: "fail", msg: "이미 신고한 시뮬레이션입니다." })

  game.accuser.push(userId)
  game.accuseCount = game.accuser.length
  game.save()

  return res.json({ result: "success", msg: "신고하였습니다." })
})

router.post("/getGame", async (req, res) => {
  const { seq } = req.body
  const game = await Game.findOne({ seq })
  if (game) {
    game.count += 1
    game.save()
  }
  res.json(game)
})

router.post("/getList", async (req, res) => {
  const { sortBy, dateSort, searchName, page } = req.body
  const filter = makeFilter({ dateSort, searchName })

  const games = await Game.find(filter)
    .select("title desc nickName thumbnail created seq")
    .sort(sortBy === "popular" ? { recommendCount: -1 } : { created: -1 })
    .skip(page * 10)
    .limit(10)
  res.json(games)
})

router.post("/getMyList", jwtCheck, async (req, res) => {
  if (!req.user) return res.json("fail")
  const { page, sortBy, dateSort, searchName } = req.body
  const filter = makeFilter({ dateSort, searchName })
  filter.userId = req.user.id
  const games = await Game.find(filter)
    .select("title desc nickName thumbnail created seq")
    .sort(sortBy === "popular" ? { recommendCount: -1 } : { created: -1 })
    .skip(page * 10)
    .limit(10)
  return res.json(games)
})

router.get("/:seq", async (req, res) => {
  const actualPage = "/game"
  const queryParams = { seq: req.params.seq }
  app.render(req, res, actualPage, queryParams)
})

module.exports = router

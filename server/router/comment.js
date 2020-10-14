const express = require("express")
const app = require("../index")
const { Game, Comment } = require("../db/model")
const jwtCheck = require("../lib/jwtCheck")
const { findOneAndUpdate } = require("../db/model/Game")

const router = express()

router.post("/addComment", jwtCheck, async (req, res) => {
  const { seq, text } = req.body
  const userId = req.user ? req.user.id : req.anonymousId
  const userNickname = req.user
    ? req.user.nickName
    : "익명" + req.anonymousId.slice(0, 4)
  if (!userId) return res.send("fail")

  const exist = await Comment.exists({ gameSeq: req.body.seq, userId })
  if (exist) return res.send("exist")

  const comment = await Comment.create({
    userId,
    text,
    gameSeq: seq,
    userNickname,
  })
  return res.send("success")
})

router.post("/recommend", jwtCheck, async (req, res) => {
  const { commentId } = req.body
  const userId = req.user ? req.user.id : req.anonymousId
  if (!userId) return res.json({ result: "fail", msg: "추천 오류" })
  const comment = await Comment.findOne({ _id: commentId })
  if (comment.userId === userId)
    return res.json({
      result: "fail",
      msg: "자신의 댓글에 추천할 수 없습니다.",
    })

  if (comment.recommender.includes(userId))
    return res.json({ result: "fail", msg: "이미 추천한 댓글입니다." })

  comment.recommender.push(userId)
  comment.recommendCount = comment.recommender.length
  comment.save()

  return res.json({ result: "success", msg: "추천하였습니다." })
})

router.post("/accuse", jwtCheck, async (req, res) => {
  const { commentId } = req.body
  const userId = req.user ? req.user.id : req.anonymousId
  if (!userId) return res.json({ result: "fail", msg: "오류" })
  const comment = await Comment.findOne({ _id: commentId })
  if (comment.userId === userId)
    return res.json({
      result: "fail",
      msg: "자신의 댓글을 신고할 수 없습니다.",
    })

  if (comment.accuser.includes(userId))
    return res.json({ result: "fail", msg: "이미 신고한 댓글입니다." })

  comment.accuser.push(userId)
  comment.accuseCount += 1
  comment.save()

  return res.json({ result: "success", msg: "신고하였습니다." })
})

router.post("/getAccusedComments", jwtCheck, async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.send({})
  }
  const comments = await Comment.find({ accuseCount: { $gte: 5 } }).select(
    "userNickname _id text recommendCount created userId"
  )
  res.json(comments)
})

router.post("/clearAccuseComment", jwtCheck, async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.send({})
  }
  await Comment.findOneAndUpdate({_id : req.body._id}, {accuseCount: -10})
  res.send("success")
})

router.post("/delete", jwtCheck, async (req, res) => {
  const { _id } = req.body
  const userId = req.user ? req.user.id : req.anonymousId
  const isAdmin = req.user ? req.user.isAdmin : false
  if (!userId) return res.json({ result: "fail", msg: "오류" })
  const comment = await Comment.findOne({ _id })
  if (comment.userId !== userId && !isAdmin)
    return res.json({
      result: "fail",
      msg: "본인의 댓글이 아닙니다.",
    })

  comment.remove()

  return res.json({ result: "success", msg: "삭제하였습니다." })
})

router.post("/getMoreComments", async (req, res) => {
  const { seq, page, limitNum } = req.body
  console.log(req.body)
  const comments = await Comment.find(
    { gameSeq: seq, accuseCount: { $lte: 5 } },
    "userNickname _id text recommendCount created userId"
  )
    .sort({ created: -1 })
    .skip(page * limitNum)
    .limit(limitNum)
  return res.json(comments)
})

router.post("/getComments", async (req, res) => {
  const { seq, page, limitNum } = req.body

  const game = await Game.findOne(
    { seq },
    "title desc nickName seq count recommendCount"
  )

  const initBest = await Comment.find(
    {
      gameSeq: seq,
      recommendCount: { $gte: 1 },
      accuseCount: { $lte: 5 },
    },
    "userNickname _id text recommendCount created userId"
  )
    .sort({ recommendCount: -1 })
    .limit(3)

  const initComments = await Comment.find(
    { gameSeq: seq, accuseCount: { $lte: 5 } },
    "userNickname _id text recommendCount created userId"
  )
    .sort({ created: -1 })
    .skip(page * limitNum)
    .limit(limitNum)

  const count = await Comment.countDocuments({ gameSeq: seq })

  res.json({ game, initBest, initComments, count })
})

router.get("/:seq", async (req, res) => {
  const actualPage = "/comment"
  const queryParams = { seq: req.params.seq }
  app.render(req, res, actualPage, queryParams)
})

module.exports = router

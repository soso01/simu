const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express()
const sharp = require("sharp")
const app = require("../index")

const { Game, Image, Comment } = require("../db/model")
const jwtCheck = require("../lib/jwtCheck")

const createThumbnail = async (originalName, gameId) => {
  try {
    const thumbName =
      "thumb_" +
      path.basename(originalName, path.extname(originalName)) +
      ".webp"
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
  } catch {
    return null
  }
}

const clearVisit = (data) => {
  for (let pi = 0; pi < data.pages.length; pi++) {
    const page = data.pages[pi]
    for (let sci = 0; sci < page.script.length; sci++) {
      const script = page.script[sci]
      if (script.select.length > 0) {
        for (let sei = 0; sei < script.select.length; sei++) {
          const select = script.select[sei]
          select.visit = false
        }
      }
      script.visit = false
    }
  }
}

const dfs = (data, pi, sci, sei) => {
  const target =
    sei !== null
      ? data.pages[pi].script[sci].select[sei]
      : data.pages[pi].script[sci]
  if (target.canExit) return true
  if (target.visit) {
    target.canExit = false
  } else {
    target.visit = true
    if (sei === null && target.select.length > 0) {
      for (let i = 0; i < target.select.length; i++) {
        target.canExit = dfs(data, pi, sci, i) || target.canExit
      }
    } else {
      if (target.action.actType === "exit") target.canExit = true
      else if (target.action.actType === "movePage") {
        target.canExit = dfs(data, target.action.num, 0, null)
      } else if (target.action.actType === "moveScript") {
        target.canExit = dfs(data, pi, target.action.num, null)
      } else target.canExit = false
    }
  }
  return target.canExit
}

const checkGameValid = (data) => {
  if (data.title.length < 4)
    return { result: "fail", msg: "제목은 최소 4글자 이상이어야 합니다." }
  else if (data.title.length > 30)
    return { result: "fail", msg: "제목은 30글자 이하이어야 합니다." }
  else if (data.desc.length < 10)
    return { result: "fail", msg: "설명은 10글자 이상이어야 합니다." }
  else if (data.title.length > 2000)
    return { result: "fail", msg: "설명은 2000글자 이하이어야 합니다." }

  let exitCount = 0
  for (let pi = 0; pi < data.pages.length; pi++) {
    const page = data.pages[pi]
    if (!page.img)
      return { result: "fail", msg: pi + 1 + "번 페이지에 이미지가 없습니다." }
    for (let si = 0; si < page.script.length; si++) {
      const script = page.script[si]
      if (script.select.length === 0) {
        if (!script.action.actType)
          return {
            result: "fail",
            msg:
              pi +
              1 +
              "번 페이지의 " +
              (si + 1) +
              "번 스크립트 액션이 설정되지 않았습니다.",
          }
        else if (
          script.action.actType === "movePage" &&
          (script.action.num >= data.pages.length || script.action.num === null)
        ) {
          return {
            result: "fail",
            msg:
              pi +
              1 +
              "번 페이지의 " +
              (si + 1) +
              "번 스크립트 액션의 번호를 다시 설정해주세요.",
          }
        } else if (
          script.action.actType === "moveScript" &&
          (script.action.num >= page.script.length ||
            script.action.num === null)
        ) {
          return {
            result: "fail",
            msg:
              pi +
              1 +
              "번 페이지의 " +
              (si + 1) +
              "번 스크립트 액션의 번호를 다시 설정해주세요.",
          }
        }
        if (script.action.actType === "exit") exitCount += 1
      } else {
        for (let select_i = 0; select_i < script.select.length; select_i++) {
          const select = script.select[select_i]
          if (!select.action.actType)
            return {
              result: "fail",
              msg:
                pi +
                1 +
                "번 페이지의 " +
                (si + 1) +
                "번 스크립트" +
                (select_i + 1) +
                "번 선택지의 액션이 설정되지 않았습니다.",
            }
          else if (
            select.action.actType === "movePage" &&
            (select.action.num >= data.pages.length ||
              select.action.num === null)
          ) {
            return {
              result: "fail",
              msg:
                pi +
                1 +
                "번 페이지의 " +
                (si + 1) +
                "번 스크립트 " +
                (select_i + 1) +
                "번 선택지 액션의 번호를 다시 설정해주세요.",
            }
          } else if (
            select.action.actType === "moveScript" &&
            (select.action.num >= page.script.length ||
              select.action.num === null)
          ) {
            return {
              result: "fail",
              msg:
                pi +
                1 +
                "번 페이지의 " +
                (si + 1) +
                "번 스크립트 " +
                (select_i + 1) +
                "번 선택지 액션의 번호를 다시 설정해주세요.",
            }
          }
          if (select.action.actType === "exit") exitCount += 1
        }
      }
    }
  }
  if (exitCount === 0)
    return { result: "fail", msg: "종료액션이 최소 하나이상 필요합니다." }

  for (let pi = 0; pi < data.pages.length; pi++) {
    const page = data.pages[pi]
    for (let sci = 0; sci < page.script.length; sci++) {
      const script = page.script[sci]
      if (!script.canExit) {
        clearVisit(data)
        dfs(data, pi, sci, null)
      }
    }
  }

  for (let pi = 0; pi < data.pages.length; pi++) {
    const page = data.pages[pi]
    for (let si = 0; si < page.script.length; si++) {
      const script = page.script[si]
      if (!script.canExit)
        return {
          result: "fail",
          msg:
            pi +
            1 +
            "번 페이지의 " +
            (si + 1) +
            "번 스크립트가 종료 액션으로 연결되지 않습니다.",
        }
    }
  }

  return { result: "success" }
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
  const game = await Game.findOne({ seq })
  const isAdmin = req.user ? req.user.isAdmin : false
  if ((!req.user || game.userId !== req.user.id) && !isAdmin) {
    return res.json({
      result: "fail",
      msg: "시뮬레이션 제작자만 삭제할 수 있습니다.",
    })
  }
  await Image.updateMany({ gameId: game._id }, { gameId: null })
  await Comment.deleteMany({ gameSeq: seq })
  game.remove()
  return res.json({
    result: "success",
    msg: "해당 시뮬레이션이 삭제되었습니다.",
  })
})

router.post("/create", jwtCheck, async (req, res) => {
  if (!req.user) res.send({ result: "fail", msg: "로그인이 필요합니다." })
  const { data, isUpdate, isPrivate } = req.body

  if (!isPrivate) {
    const validCheck = checkGameValid(data)
    if (validCheck.result === "fail") return res.json(validCheck)
  }

  let game
  if (isUpdate) {
    game = await Game.findOne({ seq: data.seq })
    game.title = data.title
    game.desc = data.desc
    game.pages = data.pages
    game.thumbnailNum = data.thumbnailNum
    game.isPrivate = isPrivate
  } else {
    game = await Game.create({
      ...data,
      userId: req.user.id,
      nickName: req.user.nickName,
      isPrivate,
    })
  }
  //썸네일 생성
  game.thumbnail = await createThumbnail(
    data.pages[data.thumbnailNum].img,
    game._id
  )
  await game.save()

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
  game.accuseCount += 1
  game.save()

  return res.json({ result: "success", msg: "신고하였습니다." })
})

router.post("/getAccusedGames", jwtCheck, async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.send({})
  }
  const games = await Game.find({ accuseCount: { $gte: 5 } }).select(
    "title desc nickName thumbnail created seq"
  )
  res.json(games)
})

router.post("/clearAccuseGame", jwtCheck, async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.send({})
  }
  await Game.findOneAndUpdate({ _id: req.body._id }, { accuseCount: -10 })
  res.send("success")
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
  const filter = {
    ...makeFilter({ dateSort, searchName }),
    isPrivate: { $ne: true },
  }

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

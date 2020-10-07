const express = require("express")
const router = express()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")

const { User } = require("../db/model")
const jwtCheck = require("../lib/jwtCheck")
const { jwtSecret } = require("../lib/key")


router.post("/isLogin", jwtCheck, (req, res) => {
  if (req.user) res.send("success")
  else res.send("fail")
})

router.post("/isAdmin", jwtCheck, (req, res) => {
  if (req.user && req.user.isAdmin) {
    return res.send(true)
  } else return res.send(false)
})

router.post("/getAnonymousToken", (req, res) => {
  const token = jwt.sign({ anonymousId: uuidv4() }, jwtSecret, {
    expiresIn: "30d",
  })
  res.json(token)
})

router.post("/getUserId", jwtCheck, (req, res) => {
  const userId = req.user ? req.user.id : req.anonymousId

  res.send(userId)
})

router.post("/changePassword", jwtCheck, async (req, res) => {
  const { nowPassword, changePassword } = req.body
  console.log(req.body)
  console.log(req.user)
  if(!req.user) return res.json({result: "fail", msg: "로그인이 필요합니다."})
  else if (!bcrypt.compareSync(nowPassword, req.user.password)){
    return res.json({result: "fail", msg: "비밀번호가 일치하지 않습니다."})
  }
  else {
    req.user.password = bcrypt.hashSync(changePassword, 7)
    req.user.save()
    res.json({result: "success", msg: "비밀번호가 변경되었습니다."})
  }
})

router.post("/", async (req, res) => {
  const { id, password, longExp } = req.body
  const result = await User.findOne({ id })
  if (result === null) return res.send("fail")
  else if (!bcrypt.compareSync(password, result.password)) {
    res.send("fail")
  } else {
    const token = jwt.sign({ id }, jwtSecret, {
      expiresIn: longExp ? "30d" : "1d",
    })
    res.json(token)
  }
})

module.exports = router

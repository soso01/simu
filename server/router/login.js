const express = require('express');
const router = express();

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');

const {User} = require('../db/model')
const jwtCheck = require('../lib/jwtCheck')
const {jwtSecret} = require('../lib/key')

router.post('/isLogin', jwtCheck, (req, res) => {
  if(req.user) res.send("success")
  else res.send("fail")
})

router.post("/getAnonymousToken", (req, res) => {
  const token = jwt.sign({anonymousId : uuidv4()}, jwtSecret, { expiresIn: "30d"} )
  res.json(token)
})

router.post("/getUserId", jwtCheck, (req, res) => {
  const userId = req.user ? req.user.id : req.anonymousId

  res.send(userId)
})

router.post("/", async (req, res) => {
  const {id, password, longExp} = req.body
  const result = await User.findOne({id})
  if(result === null) return res.send("fail")
  else if (!bcrypt.compareSync(password, result.password)){
    res.send("fail")
  }
  else {
    const token = jwt.sign({id}, jwtSecret, { expiresIn: longExp ? "30d" : "1d"} )
    res.json(token)
  }
})

module.exports = router
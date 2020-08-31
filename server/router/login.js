const express = require('express');
const router = express();

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const {User} = require('../db/model')
const jwtCheck = require('../lib/jwtCheck')
const {jwtSecret} = require('../lib/key')

router.post('/jwtVerify', jwtCheck, (req, res) => {
  console.log("jwtVerify excute")
  res.send("success")
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
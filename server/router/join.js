const express = require('express');
const router = express();
const bcrypt = require("bcrypt");

const { User } = require('../db/model')
const { myEmail, myEmailPassword } = require('../lib/key')

// 이메일 인증
const certificationObj = {}
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: myEmail, // generated ethereal user
    pass: myEmailPassword, // generated ethereal password
  },
});

router.post('/getCertificationNumber', async (req, res) => {
  const { email } = req.body
  const result = await User.findOne({email})
  console.log(result)
  if(result !== null) return res.send("exist")

  const random = Math.floor(100000 + Math.random() * 900000)
  certificationObj[email] = random
  await transporter.sendMail({
    from: `"사이트이름" ${myEmail}`,
    to: email + "@naver.com",
    subject: '인증 번호입니다.',
    text: "발송시간으로부터 5분내에 인증을 완료해 주세요.",
    html: `<p>인증번호 : ${random}</p><p>발송 시간으로부터 5분 이내에 인증을 완료해주세요.</p>`,
  });
  setTimeout(() => delete certificationObj[email], 300 * 1000)
  res.send('done')
})

router.post('/checkCertificationNumber', async (req, res) => {
  const {email, checkNum} = req.body
  console.log(Number(certificationObj[email]), certificationObj[email], Number(checkNum))
  if(certificationObj[email] && ( Number(certificationObj[email]) === Number(checkNum) )){
    res.send('success')
  }
  else {
    res.send("fail")
  }
})

//id 중복확인
router.post("/checkExistId", async (req, res) => {
  const {id} = req.body
  const result = await User.findOne({id})
  if(result === null) res.send('success')
  else res.send('fail')
})

//nickName 중복확인
router.post("/checkExistNickName", async (req, res) => {
  const {nickName} = req.body
  const result = await User.findOne({nickName})
  if(result === null) res.send('success')
  else res.send('fail')
})

// 유저 생성
router.post("/createUser", async (req, res) => {
  const {id, password, nickName, email} = req.body
  const result = await User.create({id, password: bcrypt.hashSync(password, 10), nickName, email})
  console.log(result)
  res.send('success')
})

module.exports = router
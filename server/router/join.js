const express = require("express")
const router = express()
const bcrypt = require("bcrypt")

const { User } = require("../db/model")
const { myEmail, myEmailPassword } = require("../lib/key")

// 이메일 인증
const certificationObj = {}
const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: myEmail, // generated ethereal user
    pass: myEmailPassword, // generated ethereal password
  },
})

router.post("/findPassword", async (req, res) => {
  const { id, email } = req.body
  const user = await User.findOne({email, id})
  if(!user) return res.json({result: "fail", msg: "해당 계정은 존재하지 않습니다."})
  else {
    const random = Math.floor(Math.random() * 100000).toString()
    user.password = bcrypt.hashSync(random, 7)
    user.save()
    await transporter.sendMail({
      from: `"SIMU.kr" ${myEmail}`,
      to: email + "@naver.com",
      subject: "임시 비밀번호 발송",
      text: "임시 비밀번호 발송",
      html: `<p>임시비밀번호 : ${random}</p><p>임시비밀번호로 로그인 후 비밀번호를 변경해주세요.</p>`,
    })
    return res.json({result: "success", msg: "임시비밀번호를 발송했습니다."})
  }
})

router.post("/getCertificationNumber", async (req, res) => {
  const { email } = req.body
  const result = await User.findOne({ email })
  if (result !== null) return res.send("exist")

  const random = Math.floor(100000 + Math.random() * 900000)
  certificationObj[email] = random
  await transporter.sendMail({
    from: `"SIMU.kr" ${myEmail}`,
    to: email + "@naver.com",
    subject: "인증 번호입니다.",
    text: "발송시간으로부터 5분내에 인증을 완료해 주세요.",
    html: `<p>인증번호 : ${random}</p><p>발송 시간으로부터 5분 이내에 인증을 완료해주세요.</p>`,
  })
  setTimeout(() => delete certificationObj[email], 300 * 1000)
  res.send("done")
})

router.post("/checkCertificationNumber", async (req, res) => {
  const { email, checkNum } = req.body
  if (
    certificationObj[email] &&
    Number(certificationObj[email]) === Number(checkNum)
  ) {
    res.send("success")
  } else {
    res.send("fail")
  }
})

//id 중복확인
router.post("/checkExistId", async (req, res) => {
  const { id } = req.body
  const result = await User.findOne({ id })
  if (result === null) res.send("success")
  else res.send("fail")
})

//nickName 중복확인
router.post("/checkExistNickName", async (req, res) => {
  const { nickName } = req.body
  const result = await User.findOne({ nickName })
  if (result === null) res.send("success")
  else res.send("fail")
})

// 유저 생성
router.post("/createUser", async (req, res) => {
  const { id, password, nickName, email } = req.body
  const result = await User.create({
    id,
    password: bcrypt.hashSync(password, 7),
    nickName,
    email,
  })
  res.send("success")
})

module.exports = router

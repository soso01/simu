const multer = require("multer")
const moment = require("moment")
const path = require("path")
const fs = require("fs")

const print = (data) => {
  for (let pi = 0; pi < data.pages.length; pi++) {
    const page = data.pages[pi]
    for (let sci = 0; sci < page.script.length; sci++) {
      const script = page.script[sci]
      if (script.select.length > 0) {
        for (let sei = 0; sei < script.select.length; sei++) {
          const select = script.select[sei]
          console.log(
            pi,
            sci,
            sei,
            "visit : ",
            select.visit,
            "canExit : ",
            select.canExit
          )
        }
      }
      console.log(
        pi,
        sci,
        "visit : ",
        script.visit,
        "canExit : ",
        script.canExit
      )
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
  console.log("end", pi, sci, sei, target.canExit)
  return target.canExit
}

const data = {
  _id: { $oid: "5f7a967176d5e81e4de6b6e3" },
  thumbnail: "thumb_다운로드-20201005114442.webp",
  count: 0,
  accuseCount: 0,
  accuser: [],
  recommendCount: 0,
  recommender: [],
  title: "123123",
  desc: "1231231231",
  pages: [
    {
      _id: { $oid: "5f7a967176d5e81e4de6b6e4" },
      img: "다운로드-20201005114442.webp",
      script: [
        {
          _id: { $oid: "5f7a967176d5e81e4de6b6e5" },
          text: "ㅇㅇ",
          action: { actType: "movePage", num: 1 },
          select: [
            {
              _id: { $oid: "5f7a967176d5e81e4de6b6e6" },
              text: "ㅇㅇ",
              action: { actType: "moveScript", num: 1 },
            },
            {
              _id: { $oid: "5f7a967176d5e81e4de6b6e7" },
              text: "ㅇㅇ",
              action: { actType: "movePage", num: 1 },
            },
          ],
        },
        {
          _id: { $oid: "5f7a967176d5e81e4de6b6e8" },
          text: "ㅇㅇ",
          action: { actType: "moveScript", num: 0 },
          select: [],
        },
      ],
    },
    {
      _id: { $oid: "5f7a967176d5e81e4de6b6e9" },
      img: "i015408134875-20201005114637.webp",
      script: [
        {
          _id: { $oid: "5f7a967176d5e81e4de6b6ea" },
          text: "ㄴㄴ",
          action: { actType: "exit", num: null },
          select: [],
        },
      ],
    },
  ],
  userId: "admin",
  nickName: "관리자",
  created: { $date: "2020-10-05T03:43:45.136Z" },
  seq: 29,
  __v: 0,
}

const clearVisit = () => {
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

for (let pi = 0; pi < data.pages.length; pi++) {
  const page = data.pages[pi]
  for (let sci = 0; sci < page.script.length; sci++) {
    const script = page.script[sci]
    if (!script.canExit) {
      console.log("go", pi, sci, "null", script.canExit)
      clearVisit()
      dfs(data, pi, sci, null)
    }
  }
}

console.log(JSON.stringify(data))

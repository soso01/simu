const { createReadStream, createWriteStream } = require("fs")
const { resolve } = require("path")
const { createGzip } = require("zlib")
const {
  simpleSitemapAndIndex,
  lineSeparatedURLsToSitemapOptions,
} = require("sitemap")

const Game = require("../db/model/Game")

const createSiteMap = () => {
  setInterval(async () => {
    const games = await Game.find().select("seq")
    const sourceData = [
      { url: "/", changefreq: "daily" },
      { url: "/login/", changefreq: "daily" },
      { url: "/join/", changefreq: "daily" },
      { url: "/changePassword/", changefreq: "daily" },
      { url: "/findPassword/", changefreq: "daily" },
    ]

    games.forEach((v) => {
      sourceData.push({ url: "/game/" + v.seq, changefreq: "daily" })
      sourceData.push({ url: "/comment/" + v.seq, changefreq: "daily" })
    })

    simpleSitemapAndIndex({
      hostname: "https://simu.kr",
      destinationDir: "./public/",
      sourceData,
    }).then(() => {
      // Do follow up actions
    })
  }, 1000 * 60 * 60)
}

module.exports = createSiteMap

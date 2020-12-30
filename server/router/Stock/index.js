const express = require("express")
const router = express()
const Stock = require('./model')

router.post("/getStock", async (req, res) => {
  const { symbol } = req.body
  console.log(symbol)
  const stock = await Stock.findOne({ symbol })
  return res.json(stock)
})

router.get("/", (req, res) => {
  return res.send("Hello World!")
})

module.exports = router
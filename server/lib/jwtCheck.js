const jwt = require('jsonwebtoken');
const {jwtSecret} = require('./key')

module.exports = (req, res, next) => {
  const {token} = req.body
  console.log("middleware token : ", token)
  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log("decode : ", decoded)
    next()
  } catch(err) {
    // err
    res.send("fail")
  }
}
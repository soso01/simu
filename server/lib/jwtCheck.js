const jwt = require('jsonwebtoken');
const {jwtSecret} = require('./key')

module.exports = (req, res, next) => {
  const {token} = req.body
  try {
    const decoded = jwt.verify(token, jwtSecret);
    next()
  } catch(err) {
    // err
    res.send("fail")
  }
}
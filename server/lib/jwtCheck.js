const jwt = require('jsonwebtoken');
const {jwtSecret} = require('./key')
const { User } = require('../db/model')

module.exports = async (req, res, next) => {
  const {token} = req.body
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = await User.findOne({id: decoded.id})
    next()
  } catch(err) {
    // err
    res.send("fail")
  }
}
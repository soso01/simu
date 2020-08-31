var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, trim: true },
  nickName: { type: String, required: true, trim: true, unique: true},
  email: {type: String, required: true, unique: true}
});

module.exports = mongoose.model('User', userSchema);
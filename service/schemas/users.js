const { Schema, model }  = require('mongoose');
const bCrypt = require("bcryptjs");


const users = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: [String],
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String
});

users.methods.setPassword = function(password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

users.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.password);
};


const Users = model("user", users);
module.exports = Users;

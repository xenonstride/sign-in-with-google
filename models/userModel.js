const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  g_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  f_name: {
    type: String,
    required: true,
  },
  l_name: {
    type: String,
  },
  photo: {
    type: String,
  },
  gapiRefreshToken: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

// function to verify if our app's jwt token is valid
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (cookies) => {
  const token = cookies && cookies["auth_token"];
  if (!token) {
    console.log("no token, redirecting to login");
    return {
      isAuth: false,
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ g_id: decoded.uid });
    if (!user)
      return {
        isAuth: false,
      };
    return {
      isAuth: true,
      user,
    };
  } catch (err) {
    console.log(err);
    return {
      isAuth: false,
    };
  }
};

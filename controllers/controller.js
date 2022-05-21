const verifyJWTToken = require("../utils/verifyToken");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.googleSigninAuth = async (req, res) => {
  // create jwt, send and save to db
  const { credential: creds } = req.body;
  console.log(creds); //sent by google
  const d = jwt.decode(creds); // decode the jwt
  console.log(d);

  // create the jwt for our app
  const newToken = jwt.sign(
    {
      uid: d.sub,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 1200,
    }
  );

  // send the cookie to the client
  res.cookie("auth_token", newToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1200 * 1000),
  });

  //dont create new user if found
  const found = await User.findOne({
    g_id: d.sub,
  });

  const updateObj = {
    full_name: d.name,
    f_name: d.given_name,
    l_name: d.family_name,
    photo: d.picture,
  };

  if (!found) {
    await User.create({
      g_id: d.sub,
      email: d.email,
      ...updateObj,
    });
  } else {
    await User.findOneAndUpdate(
      {
        g_id: d.sub,
      },
      { ...updateObj }
    );
  }

  res.redirect("/home");
};

exports.checkGapiAuth = async (req, res) => {
  const auth = await verifyJWTToken(req.cookies);
  if (!auth.isAuth) return res.redirect("/");

  let accessToken = null;

  if (auth.user.gapiRefreshToken) {
    if (req.query.getToken === "yes") {
      const params = new URLSearchParams();
      params.append("client_id", process.env.GOOGLE_CLIENT_ID);
      params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", auth.user.gapiRefreshToken);
      const gres = await axios.post(
        "https://oauth2.googleapis.com/token",
        params
      );
      accessToken = gres.data["access_token"];
    }
  }

  return res.status(200).json({
    refreshTokenPresent: auth.user?.gapiRefreshToken ? true : false,
    accessToken,
  });
};

exports.saveRefreshToken = async (req, res) => {
  const auth = await verifyJWTToken(req.cookies);
  if (!auth.isAuth) return res.redirect("/");

  console.log(req.query);

  const params = new URLSearchParams();
  params.append("client_id", process.env.GOOGLE_CLIENT_ID);
  params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
  params.append("grant_type", "authorization_code");
  params.append("code", req.query.code);
  params.append("redirect_uri", "http://localhost:4000/gapi-save-rtoken");

  const gres = await axios.post("https://oauth2.googleapis.com/token", params);
  console.log(gres.data);
  await User.findOneAndUpdate(
    { g_id: auth.user["g_id"] },
    {
      gapiRefreshToken: gres.data["refresh_token"],
    }
  );

  return res.redirect("/my-files");
};

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config.env" });
const User = require("./models/userModel");
const DB_URL = process.env.DB_URL.replace("<password>", process.env.DB_PASS);

const controller = require("./controllers/controller");
const verifyJWTToken = require("./utils/verifyToken");

//CONNECT TO DB
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"));

// LOG REQUESTS
app.use(morgan("dev"));

// SET EJS TEMPLATE
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// DECODE BODY
app.use(bodyParser.json()); //json
app.use(bodyParser.urlencoded({ extended: true })); //form url encoded

//PARSE COOKIES
app.use(cookieParser());

// SET STATIC FOLDER FOR JS files
app.use(express.static(__dirname + "/public"));

//ROUTES

// SIGN IN WITH GOOGLE AUTH - CREATE USER IN DB
app.post("/google-signin-auth", controller.googleSigninAuth);

//CHECK IF REFRESH TOKEN IS PRESENT
app.get("/gapi-auth", controller.checkGapiAuth);

// GET THE AUTH CODE AND SAVE IT TO DB FOR FUTURE USE
app.get("/gapi-save-rtoken", controller.saveRefreshToken);

// LOGIN ROUTE
app.get("/", async (req, res) => {
  const auth = await verifyJWTToken(req.cookies);
  if (auth.isAuth) return res.redirect("/home");
  return res.render("index.ejs");
});

app.post("/signout", async (req, res) => {
  // const auth = await verifyJWTToken(req.cookies);
  // if (!auth.isAuth) return res.redirect("/");
  for (let c in req.cookies) {
    res.cookie(c, "", { expires: new Date(0) });
  }
  return res.status(200).json({
    statusCode: 200,
  });
});

// HOME ROUTE
app.get("/home", async (req, res) => {
  const auth = await verifyJWTToken(req.cookies);
  if (!auth.isAuth) return res.redirect("/");

  res.render("home.ejs", {
    name: auth.user["full_name"],
    email: auth.user.email,
    photo: auth.user.photo,
  });
});

// GET FILES ROUTE
app.get("/my-files", async (req, res) => {
  const auth = await verifyJWTToken(req.cookies);
  if (!auth.isAuth) return res.redirect("/");

  if (!auth.user.gapiRefreshToken) return res.redirect("/home");
  res.render("myFiles.ejs");
});

// LISTEN ON PORT
app.listen(4000, () => {
  console.log("running on port 4000");
});

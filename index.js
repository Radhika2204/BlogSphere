const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");
const port = 9000;

const Blog = require("./models/blog");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const userRoute = require("./routes/user");
const app = express();
const blogRoute = require("./routes/blog");
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
mongoose.connect("mongodb://localhost:27017/blogify").then(() => {
  console.log("connected with DB");
});
app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  });
  
  app.use("/user", userRoute);
  app.use("/blog", blogRoute);
app.listen(port, () => {
  console.log("server has started");
});

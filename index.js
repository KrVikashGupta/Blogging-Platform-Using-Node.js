const express = require("express");
const path  = require("path");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const Blog = require('./models/blog');

const userRoute = require('./routes/user');
const blogRoute = require("./routes/blog");
const { checkForAuthenticationCookie } = require("./middleware/authentication");

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/blogger')
                .then((e) => console.log("Mongodb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public/uplaods")));

app.get("/", async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
})

app.use('/user', userRoute);
app.use('/blog',blogRoute);

app.listen(PORT, ()=> console.log('server is started at Port: 3000' ));
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const studentModel = require("./models/studentModel");
const dburl = process.env.ATLASDB_URL;


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

const sessionOption = {
    secret: "abcd",
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionOption));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

const MONGO_URL = "mongodb://127.0.0.1:27017/student";
main().then(() => {
    console.log("connected to DB")
})
.catch((err) => {
    console.log(err);
})
async function main(){
    await mongoose.connect(dburl);
}

app.listen(3030, () => {
    console.log("Server started");
});
app.get("/", (req, res) => {
    res.render("index.ejs");
});
app.get("/as", (req, res) => {
    res.send("s");
})
app.post("/data", async(req, res) => {
    console.log(req.body);
    let {name, rollno, address, cname} = req.body;
    let newStudent = new studentModel({
        name,
        rollno,
        address,
        courseName: cname
    })
    await newStudent.save();
    req.flash("success", "data added");
    res.redirect("/");
});


app.get("/data", async(req, res) => {
    let allStudent = await studentModel.find({});
    res.render("display.ejs", {allStudent});
})
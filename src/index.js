const express = require("express");
const Collection=require("./mongoose.js")
const { BlogPost } = require("./mongoose.js");




const path = require("path");

const app = express();
const jwt= require("jsonwebtoken")
const cookieParser= require("cookie-parser")
const bcryptjs= require("bcryptjs")

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

// Corrected paths
const templatePath = path.join(__dirname, "../template");
const publicPath = path.join(__dirname, "../public");

app.set("view engine", "hbs");
app.set("views", templatePath); 


app.use(express.static(publicPath)); 


app.get("/", (req, res) => {
  res.render("index"); 
});


app.post("/", async (req, res) => {
  try {
    const check = await Collection.findOne({ name: req.body.name });

    if (check) {
      return res.send("user already exists");
    }

    // Generate token
    const token = jwt.sign(
      { name: req.body.name, email: req.body.email },
      "yourSecretKey"
    );

    // Insert new user with email included
    const data = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      token: token
    };

    await Collection.insertMany([data]);

    res.send("User registered successfully");
  } catch (err) {
    console.error("Error inserting data:", err);  // Now you'll see the actual issue
    res.status(500).send("Internal server error: " + err.message);
  }
});


app.listen(3000, () => {
  console.log("port connected");
});





const express = require("express");
const Collection = require("./mongoose.js")
const fs = require("fs");

// const jwt = require("jsonwebtoken");


let blogs = require("./BLOG_DATA.json");
let reference = require("./application.json");


function loadBlogs() {
  const data = fs.readFileSync("./BLOG_DATA.json", "utf-8");
  return JSON.parse(data);
}


const path = require("path");

const app = express();
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bcryptjs = require("bcryptjs");
const { userInfo } = require("os");
const { json } = require("stream/consumers");

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

// Corrected paths

app.use(express.static(path.join(__dirname, "../my-react-app/public")));

async function hashpass(password) {
  const res = await bcryptjs.hash(password, 10)
  return res

}

async function compare(userPass, hashpassword) {
  const res = await bcryptjs.hash(userPass, hashpassword)
  return res

}




app.get("/", (req, res) => {


  if (req.cookies.jwt) {
    const verify = jwt.verify(req.cookies.jwt, "fygxfxggugghbjbjvnknknknknknknknknknknknknknhvycfzzd")
    res.render("home", { name: verify.name })
  }

  else {
    res.render("login")
  }

});

//for signup//////////////
app.post("/", async (req, res) => {
  try {
    const check = await Collection.findOne({ name: req.body.name });

    if (check) {
      return res.status(409).json({ message: "User already exists" });
    }

    const token = jwt.sign(
      { name: req.body.name, email: req.body.email },
      "your_jwt_secret"
    );

    res.cookie("jwt", token, {
      maxAge: 600000,
      httpOnly: true
    });

    const newUser = {
      id: reference.length + 1,
      name: req.body.name,
      email: req.body.email,
      password: await hashpass(req.body.password),
      token: token
    };

    reference.push(newUser);
    await Collection.insertMany([newUser]);

    res.status(200).json({ 
      message: "User registered successfully", 
      name: req.body.name, 
      token: token 
    });
  } catch (error) {
    console.log("Error in POST /:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


//for login//////
app.post("/", async (req, res) => {
  try {
    const check = await Collection.findOne({ name: req.body.name });
    const passCheck = await compare(req.body.password, check.password)

    if (check && passCheck) {

      res.cookies("jwt", check.token, {
        maxAge: 600000,
        httpOnly: true
      })
      res.render("home", { name: req.body.name })
    }

    else {
      return res.send("Some details is wrong check again!");
    }
  }
  catch {
    res.send("wrong details")



  }
}
);


////// FOR BLOG //

app.get("/api/blogs", (req, res) => {
  return res.json(blogs);
});

app.get("/api/blogs/:id", (req, res) => {
  const id = Number(req.params.id);
  const blog = blogs.find((b) => b.id === id);
  if (!blog) return res.status(404).json({ status: "error", message: `Blog not found ${error}` });
  res.json(blog);
});

app.post("/api/blogs/insert", (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ status: "error", message: "Missing fields" });
  }

  const newBlog = {
    id: blogs.length + 1,
    title,
    content,
    author,
    created_at: new Date().toISOString()
  };

  blogs.push(newBlog);
  fs.writeFile("./BLOG_DATA.json", JSON.stringify(blogs, null, 2), (err) => {
    if (err) return res.status(500).json({ status: "error", message: "Failed to write blog" });
    res.json({ status: "success", blog: newBlog });
  });
});

app.patch("/api/blogs/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, content, author } = req.body;
  const blogIndex = blogs.findIndex(b => b.id === id);

  if (blogIndex === -1) return res.status(404).json({ status: "error", message: "Blog not found" });

  if (title) blogs[blogIndex].title = title;
  if (content) blogs[blogIndex].content = content;
  if (author) blogs[blogIndex].author = author;

  fs.writeFile("./BLOG_DATA.json", JSON.stringify(blogs, null, 2), (err) => {
    if (err) return res.status(500).json({ status: "error", message: "Failed to update blog" });
    res.json({ status: "success", blog: blogs[blogIndex] });
  });
});


app.delete("/api/blogs/:id", (req, res) => {
  const id = Number(req.params.id);
  const newBlogs = blogs.filter(b => b.id !== id);

  if (newBlogs.length === blogs.length)
    return res.status(404).json({ status: "error", message: "Blog not found" });

  fs.writeFile("./BLOG_DATA.json", JSON.stringify(newBlogs, null, 2), (err) => {
    if (err) return res.status(500).json({ status: "error", message: "Failed to delete blog" });
    res.json({ status: "success", message: `Blog with id ${id} deleted` });
  });
});


app.listen(3000, () => {
  const Port = 3000
  console.log(`port connected ${Port}`);
});



const express = require("express");
const Collection=require("./mongoose.js")
const fs = require("fs");

const blogs = require("./BLOG__DATA.json"); 
function loadBlogs() {
    const data = fs.readFileSync("./BLOG_DATA.json", "utf-8");
    return JSON.parse(data);
}


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




////// FOR BLOG //

app.get("/api/blogs", (req, res) => {
    return res.json(blogs);
});

app.get("/api/blogs/:id", (req, res) => {
    const id = Number(req.params.id);
    const blog = blogs.find((b) => b.id === id);
    if (!blog) return res.status(404).json({ status: "error", message: `Blog not found ${error}`});
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
  const Port=3000
  console.log(`port connected ${Port}`);
});



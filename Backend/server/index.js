const express = require("express");
const Collection = require("./mongoose.js");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcryptjs = require("bcryptjs");

const blogs = require("./BLOG_DATA.json");
const data = require("./application.json");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));



app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Utility functions
async function hashpass(password) {
  return await bcryptjs.hash(password, 10);
}

async function compare(userPass, hashedPassword) {
  return await bcryptjs.compare(userPass, hashedPassword);
}



// Routes
app.get("/sign-up", (req, res) => {
  try {
    if (req.cookies.jwt) {
      const verify = jwt.verify(req.cookies.jwt, "fygxfxggugghbjbjvnknknknknknknknknknknknknknhvycfzzd");

      return res.render("home", { name: verify.name }); // Added return here
    }
    return res.render("sign"); // Added return here
    // Removed the res.send() that was causing multiple responses
  } catch (error) {
    console.error("Root route error:", error);
    return res.status(500).render("error"); // Make sure you have an error view
  }
});

// Signup Route
app.post("/sign-up", async (req, res) => {
  try {
    console.log("Received signup request:", req.body);

    // Check if user exists
    const existingUser = await Collection.findOne({ 
      $or: [
        { name: req.body.name },
        { email: req.body.email }
      ]
    });

    if (existingUser) {
      return res.status(409).render("sign", { 
        error: "User with this name or email already exists",
        formData: req.body // Pass back the form data to repopulate the form
      });
    }

    // Hash password
    const hashedPassword = await hashpass(req.body.password);

    // Create token
    const token = jwt.sign(
      { name: req.body.name, email: req.body.email },
      "nnvbihohbjvjvjbj",
      { expiresIn: '1h' }
    );

    // Create new user
    const newUser = new Collection({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      token: token
    });

    // Save user
    await newUser.save();

    // Set cookie
    res.cookie("jwt", token, {
      maxAge: 3600000, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    // Send single response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email
      }
    });

    return res.redirect("/");

  } catch (error) {
    console.error("Signup error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ 
        success: false,
        message: "Internal server error" 
      });
    }
  }
});

// Start server




///login//////

app.get("/login", (req, res) => {
  try {
    if (req.cookies.jwt) {
      // If already logged in, redirect to home
      const verify = jwt.verify(req.cookies.jwt, "fygxfxggugghbjbjvnknknknknknknknknknknknknknhvycfzzd");
      return res.render("home", { name: verify.name });
    }
    return res.render("login");
  } catch (error) {
    console.error("Login page error:", error);
    return res.status(500).render("error");
  }
});



app.post("/login", async (req, res) => {
  try {
    // Input validation
    if (!req.body.name || !req.body.password) {
      return res.status(400).render("login", { error: "Username and password are required" });
    }

    // Find user
    const user = await Collection.findOne({ name: req.body.name });
    if (!user) {
      return res.status(401).render("login", { error: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).render("login", { error: "Invalid credentials" });
    }

    // Generate NEW token (don't reuse old one)
    const token = jwt.sign(
      { name: user.name, email: user.email },
      "nnvbihohbjvjvjbj",
      { expiresIn: '1h' }
    );

    // Update token in database
    user.token = token;
    await user.save();

    // Set cookie
    res.cookie("jwt", token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    // Redirect or render home
    return res.render("home", { name: user.name });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).render("login", { error: "Internal server error" });
  }
});


////// FOR BLOG //

// app.get("/api/blogs", (req, res) => {
//   return res.json(blogs);
// });

// app.get("/api/blogs/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const blog = blogs.find((b) => b.id === id);
//   if (!blog) return res.status(404).json({ status: "error", message:` Blog not found ${error}` });
//   res.json(blog);
// });

// app.post("/api/blogs/insert", (req, res) => {
//   const { title, content, author } = req.body;
//   if (!title || !content || !author) {
//     return res.status(400).json({ status: "error", message: "Missing fields" });
//   }

//   const newUser = {
//     id: blogs.length + 1,
//     title,
//     content,
//     author,
//     created_at: new Date().toISOString()
//   };

//   blogs.push(newBlog);
//   fs.writeFile("./BLOG_DATA.json", JSON.stringify(blogs, null, 2), (err) => {
//     if (err) return res.status(500).json({ status: "error", message: "Failed to write blog" });
//     res.json({ status: "success", blog: newBlog });
//   });
// });

// app.patch("/api/blogs/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const { title, content, author } = req.body;
//   const blogIndex = blogs.findIndex(b => b.id === id);

//   if (blogIndex === -1) return res.status(404).json({ status: "error", message: "Blog not found" });

//   if (title) blogs[blogIndex].title = title;
//   if (content) blogs[blogIndex].content = content;
//   if (author) blogs[blogIndex].author = author;

//   fs.writeFile("./BLOG_DATA.json", JSON.stringify(blogs, null, 2), (err) => {
//     if (err) return res.status(500).json({ status: "error", message: "Failed to update blog" });
//     res.json({ status: "success", blog: blogs[blogIndex] });
//   });
// });


// app.delete("/api/blogs/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const newBlogs = blogs.filter(b => b.id !== id);

//   if (newBlogs.length === blogs.length)
//     return res.status(404).json({ status: "error", message: "Blog not found" });

//   fs.writeFile("./BLOG_DATA.json", JSON.stringify(newBlogs, null, 2), (err) => {
//     if (err) return res.status(500).json({ status: "error", message: "Failed to delete blog" });
//     res.json({ status: "success", message:` Blog with id ${id} deleted `});
//   });
// });


app.listen(3000, () => {
  const Port = 3000
  console.log(`port connected ${Port}`);
});


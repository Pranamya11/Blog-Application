const express = require("express");
const { Collection, Blog } = require("./mongoose.js");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcryptjs = require("bcryptjs");

const blogData = require("./BLOG_DATA.json");


const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's origin
  credentials: true
}));



async function hashpass(password) {
  return await bcryptjs.hash(password, 10);
}

async function compare(userPass, hashedPassword) {
  return await bcryptjs.compare(userPass, hashedPassword);
}


app.get("/sign-up", (req, res) => {
  try {
    if (req.cookies.jwt) {
      const verify = jwt.verify(req.cookies.jwt, "fygxfxggugghbjbjvnknknknknknknknknknknknknknhvycfzzd");
      return res.redirect('http://localhost:5173/');
    }
    return res.redirect('http://localhost:5173/signup');
  } catch (error) {
    console.error("Root route error:", error);
    return res.redirect('http://localhost:5173/');
  }
});

// Signup Route////////
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
      return res.status(409).json({
        error: "User with this name or email already exists"
      });
    }

    const hashedPassword = await hashpass(req.body.password);

    
    const token = jwt.sign(
      { name: req.body.name, email: req.body.email },
      "fygxfxggugghbjbjvnknknknknknknknknknknknknknhvycfzzd",
      { expiresIn: '1h' }
    );

  
    const newUser = new Collection({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      token: token
    });

   
    await newUser.save();

 
    res.cookie("jwt", token, {
      maxAge: 3600000, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    
    // Return JSON response instead of redirect for frontend
    return res.status(201).json({ 
      success: true, 
      message: "Account created successfully",
      user: { name: req.body.name, email: req.body.email }
    });

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

app.get("/login", (req, res) => {
  try {
    if (req.cookies.jwt) {
      return res.redirect('http://localhost:5173/');
    }
    res.redirect('http://localhost:5173/login');
  } catch (error) {
    console.error("Login page error:", error);
    return res.redirect('http://localhost:5173/login');
  }
});

app.post("/login", async (req, res) => {
  try {
    if (!req.body.name || !req.body.password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await Collection.findOne({ name: req.body.name });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { name: user.name, email: user.email },
      "fygxfxggugghbjbjvnknknknknknknknknknknknknknhvycfzzd",
      { expiresIn: '1h' }
    );

    user.token = token;
    await user.save();

    res.cookie("jwt", token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    // Return JSON response instead of redirect for frontend
    return res.status(200).json({ 
      success: true, 
      message: "Login successful",
      user: { name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/check-auth', (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({ isAuthenticated: false });
    }
    const verify = jwt.verify(req.cookies.jwt, "fygxfxggugghbjbjvnknknknknknknknknknknknknknhvycfzzd");
    res.json({ isAuthenticated: true, user: { name: verify.name, email: verify.email } });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
});

// Blog endpoints - Now using MongoDB
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ created_at: -1 });
    return res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ status: "error", message: "Failed to fetch blogs" });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ status: "error", message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).json({ status: "error", message: "Failed to fetch blog" });
  }
});

app.post("/api/blogs/insert", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    if (!title || !content || !author) {
      
      return res.status(400).json({ status: "error", message: "Missing fields" });
    }

    const newBlog = new Blog({
      title,
      content,
      author,
      created_at: new Date()
    });

    await newBlog.save();
    res.json({ status: "success", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ status: "error", message: "Failed to create blog" });
  }
});

app.patch("/api/blogs/:id", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ status: "error", message: "Blog not found" });
    }

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (author) blog.author = author;

    await blog.save();
    res.json({ status: "success", blog: blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({ status: "error", message: "Failed to update blog" });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ status: "error", message: "Blog not found" });
    }

    res.json({ status: "success", message: `Blog deleted successfully` });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({ status: "error", message: "Failed to delete blog" });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ success: true });
});

app.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ success: true });
});

app.listen(3000, () => {
  const Port = 3000;
  console.log(`port connected ${Port}`);
});


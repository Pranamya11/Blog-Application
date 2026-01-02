require('dotenv').config({ debug: true });
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
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

async function hashpass(password) {
  return await bcryptjs.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
}

async function compare(userPass, hashedPassword) {
  return await bcryptjs.compare(userPass, hashedPassword);
}


app.get("/sign-up", (req, res) => {
  try {
    if (req.cookies.jwt) {
      const verify = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      return res.redirect(process.env.CORS_ORIGIN + '/');
    }
    return res.redirect(process.env.CORS_ORIGIN + '/signup');
  } catch (error) {
    console.error("Root route error:", error);
    return res.redirect(process.env.CORS_ORIGIN + '/');
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
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

  
    const newUser = new Collection({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      token: token
    });

   
    await newUser.save();

 
    res.cookie("jwt", token, {
      maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours default
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
      return res.redirect(process.env.CORS_ORIGIN + '/');
    }
    res.redirect(process.env.CORS_ORIGIN + '/login');
  } catch (error) {
    console.error("Login page error:", error);
    return res.redirect(process.env.CORS_ORIGIN + '/login');
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
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    user.token = token;
    await user.save();

    res.cookie("jwt", token, {
      maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000,
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
    const verify = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
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
    console.log("Received request for blog ID:", req.params.id);
    console.log("ID type:", typeof req.params.id);
    
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
    console.log("Received PATCH request for blog ID:", req.params.id);
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
    console.log("Received DELETE request for blog ID:", req.params.id);
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

app.post('/api/logout', (req, res) => {
  // Clear cookie with multiple attempts to ensure it's removed
  res.clearCookie('jwt', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production'
  });
  res.clearCookie('jwt', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  res.clearCookie('jwt', { 
    httpOnly: true, 
    secure: false,
    path: '/'
  });
  // Also clear with domain and other variations
  res.clearCookie('jwt', { 
    httpOnly: true, 
    secure: false,
    path: '/',
    domain: 'localhost'
  });
  res.json({ success: true });
});

app.get('/api/logout', (req, res) => {
  // Clear cookie with multiple attempts to ensure it's removed
  res.clearCookie('jwt', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production'
  });
  res.clearCookie('jwt', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  res.clearCookie('jwt', { 
    httpOnly: true, 
    secure: false,
    path: '/'
  });
  // Also clear with domain and other variations
  res.clearCookie('jwt', { 
    httpOnly: true, 
    secure: false,
    path: '/',
    domain: 'localhost'
  });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});



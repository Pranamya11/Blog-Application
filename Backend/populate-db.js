const { Blog } = require('./server/mongoose.js');
const fs = require('fs');
const path = require('path');

async function populateDatabase() {
  try {
    // Read the JSON file
    const blogDataPath = path.join(__dirname, 'server', 'BLOG_DATA.json');
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    
    console.log('Found', blogData.length, 'posts in JSON file');
    
    // Clear existing posts
    await Blog.deleteMany({});
    console.log('Cleared existing posts from database');
    
               // Insert posts from JSON file
           for (const post of blogData) {
             const newPost = new Blog({
               title: post.title,
               content: post.content,
               author: post.author || 'Anonymous',
               created_at: post.created_at ? new Date(post.created_at) : new Date()
             });
             await newPost.save();
             console.log('Added post:', post.title);
           }
    
    console.log('✅ Database populated successfully!');
    console.log('Total posts in database:', await Blog.countDocuments());
    
  } catch (error) {
    console.error('Error populating database:', error);
  }
  
  // Exit the process
  process.exit(0);
}

populateDatabase(); 
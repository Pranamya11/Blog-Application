const { Blog } = require('./server/mongoose.js');
const fs = require('fs');
const path = require('path');

async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...');
    
    // Read the JSON file
    const blogDataPath = path.join(__dirname, 'server', 'BLOG_DATA.json');
    
    if (!fs.existsSync(blogDataPath)) {
      console.error('❌ BLOG_DATA.json file not found at:', blogDataPath);
      process.exit(1);
    }
    
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
    console.log('📁 Found', blogData.length, 'posts in JSON file');
    
    // Clear existing posts
    console.log('🗑️  Clearing existing posts from database...');
    const deleteResult = await Blog.deleteMany({});
    console.log('✅ Cleared', deleteResult.deletedCount, 'existing posts');
    
    // Insert posts from JSON file
    console.log('📝 Inserting posts into database...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const post of blogData) {
      try {
        const newPost = new Blog({
          title: post.title,
          content: post.content,
          author: post.author || 'Anonymous',
          created_at: post.created_at ? new Date(post.created_at) : new Date()
        });
        await newPost.save();
        console.log('✅ Added post:', post.title);
        successCount++;
      } catch (error) {
        console.error('❌ Failed to add post:', post.title, '- Error:', error.message);
        errorCount++;
      }
    }
    
    // Final summary
    const totalPosts = await Blog.countDocuments();
    console.log('\n📊 Population Summary:');
    console.log('✅ Successfully added:', successCount, 'posts');
    console.log('❌ Failed to add:', errorCount, 'posts');
    console.log('📈 Total posts in database:', totalPosts);
    
    if (successCount > 0) {
      console.log('🎉 Database populated successfully!');
    } else {
      console.log('⚠️  No posts were added to the database');
    }
    
  } catch (error) {
    console.error('💥 Error populating database:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
  
  // Exit the process
  console.log('👋 Exiting...');
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Process interrupted by user');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

populateDatabase(); 
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'



function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Getting Started with JavaScript",
      content: "JavaScript is a powerful programming language that can add interactivity to your website. It's one of the core technologies of the web, along with HTML and CSS.",
      date: "May 15, 2023"
    },
    {
      id: 2,
      title: "The Importance of Responsive Design",
      content: "Responsive web design ensures that your website looks good on all devices. With mobile internet usage surpassing desktop, it's more important than ever to create responsive layouts.",
      date: "June 2, 2023"
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  

  return (
    <div className="app">
      <header>
        <div className="logo">My Blog</div>
        <button onClick={() => setShowForm(!showForm)}>+ New Post</button>
      </header>

      <div className="container">
        {showForm && (
          <div className="blog-form">
            <h2>Create New Blog Post</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="post-title">Title</label>
                <input 
                  type="text" 
                  id="post-title" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="post-content">Content</label>
                <textarea 
                  id="post-content" 
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <button type="submit">Publish Post</button>
            </form>
          </div>
        )}

        <h2>Recent Posts</h2>
        <div className="blog-posts">
          {posts.length === 0 ? (
            <div className="no-posts">No blog posts yet. Create your first post!</div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="blog-card">
                <div className="blog-content">
                  <h3 className="blog-title">{post.title}</h3>
                  <div className="blog-date">{post.date}</div>
                  <p>{post.content}</p>
                </div>
                <div className="blog-actions">
                  <button 
                    className="delete-btn" 
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

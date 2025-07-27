import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to My Blog</h1>
        <p>A place to share thoughts, ideas, and stories with the world</p>
        {isAuthenticated ? (
          <Link to="/create" className="btn btn-primary">
            Write Your Post
          </Link>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login to Start Writing
          </Link>
        )}
      </div>
      
      <div className="Features">Features</div>
      
      <div className="features-section">
        <div className="feature-card">
          <h3>✍️ Create Posts</h3>
          <p>Share your thoughts and ideas with the world through beautifully crafted blog posts</p>
        </div>
        <div className="feature-card">
          <h3>📖 Read Stories</h3>
          <p>Discover interesting content and stories from other writers in our community</p>
        </div>
        <div className="feature-card">
          <h3>🔐 Secure & Private</h3>
          <p>Your content is protected with secure authentication and privacy controls</p>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Join our community of writers and readers today</p>
        <div className="cta-buttons">
          <Link to="/posts" className="btn btn-secondary">
            Browse Posts
          </Link>
          <Link to="/create" className="btn btn-primary">
            Create Post
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 
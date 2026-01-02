import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPosts } from '../api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        // Remove fullscreen state from all post cards
        const postCards = document.querySelectorAll('.post-card');
        postCards.forEach(card => {
          card.classList.remove('fullscreen');
        });
      }
    };

    const handleCardDoubleClick = (event) => {
      const card = event.currentTarget;
      if (card.classList.contains('fullscreen')) {
        // Exit fullscreen
        card.classList.remove('fullscreen');
      } else {
        // Enter fullscreen
        card.classList.add('fullscreen');
      }
    };

    const handleCardClick = (event) => {
      const card = event.currentTarget;
      if (card.classList.contains('fullscreen')) {
        // Exit fullscreen on single click
        card.classList.remove('fullscreen');
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    // Add double-click and click handlers to all post cards
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
      card.addEventListener('dblclick', handleCardDoubleClick);
      card.addEventListener('click', handleCardClick);
    });

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      postCards.forEach(card => {
        card.removeEventListener('dblclick', handleCardDoubleClick);
        card.removeEventListener('click', handleCardClick);
      });
    };
  }, [posts]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <LoadingSpinner message="Loading posts..." />;
  if (error) return <ErrorMessage message={`Error: ${error}`} onRetry={() => window.location.reload()} />;

  return (
    <div className="home-page">
      <div className="hero-section">
        {isAuthenticated && (
          <Link to="/create" className="btn btn-primary">
            Write a Post
          </Link>
        )}
      </div>
      
      <div className="blog-section">
        <h2>Recent Posts</h2>
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts found. Be the first to create one!</p>
            <Link to="/create" className="btn btn-primary">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="posts-container">
            {posts.map(post => (
              <div key={post._id} className="post-card">
                <h3>
                  <Link to={`/post/${post._id}`}>{post.title}</Link>
                </h3>
                <p className="post-excerpt">
                  {post.content.substring(0, 150)}...
                </p>
                <div className="post-meta">
                  <span className="post-date">
                    📅 {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'No date'}
                  </span>
                  {post.author && (
                    <span className="post-author">
                      👤 by {post.author}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
      
      <div className="about-section">
        <h2>About Us</h2>
        <div className="about-content">
          <div className="about-card">
            <h3>🌟 Our Mission</h3>
            <p>We believe everyone has a story worth sharing. Our platform empowers writers to express their thoughts, ideas, and experiences with the world.</p>
          </div>
          <div className="about-card">
            <h3>💡 What We Offer</h3>
            <p>Create beautiful blog posts, connect with other writers, and build your online presence. Our intuitive tools make writing and sharing effortless.</p>
          </div>
          <div className="about-card">
            <h3>🤝 Join Our Community</h3>
            <p>Be part of a growing community of passionate writers and readers. Share your voice and discover amazing stories from around the world.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 